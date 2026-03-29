import React, { useState } from 'react';
import {
    Table, Card, Input, Space, Tag, Button, Modal, Form,
    Select, InputNumber, Typography, Popconfirm, message, Rate, Row, Col,
} from 'antd';
import {
    SearchOutlined, PlusOutlined, EditOutlined,
    DeleteOutlined, TeamOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { MOCK_CLUBURI, type Club } from '../../services/mock/cluburi';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

type Category = Club['category'];
type Level = Club['level'];

const CATEGORIES: Category[] = ['Alergare', 'Ciclism', 'Fitness', 'Yoga', 'Înot', 'Trail'];
const LEVELS: Level[] = ['Începător', 'Intermediar', 'Avansat', 'Toate'];

const CATEGORY_COLORS: Record<Category, string> = {
    Alergare: 'blue', Ciclism: 'green', Fitness: 'orange',
    Yoga: 'purple', Înot: 'cyan', Trail: 'brown',
};
const LEVEL_COLORS: Record<Level, string> = {
    Începător: 'green', Intermediar: 'orange', Avansat: 'red', Toate: 'blue',
};

const AdminClubs: React.FC = () => {
    const [clubs, setClubs] = useState<Club[]>(MOCK_CLUBURI);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
    const [filterLevel, setFilterLevel] = useState<Level | 'all'>('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Club | null>(null);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const filtered = clubs.filter(c => {
        const term = search.toLowerCase();
        const matchSearch =
            c.name.toLowerCase().includes(term) ||
            c.location.toLowerCase().includes(term) ||
            c.description.toLowerCase().includes(term);
        const matchCat = filterCategory === 'all' || c.category === filterCategory;
        const matchLevel = filterLevel === 'all' || c.level === filterLevel;
        return matchSearch && matchCat && matchLevel;
    });

    const openAdd = () => {
        setEditTarget(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (record: Club) => {
        setEditTarget(record);
        form.setFieldsValue(record);
        setModalOpen(true);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            if (editTarget) {
                setClubs(prev =>
                    prev.map(c => c.id === editTarget.id ? { ...editTarget, ...values } : c)
                );
                messageApi.success('Clubul a fost actualizat.');
            } else {
                const newClub: Club = { ...values, id: Date.now() };
                setClubs(prev => [newClub, ...prev]);
                messageApi.success('Clubul a fost adăugat.');
            }
            setModalOpen(false);
        });
    };

    const handleDelete = (id: number) => {
        setClubs(prev => prev.filter(c => c.id !== id));
        messageApi.success('Clubul a fost șters.');
    };

    const columns: ColumnsType<Club> = [
        {
            title: 'Club',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <span style={{ fontSize: 22 }}>{record.icon}</span>
                    <div>
                        <Text strong style={{ display: 'block' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.location}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Categorie',
            dataIndex: 'category',
            key: 'category',
            render: (cat: Category) => <Tag color={CATEGORY_COLORS[cat]}>{cat}</Tag>,
        },
        {
            title: 'Nivel',
            dataIndex: 'level',
            key: 'level',
            render: (level: Level) => <Tag color={LEVEL_COLORS[level]}>{level}</Tag>,
        },
        {
            title: 'Membri',
            dataIndex: 'members',
            key: 'members',
            sorter: (a, b) => a.members - b.members,
            render: (m: number) => <Text strong>{m.toLocaleString()}</Text>,
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            render: (r: number) => (
                <Space>
                    <Rate disabled defaultValue={r} allowHalf style={{ fontSize: 14 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>({r})</Text>
                </Space>
            ),
        },
        {
            title: 'Înființat',
            dataIndex: 'founded',
            key: 'founded',
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
                        title="Șterge clubul"
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
                <Title level={4} style={{ margin: 0 }}>Gestionare Cluburi</Title>
                <Text type="secondary">Adaugă, editează sau șterge cluburi sportive</Text>
            </div>

            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Caută club, locație..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 280 }}
                        allowClear
                    />
                    <Select value={filterCategory} onChange={setFilterCategory} style={{ width: 160 }}>
                        <Option value="all">Toate categoriile</Option>
                        {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
                    </Select>
                    <Select value={filterLevel} onChange={setFilterLevel} style={{ width: 160 }}>
                        <Option value="all">Toate nivelurile</Option>
                        {LEVELS.map(l => <Option key={l} value={l}>{l}</Option>)}
                    </Select>
                    <Text type="secondary">{filtered.length} cluburi găsite</Text>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Adaugă club
                    </Button>
                </Space>
            </Card>

            <Card style={{ borderRadius: 12 }}>
                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={{ pageSize: 8, showSizeChanger: true }}
                    size="middle"
                />
            </Card>

            <Modal
                title={
                    <Space>
                        <TeamOutlined />
                        <span>{editTarget ? 'Editează club' : 'Adaugă club nou'}</span>
                    </Space>
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSave}
                okText={editTarget ? 'Salvează' : 'Adaugă'}
                cancelText="Anulează"
                width={640}
                destroyOnClose
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Row gutter={16}>
                        <Col span={18}>
                            <Form.Item name="name" label="Denumire club"
                                rules={[{ required: true, message: 'Câmp obligatoriu' }]}>
                                <Input placeholder="Ex: Runners Chișinău" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="icon" label="Icon (emoji)">
                                <Input placeholder="🏃" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="description" label="Descriere">
                        <TextArea rows={3} placeholder="Descrierea clubului..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="category" label="Categorie"
                                rules={[{ required: true, message: 'Selectează categoria' }]}>
                                <Select placeholder="Selectează...">
                                    {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="level" label="Nivel">
                                <Select placeholder="Selectează...">
                                    {LEVELS.map(l => <Option key={l} value={l}>{l}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={14}>
                            <Form.Item name="location" label="Locație">
                                <Input placeholder="Ex: Parcul Valea Morilor, Chișinău" />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item name="members" label="Număr membri">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="schedule" label="Program">
                                <Input placeholder="Ex: Sâmbătă & Duminică, 08:00" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="founded" label="Înființat">
                                <Input placeholder="Ex: Martie 2022" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="rating" label="Rating (0-5)">
                                <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="nextEvent" label="Următorul eveniment">
                                <Input placeholder="Ex: Alergare de grup – 1 Martie" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminClubs;
