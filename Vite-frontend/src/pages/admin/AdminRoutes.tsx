import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Card, Input, Space, Tag, Button, Modal, Form,
    Select, InputNumber, Typography, Popconfirm, message,
    Switch, Row, Col, Statistic, Spin, Alert, Tabs,
} from 'antd';
import {
    SearchOutlined, PlusOutlined, EditOutlined,
    DeleteOutlined, CompassOutlined, ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { routeApi, type RouteCreatePayload } from '../../services/api/routeApi';
import type { Traseu, RouteCoord } from '../../types/Route';
import RoutePathBuilder, { calcDistance } from '../../components/RoutePathBuilder';

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
    const [routes, setRoutes] = useState<Traseu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<RouteType | 'all'>('all');
    const [filterDiff, setFilterDiff] = useState<RouteDifficulty | 'all'>('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Traseu | null>(null);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    /* Path & highlights state — outside Form since they're not antd inputs */
    const [path, setPath] = useState<RouteCoord[]>([]);
    const [highlightsInput, setHighlightsInput] = useState('');

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
        setPath([]);
        setHighlightsInput('');
        setModalOpen(true);
    };

    const openEdit = (record: Traseu) => {
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
            icon: record.icon,
            bestSeason: record.bestSeason,
        });
        setPath(record.path ?? []);
        setHighlightsInput((record.highlights ?? []).join(', '));
        setModalOpen(true);
    };

    const handleSave = () => {
        form.validateFields().then(async (values) => {
            const highlights = highlightsInput
                .split(',')
                .map(h => h.trim())
                .filter(Boolean);

            const start = path[0]     ?? { lat: 0, lng: 0 };
            const end   = path[path.length - 1] ?? { lat: 0, lng: 0 };

            /* Auto-fill distance from path if admin left it blank */
            const distance = values.distance ?? (path.length > 1 ? calcDistance(path) : 0);

            const payload: RouteCreatePayload = {
                name:              values.name,
                type:              values.type,
                difficulty:        values.difficulty,
                distance,
                estimatedDuration: values.estimatedDuration ?? 0,
                elevationGain:     values.elevationGain     ?? 0,
                region:            values.region            ?? '',
                surface:           values.surface           ?? '',
                isLoop:            values.isLoop            ?? false,
                description:       values.description       ?? '',
                icon:              values.icon              ?? TYPE_ICONS[values.type] ?? '📍',
                bestSeason:        values.bestSeason        ?? '',
                highlights,
                startLat: start.lat,
                startLng: start.lng,
                endLat:   end.lat,
                endLng:   end.lng,
                path,
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

    const columns: ColumnsType<Traseu> = [
        {
            title: 'Traseu',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <span style={{ fontSize: 20 }}>{record.icon || TYPE_ICONS[record.type] || '📍'}</span>
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
            title: 'Puncte traseu',
            key: 'pathLen',
            render: (_, record) => (
                <Tag color={record.path?.length ? 'blue' : 'default'}>
                    {record.path?.length ?? 0} pts
                </Tag>
            ),
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

            {/* ── Modal adaugă / editează ─────────────────────────────────────── */}
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
                width={820}
                destroyOnClose
                styles={{ body: { maxHeight: '78vh', overflowY: 'auto', paddingRight: 4 } }}
            >
                <Tabs
                    defaultActiveKey="info"
                    items={[
                        {
                            key: 'info',
                            label: '📋 Informații',
                            children: (
                                <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
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
                                            <Form.Item
                                                name="distance"
                                                label={
                                                    <span>
                                                        Distanță (km)
                                                        {path.length > 1 && (
                                                            <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>
                                                                ≈ {calcDistance(path)} km din hartă
                                                            </Text>
                                                        )}
                                                    </span>
                                                }
                                            >
                                                <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="Auto din hartă" />
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
                                        <Col span={8}>
                                            <Form.Item name="region" label="Regiune">
                                                <Input placeholder="Ex: Chișinău" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item name="icon" label="Icon (emoji)">
                                                <Input placeholder="Ex: 🏃" maxLength={4} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item name="bestSeason" label="Sezon recomandat">
                                                <Input placeholder="Ex: Primăvară-Toamnă" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item name="isLoop" label="Traseu circular" valuePropName="checked">
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Repere (separate prin virgulă)"
                                                tooltip="Ex: Podul Înalt, Fântâna Satului, Pădure de Stejar"
                                            >
                                                <Input
                                                    value={highlightsInput}
                                                    onChange={e => setHighlightsInput(e.target.value)}
                                                    placeholder="Reper 1, Reper 2, ..."
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            ),
                        },
                        {
                            key: 'map',
                            label: `🗺️ Traseu pe hartă${path.length > 0 ? ` (${path.length} pts)` : ''}`,
                            children: (
                                <div style={{ paddingTop: 8 }}>
                                    <RoutePathBuilder path={path} onChange={setPath} />
                                </div>
                            ),
                            forceRender: true,
                        },
                    ]}
                />
            </Modal>
        </div>
    );
};

export default AdminRoutes;
