import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Card, Input, Space, Tag, Button, Modal, Form,
    Select, Typography, Popconfirm, message,
    Progress, Row, Col, Statistic, Spin, Alert,
} from 'antd';
import {
    SearchOutlined, PlusOutlined, EditOutlined,
    DeleteOutlined, TrophyOutlined, FireOutlined,
    TeamOutlined, ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
    challengeApi,
    type ChallengeDto,
    type ChallengeCreatePayload,
} from '../../services/api/challengeApi';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DIFFICULTIES = ['Ușor', 'Mediu', 'Greu'];
const DIFFICULTY_COLORS: Record<string, string> = {
    Ușor: 'green', Mediu: 'orange', Greu: 'red',
};

const AdminChallenges: React.FC = () => {
    const [challenges, setChallenges] = useState<ChallengeDto[]>([]);
    const [loading, setLoading]       = useState(false);
    const [saving, setSaving]         = useState(false);
    const [apiError, setApiError]     = useState<string | null>(null);
    const [search, setSearch]         = useState('');
    const [filterDiff, setFilterDiff] = useState<string>('all');
    const [modalOpen, setModalOpen]   = useState(false);
    const [editTarget, setEditTarget] = useState<ChallengeDto | null>(null);
    const [form]                      = Form.useForm();
    const [messageApi, ctxHolder]     = message.useMessage();

    const fetchChallenges = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            const data = await challengeApi.getAll();
            setChallenges(data ?? []);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Nu s-a putut conecta la server.';
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchChallenges(); }, [fetchChallenges]);

    const filtered = challenges.filter(c => {
        const term = search.toLowerCase();
        const matchSearch =
            c.name.toLowerCase().includes(term) ||
            c.description.toLowerCase().includes(term);
        const matchDiff = filterDiff === 'all' || c.difficulty === filterDiff;
        return matchSearch && matchDiff;
    });

    const totalParticipants = challenges.reduce((s, c) => s + c.participants, 0);
    const mostPopular = [...challenges].sort((a, b) => b.participants - a.participants)[0];
    const maxParticipants = Math.max(...challenges.map(c => c.participants), 1);

    const openAdd = () => {
        setEditTarget(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (record: ChallengeDto) => {
        setEditTarget(record);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            duration: record.duration,
            difficulty: record.difficulty,
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        let values: ChallengeCreatePayload;
        try { values = await form.validateFields(); } catch { return; }

        setSaving(true);
        try {
            if (editTarget) {
                const updated = await challengeApi.update(editTarget.id, values);
                setChallenges(prev => prev.map(c => c.id === editTarget.id ? updated : c));
                messageApi.success('Provocarea a fost actualizată.');
            } else {
                const created = await challengeApi.create(values);
                setChallenges(prev => [created, ...prev]);
                messageApi.success('Provocarea a fost adăugată.');
            }
            setModalOpen(false);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Eroare la salvare.';
            messageApi.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await challengeApi.delete(id);
            setChallenges(prev => prev.filter(c => c.id !== id));
            messageApi.success('Provocarea a fost ștearsă.');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Eroare la ștergere.';
            messageApi.error(msg);
        }
    };

    const columns: ColumnsType<ChallengeDto> = [
        {
            title: 'Provocare',
            key: 'name',
            render: (_, r) => (
                <div>
                    <Text strong style={{ display: 'block' }}>{r.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{r.description}</Text>
                </div>
            ),
        },
        {
            title: 'Dificultate',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: (d: string) => <Tag color={DIFFICULTY_COLORS[d] ?? 'default'}>{d}</Tag>,
        },
        {
            title: 'Durată',
            dataIndex: 'duration',
            key: 'duration',
            render: (d: string) => <Tag>{d}</Tag>,
        },
        {
            title: 'Participanți',
            dataIndex: 'participants',
            key: 'participants',
            sorter: (a, b) => a.participants - b.participants,
            render: (p: number) => (
                <Space direction="vertical" size={2} style={{ width: 140 }}>
                    <Text strong>{p.toLocaleString()}</Text>
                    <Progress
                        percent={Math.round((p / maxParticipants) * 100)}
                        size="small"
                        showInfo={false}
                        strokeColor={p === maxParticipants ? '#f5222d' : '#1677ff'}
                    />
                </Space>
            ),
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
                        title="Șterge provocarea"
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
                <Title level={4} style={{ margin: 0 }}>Gestionare Provocări</Title>
                <Text type="secondary">Date live din baza de date SQL Server</Text>
            </div>

            {apiError && (
                <Alert
                    type="error"
                    message="Nu s-a putut conecta la backend"
                    description={`${apiError} — Verifică că serverul .NET rulează și că CORS este configurat.`}
                    style={{ marginBottom: 16 }}
                    action={
                        <Button size="small" icon={<ReloadOutlined />} onClick={fetchChallenges}>
                            Reîncearcă
                        </Button>
                    }
                    closable
                    onClose={() => setApiError(null)}
                />
            )}

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 12, background: '#fffbe6', border: 'none' }}>
                        <Statistic
                            title="Total provocări"
                            value={challenges.length}
                            prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 12, background: '#f6ffed', border: 'none' }}>
                        <Statistic
                            title="Total participanți"
                            value={totalParticipants}
                            prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 12, background: '#fff1f0', border: 'none' }}>
                        <Statistic
                            title="Cea mai populară"
                            value={mostPopular?.name ?? '—'}
                            prefix={<FireOutlined style={{ color: '#f5222d' }} />}
                            valueStyle={{ fontSize: 14 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Caută provocare..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 280 }}
                        allowClear
                    />
                    <Select value={filterDiff} onChange={setFilterDiff} style={{ width: 180 }}>
                        <Option value="all">Toate dificultățile</Option>
                        {DIFFICULTIES.map(d => <Option key={d} value={d}>{d}</Option>)}
                    </Select>
                    <Text type="secondary">{filtered.length} provocări</Text>
                    <Button icon={<ReloadOutlined />} onClick={fetchChallenges} loading={loading}>
                        Reîncarcă
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Adaugă provocare
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
                        locale={{ emptyText: apiError ? 'Backend indisponibil' : 'Nicio provocare găsită' }}
                    />
                </Spin>
            </Card>

            <Modal
                title={
                    <Space>
                        <TrophyOutlined />
                        <span>{editTarget ? 'Editează provocare' : 'Adaugă provocare nouă'}</span>
                    </Space>
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSave}
                okText={editTarget ? 'Salvează' : 'Adaugă'}
                cancelText="Anulează"
                confirmLoading={saving}
                width={560}
                destroyOnClose
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="name" label="Denumire provocare"
                               rules={[{ required: true, message: 'Câmp obligatoriu' }]}>
                        <Input placeholder="Ex: 100 km în Martie" />
                    </Form.Item>

                    <Form.Item name="description" label="Descriere">
                        <TextArea rows={3} placeholder="Descrierea provocării..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="difficulty" label="Dificultate"
                                       rules={[{ required: true, message: 'Selectează dificultatea' }]}>
                                <Select placeholder="Selectează...">
                                    {DIFFICULTIES.map(d => <Option key={d} value={d}>{d}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="duration" label="Durată">
                                <Input placeholder="Ex: 30 zile" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminChallenges;