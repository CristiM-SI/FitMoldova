import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Card, Input, Space, Tag, Button, Modal, Form,
    Select, InputNumber, Typography, Popconfirm, message,
    Switch, Row, Col, Statistic, Spin, Alert,
} from 'antd';
import {
    SearchOutlined, PlusOutlined, EditOutlined,
    DeleteOutlined, CompassOutlined, ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { routeApi, type RouteDto, type RouteCreatePayload } from '../../services/api/routeApi';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

type RouteType = 'alergare' | 'ciclism' | 'drumeție' | 'trail';
type RouteDifficulty = 'Ușor' | 'Mediu' | 'Avansat';
type RouteSurface = 'asfalt' | 'macadam' | 'potecă' | 'mix';

const ROUTE_TYPES: RouteType[] = ['alergare', 'ciclism', 'drumeție', 'trail'];
const DIFFICULTIES: RouteDifficulty[] = ['Ușor', 'Mediu', 'Avansat'];
const SURFACES: RouteSurface[] = ['asfalt', 'macadam', 'potecă', 'mix'];

const TYPE_COLORS: Record<string, string> = {
    alergare: 'blue', ciclism: 'green', drumeție: 'orange', trail: 'brown',
};
const DIFF_COLORS: Record<string, string> = {
    Ușor: 'green', Mediu: 'orange', Avansat: 'red',
};
const TYPE_ICONS: Record<string, string> = {
    alergare: '🏃', ciclism: '🚴', drumeție: '🥾', trail: '⛰️',
};

const AdminRoutes: React.FC = () => {
    const [routes, setRoutes] = useState<RouteDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<RouteType | 'all'>('all');
    const [filterDiff, setFilterDiff] = useState<RouteDifficulty | 'all'>('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<RouteDto | null>(null);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const fetchRoutes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await routeApi.getAll();
            setRoutes(data);
        } catch {
            setError('Nu s-au putut încărca traseele. Verifică că serverul rulează.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

    const filtered = routes.filter(r => {
        const term = search.toLowerCase();
        const matchSearch =
            r.name.toLowerCase().includes(term) ||
            r.region.toLowerCase().includes(term) ||
            r.description.toLowerCase().includes(term);
        const matchType = filterType === 'all' || r.type === filterType;
        const matchDiff = filterDiff === 'all' || r.difficulty === filterDiff;
        return matchSearch && matchType && matchDiff;
    });

    const totalDistance = routes.reduce((s, r) => s + (r.distance ?? 0), 0);
    const avgDuration = routes.length > 0
        ? Math.round(routes.reduce((s, r) => s + (r.estimatedDuration ?? 0), 0) / routes.length)
        : 0;

    const openAdd = () => {
        setEditTarget(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (record: RouteDto) => {
        setEditTarget(record);
        form.setFieldsValue({
            name: record.name,
            type: record.type,
            difficulty: record.difficulty,
            distance: record.distance,
            estimatedDuration: record.estimatedDuration,
            elevationGain: record.elevationGain,
            region: record.region,
            surface: record.surface,
            isLoop: record.isLoop,
            description: record.description,
        });
        setModalOpen(true);
    };

    const handleSave = () => {
        form.validateFields().then(async (values) => {
            const payload: RouteCreatePayload = {
                name: values.name,
                type: values.type,
                difficulty: values.difficulty,
                distance: values.distance ?? 0,
                estimatedDuration: values.estimatedDuration ?? 0,
                elevationGain: values.elevationGain ?? 0,
                region: values.region ?? '',
                surface: values.surface ?? '',
                isLoop: values.isLoop ?? false,
                description: values.description ?? '',
            };

            setActionLoading(true);
            try {
                if (editTarget) {
                    const updated = await routeApi.update(editTarget.id, payload);
                    setRoutes(prev => prev.map(r => r.id === editTarget.id ? updated : r));
                    messageApi.success('Traseul a fost actualizat.');
                } else {
                    const created = await routeApi.create(payload);
                    setRoutes(prev => [created, ...prev]);
                    messageApi.success('Traseul a fost adăugat.');
                }
                setModalOpen(false);
            } catch {
                messageApi.error('Eroare la salvarea traseului.');
            } finally {
                setActionLoading(false);
            }
        });
    };

    const handleDelete = async (id: number) => {
        setActionLoading(true);
        try {
            await routeApi.delete(id);
            setRoutes(prev => prev.filter(r => r.id !== id));
            messageApi.success('Traseul a fost șters.');
        } catch {
            messageApi.error('Eroare la ștergerea traseului.');
        } finally {
            setActionLoading(false);
        }
    };

    const columns: ColumnsType<RouteDto> = [
        {
            title: 'Traseu',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <span style={{ fontSize: 20 }}>{TYPE_ICONS[record.type] ?? '📍'}</span>
                    <div>
                        <Text strong style={{ display: 'block' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.region}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Tip',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color={TYPE_COLORS[type] ?? 'default'}>
                    {TYPE_ICONS[type] ?? ''} {type}
                </Tag>
            ),
        },
        {
            title: 'Dificultate',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: (diff: string) => <Tag color={DIFF_COLORS[diff] ?? 'default'}>{diff}</Tag>,
        },
        {
            title: 'Distanță',
            dataIndex: 'distance',
            key: 'distance',
            sorter: (a, b) => a.distance - b.distance,
            render: (d: number) => <Text strong>{d} km</Text>,
        },
        {
            title: 'Durată est.',
            dataIndex: 'estimatedDuration',
            key: 'estimatedDuration',
            sorter: (a, b) => a.estimatedDuration - b.estimatedDuration,
            render: (d: number) => `${d} min`,
        },
        {
            title: 'Denivelare',
            dataIndex: 'elevationGain',
            key: 'elevationGain',
            render: (e: number) => `+${e} m`,
        },
        {
            title: 'Suprafață',
            dataIndex: 'surface',
            key: 'surface',
            render: (s: string) => <Tag>{s}</Tag>,
        },
        {
            title: 'Circuit',
            dataIndex: 'isLoop',
            key: 'isLoop',
            render: (v: boolean) => v
                ? <Tag color="green">Da</Tag>
                : <Tag color="default">Nu</Tag>,
        },
        {
            title: 'Acțiuni',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
                        Editează
                    </Button>
                    <Popconfirm
                        title="Șterge traseul"
                        description="Această acțiune este ireversibilă."
                        onConfirm={() => handleDelete(record.id)}
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
            {contextHolder}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Gestionare Trasee</Title>
                    <Text type="secondary">Administrează traseele sportive din platformă</Text>
                </div>
                <Button icon={<ReloadOutlined />} onClick={fetchRoutes} loading={loading}>
                    Reîncarcă
                </Button>
            </div>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    style={{ marginBottom: 16, borderRadius: 8 }}
                    action={<Button size="small" onClick={fetchRoutes}>Reîncearcă</Button>}
                />
            )}

            {/* Summary */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 12, background: '#f9f0ff', border: 'none' }}>
                        <Statistic
                            title="Total trasee"
                            value={routes.length}
                            prefix={<CompassOutlined style={{ color: '#722ed1' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 12, background: '#e6f4ff', border: 'none' }}>
                        <Statistic
                            title="Distanță totală"
                            value={totalDistance.toFixed(1)}
                            suffix="km"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 12, background: '#f6ffed', border: 'none' }}>
                        <Statistic
                            title="Durată medie"
                            value={avgDuration}
                            suffix="min"
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Caută traseu, regiune..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 280 }}
                        allowClear
                    />
                    <Select value={filterType} onChange={setFilterType} style={{ width: 150 }}>
                        <Option value="all">Toate tipurile</Option>
                        {ROUTE_TYPES.map(t => <Option key={t} value={t}>{t}</Option>)}
                    </Select>
                    <Select value={filterDiff} onChange={setFilterDiff} style={{ width: 160 }}>
                        <Option value="all">Toate dificultățile</Option>
                        {DIFFICULTIES.map(d => <Option key={d} value={d}>{d}</Option>)}
                    </Select>
                    <Text type="secondary">{filtered.length} trasee găsite</Text>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Adaugă traseu
                    </Button>
                </Space>
            </Card>

            <Card style={{ borderRadius: 12 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 48 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 12 }}>Se încarcă traseele...</div>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filtered}
                        rowKey="id"
                        pagination={{ pageSize: 8, showSizeChanger: true }}
                        size="middle"
                        scroll={{ x: 900 }}
                    />
                )}
            </Card>

            <Modal
                title={
                    <Space>
                        <CompassOutlined />
                        <span>{editTarget ? 'Editează traseu' : 'Adaugă traseu nou'}</span>
                    </Space>
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSave}
                okText={editTarget ? 'Salvează' : 'Adaugă'}
                cancelText="Anulează"
                confirmLoading={actionLoading}
                width={680}
                destroyOnClose
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="name" label="Denumire traseu"
                        rules={[{ required: true, message: 'Câmp obligatoriu' }]}>
                        <Input placeholder="Ex: Parcul Valea Morilor - Buiucani" />
                    </Form.Item>

                    <Form.Item name="description" label="Descriere">
                        <TextArea rows={3} placeholder="Descrierea traseului..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="type" label="Tip traseu"
                                rules={[{ required: true, message: 'Selectează' }]}>
                                <Select placeholder="Selectează...">
                                    {ROUTE_TYPES.map(t => <Option key={t} value={t}>{TYPE_ICONS[t]} {t}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="difficulty" label="Dificultate"
                                rules={[{ required: true, message: 'Selectează' }]}>
                                <Select placeholder="Selectează...">
                                    {DIFFICULTIES.map(d => <Option key={d} value={d}>{d}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="surface" label="Suprafață">
                                <Select placeholder="Selectează...">
                                    {SURFACES.map(s => <Option key={s} value={s}>{s}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="distance" label="Distanță (km)">
                                <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="estimatedDuration" label="Durată (min)">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="elevationGain" label="Denivelare (m)">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="region" label="Regiune">
                                <Input placeholder="Ex: Chișinău" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="isLoop" label="Traseu circular" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminRoutes;
