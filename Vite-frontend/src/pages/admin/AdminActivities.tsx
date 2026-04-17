import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Card, Input, Space, Tag, Button, Modal, Form,
    Select, InputNumber, Typography, Popconfirm, message,
    Row, Col, Spin, Alert, Upload, Image as AntImage,
} from 'antd';
import {
    SearchOutlined, PlusOutlined, EditOutlined,
    DeleteOutlined, ThunderboltOutlined, ReloadOutlined,
    UploadOutlined, LinkOutlined, DeleteFilled,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RcFile } from 'antd/es/upload';
import {
    activityApi,
    type ActivityDto,
    type ActivityCreatePayload,
    type ActivityUpdatePayload,
} from '../../services/api/activityApi';

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

// Limită pentru upload (2MB) — imaginile mari se stochează ca base64 în DB,
// deci nu vrem să umflăm coloana ImageUrl peste măsură.
const MAX_IMAGE_MB = 2;

/** Convertește un File în string base64 DataURL (ex: "data:image/png;base64,iVBORw..."). */
function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Nu s-a putut citi fișierul.'));
        reader.readAsDataURL(file);
    });
}

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

    // Starea pentru imagine — păstrată separat de form ca să avem preview live
    const [imageSrc, setImageSrc] = useState<string>('');
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');

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
        setImageSrc('');
        setImageMode('url');
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
        });
        setImageSrc(record.imageUrl || '');
        // Detectăm dacă imaginea salvată e base64 (upload) sau URL extern
        setImageMode(record.imageUrl?.startsWith('data:') ? 'upload' : 'url');
        setModalOpen(true);
    };

    const handleBeforeUpload = async (file: RcFile): Promise<boolean> => {
        if (!file.type.startsWith('image/')) {
            messageApi.error('Fișierul trebuie să fie o imagine.');
            return false;
        }
        const sizeMb = file.size / 1024 / 1024;
        if (sizeMb > MAX_IMAGE_MB) {
            messageApi.error(`Imaginea depășește ${MAX_IMAGE_MB}MB (actual: ${sizeMb.toFixed(1)}MB).`);
            return false;
        }
        try {
            const dataUrl = await fileToDataUrl(file);
            setImageSrc(dataUrl);
            messageApi.success('Imagine încărcată.');
        } catch (err) {
            messageApi.error(err instanceof Error ? err.message : 'Eroare la citire.');
        }
        // Returnăm false ca să împiedicăm Upload-ul Ant Design să facă request HTTP.
        // Noi păstrăm imaginea local ca DataURL.
        return false;
    };

    const handleSave = async () => {
        let values: Omit<ActivityCreatePayload, 'userId' | 'imageUrl'>;
        try {
            values = await form.validateFields();
        } catch {
            return;
        }

        setSaving(true);
        try {
            if (editTarget) {
                const updatePayload: ActivityUpdatePayload = {
                    name:        values.name,
                    type:        values.type,
                    distance:    values.distance ?? '',
                    duration:    values.duration ?? '',
                    calories:    values.calories ?? 0,
                    date:        values.date,
                    description: values.description ?? '',
                    imageUrl:    imageSrc,
                };
                await activityApi.update(editTarget.id, updatePayload);
                messageApi.success('Activitatea a fost actualizată.');
            } else {
                const createPayload: ActivityCreatePayload = {
                    ...values,
                    distance:    values.distance ?? '',
                    duration:    values.duration ?? '',
                    calories:    values.calories ?? 0,
                    description: values.description ?? '',
                    imageUrl:    imageSrc,
                    userId:      ADMIN_USER_ID,
                };
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
            title: '',
            key: 'image',
            width: 60,
            render: (_, r) => (
                r.imageUrl
                    ? <AntImage src={r.imageUrl} width={44} height={44} style={{ objectFit: 'cover', borderRadius: 6 }} preview={false} fallback="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA0NCA0NCc+PHJlY3Qgd2lkdGg9JzQ0JyBoZWlnaHQ9JzQ0JyBmaWxsPScjZjBmMGYwJy8+PC9zdmc+" />
                    : <div style={{ width: 44, height: 44, background: '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 18 }}>🏃</div>
            ),
        },
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
        { title: 'Distanță', dataIndex: 'distance', key: 'distance' },
        { title: 'Durată',   dataIndex: 'duration', key: 'duration' },
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
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>Editează</Button>
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
                <Text type="secondary">Date live din baza de date PostgreSQL</Text>
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

                    {/* ── Imagine: URL sau upload din PC ─────────────────────────── */}
                    <Form.Item label="Imagine activitate">
                        <Space.Compact style={{ marginBottom: 8 }}>
                            <Button
                                type={imageMode === 'url' ? 'primary' : 'default'}
                                icon={<LinkOutlined />}
                                onClick={() => setImageMode('url')}
                            >
                                URL
                            </Button>
                            <Button
                                type={imageMode === 'upload' ? 'primary' : 'default'}
                                icon={<UploadOutlined />}
                                onClick={() => setImageMode('upload')}
                            >
                                Din PC
                            </Button>
                        </Space.Compact>

                        {imageMode === 'url' ? (
                            <Input
                                placeholder="https://..."
                                value={imageSrc.startsWith('data:') ? '' : imageSrc}
                                onChange={e => setImageSrc(e.target.value)}
                                allowClear
                            />
                        ) : (
                            <Upload.Dragger
                                accept="image/*"
                                multiple={false}
                                showUploadList={false}
                                beforeUpload={handleBeforeUpload}
                                style={{ padding: '8px 0' }}
                            >
                                <p style={{ margin: 0, fontSize: 14 }}>
                                    <UploadOutlined style={{ marginRight: 8 }} />
                                    Trage un fișier aici sau click pentru selectare
                                </p>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Max {MAX_IMAGE_MB}MB. Format JPG/PNG/WebP.
                                </Text>
                            </Upload.Dragger>
                        )}

                        {imageSrc && (
                            <div style={{
                                marginTop: 12, padding: 8, border: '1px solid #f0f0f0',
                                borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12,
                            }}>
                                <AntImage
                                    src={imageSrc}
                                    width={80}
                                    height={80}
                                    style={{ objectFit: 'cover', borderRadius: 6 }}
                                    fallback="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA4MCA4MCc+PHJlY3Qgd2lkdGg9JzgwJyBoZWlnaHQ9JzgwJyBmaWxsPScjZjBmMGYwJy8+PHRleHQgeD0nNTAlJyB5PSc1MCUnIGZvbnQtc2l6ZT0nMTInIGZpbGw9JyM5OTknIHRleHQtYW5jaG9yPSdtaWRkbGUnIGR5PScuM2VtJz5OL0E8L3RleHQ+PC9zdmc+"
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Text strong style={{ display: 'block' }}>Previzualizare</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {imageSrc.startsWith('data:')
                                            ? 'Imagine încărcată local (base64)'
                                            : 'URL extern'}
                                    </Text>
                                </div>
                                <Button
                                    danger
                                    size="small"
                                    icon={<DeleteFilled />}
                                    onClick={() => setImageSrc('')}
                                >
                                    Șterge
                                </Button>
                            </div>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminActivities;
