import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Card, Input, Space, Tag, Button, Modal, Form,
    Select, InputNumber, Typography, Popconfirm, message,
    Row, Col, Spin, Alert,
} from 'antd';
import {
    SearchOutlined, PlusOutlined, EditOutlined,
    DeleteOutlined, ThunderboltOutlined, ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
    activityApi,
    type ActivityDto,
    type ActivityCreatePayload,
    type ActivityUpdatePayload,
} from '../../services/API/activityApi';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// UserId fix pentru admin — ajustează după ce autentificarea e completă
const ADMIN_USER_ID = 1;

const TYPES = ['Alergare', 'Ciclism', 'Înot', 'Fitness', 'Yoga', 'Trail', 'Drumeție'];
const TYPE_COLORS: Record<string, string> = {
    Alergare: 'blue', Ciclism: 'green', Înot: 'cyan', Fitness: 'orange',
    Yoga: 'purple', Trail: 'lime', Drumeție: 'gold',
};

const AdminActivities: React.FC = () => {
    const [activities, setActivities] = useState<ActivityDto[]>([]);
    const [loading, setLoading]       = useState(false);
    const [saving, setSaving]         = useState(false);
    const [apiError, setApiError]     = useState<string | null>(null);
    const [search, setSearch]         = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [modalOpen, setModalOpen]   = useState(false);
    const [editTarget, setEditTarget] = useState<ActivityDto | null>(null);
    const [form]                      = Form.useForm();
    const [messageApi, ctxHolder]     = message.useMessage();

    const fetchActivities = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            const data = await activityApi.getAll();
            setActivities(data ?? []);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Nu s-a putut conecta la server.';
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchActivities(); }, [fetchActivities]);

    const filtered = activities.filter(a => {
        const term = search.toLowerCase();
        const matchSearch =
            a.name.toLowerCase().includes(term) ||
            a.description.toLowerCase().includes(term) ||
            a.createdBy.toLowerCase().includes(term);
        const matchType = filterType === 'all' || a.type === filterType;
        return matchSearch && matchType;
    });

    const openAdd = () => {
        setEditTarget(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (record: ActivityDto) => {
        setEditTarget(record);
        form.setFieldsValue({
            name:        record.name,
            type:        record.type,
            distance:    record.distance,
            duration:    record.duration,
            calories:    record.calories,
            date:        record.date.substring(0, 16),
            description: record.description,
            imageUrl:    record.imageUrl,
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        let values: ActivityCreatePayload & ActivityUpdatePayload;
        try { values = await form.validateFields(); } catch { return; }

        setSaving(true);
        try {
            if (editTarget) {
                const updatePayload: ActivityUpdatePayload = {
                    name:        values.name,
                    type:        values.type,
                    distance:    values.distance,
                    duration:    values.duration,
                    calories:    values.calories,
                    date:        values.date,
                    description: values.description,
                    imageUrl:    values.imageUrl,
                };
                await activityApi.update(editTarget.id, updatePayload);
                messageApi.success('Activitatea a fost actualizată.');
            } else {
                const createPayload: ActivityCreatePayload = { ...values, userId: ADMIN_USER_ID };
                await activityApi.create(createPayload);
                messageApi.success('Activitatea a fost adăugată.');
            }
            setModalOpen(false);
            await fetchActivities();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Eroare la salvare.';
            messageApi.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await activityApi.delete(id);
            setActivities(prev => prev.filter(a => a.id !== id));
            messageApi.success('Activitatea a fost ștearsă.');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Eroare la ștergere.';
            messageApi.error(msg);
        }
    };

    const columns: ColumnsType<ActivityDto> = [
        {
            title: 'Activitate',
            key: 'name',
            render: (_, r) => (
                <div>
                    <Text strong style={{ display: 'block' }}>{r.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>de {r.createdBy}</Text>
                </div>
            ),
        },
        {
            title: 'Tip',
            dataIndex: 'type',
            key: 'type',
            render: (t: string) => <Tag color={TYPE_COLORS[t] ?? 'default'}>{t}</Tag>,
        },
        {
            title: 'Distanță',
            dataIndex: 'distance',
            key: 'distance',
        },
        {
            title: 'Durată',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Calorii',
            dataIndex: 'calories',
            key: 'calories',
            sorter: (a, b) => a.calories - b.calories,
            render: (c: number) => <Text strong>{c} kcal</Text>,
        },
        {
            title: 'Participanți',
            dataIndex: 'participantsCount',
            key: 'participantsCount',
            sorter: (a, b) => a.participantsCount - b.participantsCount,
        },
        {
            title: 'Dată',
            dataIndex: 'date',
            key: 'date',
            render: (d: string) => new Date(d).toLocaleDateString('ro-RO'),
            sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        },
        {
            title: 'Acțiuni',
            key: 'actions',
            render: (_, r) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>
                        Editează
                    </Button>
                    <Popconfirm
                        title="Șterge activitatea"
                        description="Această acțiune este ireversibilă."
                        onConfirm={() => handleDelete(r.id)}
                        okText="Șterge"
                        cancelText="Anulează"
                        okButtonProps={{ danger: true }}
                    >
                        <Button size="small" danger icon={<DeleteOutlined />}>Șterge</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {ctxHolder}

            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>Gestionare Activități</Title>
                <Text type="secondary">Date live din baza de date SQL Server</Text>
            </div>

            {apiError && (
                <Alert
                    type="error"
                    message="Nu s-a putut conecta la backend"
                    description={`${apiError} — Verifică că serverul .NET rulează și că CORS este configurat.`}
                    style={{ marginBottom: 16 }}
                    action={
                        <Button size="small" icon={<ReloadOutlined />} onClick={fetchActivities}>
                            Reîncearcă
                        </Button>
                    }
                    closable
                    onClose={() => setApiError(null)}
                />
            )}

            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Caută activitate sau creator..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                    <Select value={filterType} onChange={setFilterType} style={{ width: 180 }}>
                        <Option value="all">Toate tipurile</Option>
                        {TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}
                    </Select>
                    <Text type="secondary">{filtered.length} activități</Text>
                    <Button icon={<ReloadOutlined />} onClick={fetchActivities} loading={loading}>
                        Reîncarcă
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Adaugă activitate
                    </Button>
                </Space>
            </Card>

            <Card style={{ borderRadius: 12 }}>
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={filtered}
                        rowKey="id"
                        pagination={{ pageSize: 8, showSizeChanger: true }}
                        size="middle"
                        locale={{ emptyText: apiError ? 'Backend indisponibil' : 'Nicio activitate găsită' }}
                    />
                </Spin>
            </Card>

            <Modal
                title={
                    <Space>
                        <ThunderboltOutlined />
                        <span>{editTarget ? 'Editează activitate' : 'Adaugă activitate nouă'}</span>
                    </Space>
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSave}
                okText={editTarget ? 'Salvează' : 'Adaugă'}
                cancelText="Anulează"
                confirmLoading={saving}
                width={680}
                destroyOnClose
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="name" label="Denumire activitate"
                               rules={[{ required: true, message: 'Câmp obligatoriu' }]}>
                        <Input placeholder="Ex: Alergare în Parcul Central" />
                    </Form.Item>

                    <Form.Item name="description" label="Descriere">
                        <TextArea rows={3} placeholder="Descrierea activității..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="type" label="Tip activitate"
                                       rules={[{ required: true, message: 'Selectează tipul' }]}>
                                <Select placeholder="Selectează...">
                                    {TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="date" label="Dată și oră"
                                       rules={[{ required: true, message: 'Câmp obligatoriu' }]}>
                                <Input type="datetime-local" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="distance" label="Distanță">
                                <Input placeholder="Ex: 10 km" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="duration" label="Durată">
                                <Input placeholder="Ex: 1h 30min" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="calories" label="Calorii">
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="500" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="imageUrl" label="URL imagine">
                        <Input placeholder="https://..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminActivities;