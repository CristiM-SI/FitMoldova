import React, { useState } from 'react';
import {
    Table, Card, Input, Space, Tag, Button, Modal, Form,
    Select, InputNumber, Typography, Popconfirm, message,
    Progress, Row, Col, Statistic,
} from 'antd';
import {
    SearchOutlined, PlusOutlined, EditOutlined,
    DeleteOutlined, TrophyOutlined, FireOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { MOCK_PROVOCARI, type Provocare } from '../../services/mock/provocari';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

type Difficulty = Provocare['difficulty'];

const DIFFICULTIES: Difficulty[] = ['Ușor', 'Mediu', 'Greu'];
const DIFFICULTY_COLORS: Record<Difficulty, string> = {
    Ușor: 'green', Mediu: 'orange', Greu: 'red',
};

const AdminChallenges: React.FC = () => {
    const [challenges, setChallenges] = useState<Provocare[]>(MOCK_PROVOCARI);
    const [search, setSearch] = useState('');
    const [filterDiff, setFilterDiff] = useState<Difficulty | 'all'>('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Provocare | null>(null);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

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

    const openAdd = () => {
        setEditTarget(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (record: Provocare) => {
        setEditTarget(record);
        form.setFieldsValue(record);
        setModalOpen(true);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            if (editTarget) {
                setChallenges(prev =>
                    prev.map(c => c.id === editTarget.id ? { ...editTarget, ...values } : c)
                );
                messageApi.success('Provocarea a fost actualizată.');
            } else {
                const newChallenge: Provocare = { ...values, id: Date.now() };
                setChallenges(prev => [newChallenge, ...prev]);
                messageApi.success('Provocarea a fost adăugată.');
            }
            setModalOpen(false);
        });
    };

    const handleDelete = (id: number) => {
        setChallenges(prev => prev.filter(c => c.id !== id));
        messageApi.success('Provocarea a fost ștearsă.');
    };

    const maxParticipants = Math.max(...challenges.map(c => c.participants));

    const columns: ColumnsType<Provocare> = [
        {
            title: 'Provocare',
            key: 'name',
            render: (_, record) => (
                <div>
                    <Text strong style={{ display: 'block' }}>{record.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
                </div>
            ),
        },
        {
            title: 'Dificultate',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: (diff: Difficulty) => <Tag color={DIFFICULTY_COLORS[diff]}>{diff}</Tag>,
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
            title: 'Progres mediu',
            dataIndex: 'progress',
            key: 'progress',
            render: (p?: number) =>
                p != null
                    ? <Progress percent={p} size="small" style={{ width: 100 }} />
                    : <Text type="secondary">—</Text>,
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
                        title="Șterge provocarea"
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
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>Gestionare Provocări</Title>
                <Text type="secondary">Adaugă, editează sau șterge provocările sportive</Text>
            </div>

            {/* Summary cards */}
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
                    <Select value={filterDiff} onChange={setFilterDiff} style={{ width: 160 }}>
                        <Option value="all">Toate dificultățile</Option>
                        {DIFFICULTIES.map(d => <Option key={d} value={d}>{d}</Option>)}
                    </Select>
                    <Text type="secondary">{filtered.length} provocări găsite</Text>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Adaugă provocare
                    </Button>
                </Space>
            </Card>

            <Card style={{ borderRadius: 12 }}>
                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                    size="middle"
                />
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
                        <Col span={8}>
                            <Form.Item name="difficulty" label="Dificultate"
                                rules={[{ required: true, message: 'Selectează' }]}>
                                <Select placeholder="Selectează...">
                                    {DIFFICULTIES.map(d => <Option key={d} value={d}>{d}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="duration" label="Durată">
                                <Input placeholder="Ex: 30 zile" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="participants" label="Participanți">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="progress" label="Progres mediu (%)">
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminChallenges;
