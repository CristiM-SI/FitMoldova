import React, { useState } from 'react';
import {
    Table, Card, Input, Space, Tag, Button, Modal, Form,
    Select, InputNumber, Typography, Popconfirm, message,
    Badge, Row, Col,
} from 'antd';
import {
    SearchOutlined, PlusOutlined, EditOutlined,
    DeleteOutlined, CalendarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { MOCK_EVENIMENTE, type Eveniment } from '../../services/mock/evenimente';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

type Category = Eveniment['category'];
type Difficulty = Eveniment['difficulty'];

const CATEGORIES: Category[] = ['Maraton', 'Ciclism', 'Yoga', 'Fitness', 'Trail', 'Înot', 'Social'];
const DIFFICULTIES: Difficulty[] = ['Ușor', 'Mediu', 'Avansat', 'Toate'];
const CATEGORY_COLORS: Record<Category, string> = {
    Maraton: 'red', Ciclism: 'blue', Yoga: 'purple', Fitness: 'orange',
    Trail: 'green', Înot: 'cyan', Social: 'magenta',
};

const AdminEvents: React.FC = () => {
    const [events, setEvents] = useState<Eveniment[]>(MOCK_EVENIMENTE);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Eveniment | null>(null);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const filtered = events.filter(ev => {
        const term = search.toLowerCase();
        const matchSearch =
            ev.name.toLowerCase().includes(term) ||
            ev.city.toLowerCase().includes(term) ||
            ev.organizer.toLowerCase().includes(term);
        const matchCat = filterCategory === 'all' || ev.category === filterCategory;
        return matchSearch && matchCat;
    });

    const openAdd = () => {
        setEditTarget(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (record: Eveniment) => {
        setEditTarget(record);
        form.setFieldsValue({
            name: record.name,
            icon: record.icon,
            description: record.description,
            date: record.date,
            time: record.time,
            location: record.location,
            city: record.city,
            category: record.category,
            participants: record.participants,
            maxParticipants: record.maxParticipants,
            price: record.price,
            organizer: record.organizer,
            difficulty: record.difficulty,
        });
        setModalOpen(true);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            if (editTarget) {
                setEvents(prev =>
                    prev.map(ev => ev.id === editTarget.id ? { ...editTarget, ...values } : ev)
                );
                messageApi.success('Evenimentul a fost actualizat.');
            } else {
                const newEvent: Eveniment = {
                    ...values,
                    id: Date.now(),
                    tags: [],
                    lat: 47.02,
                    lng: 28.83,
                };
                setEvents(prev => [newEvent, ...prev]);
                messageApi.success('Evenimentul a fost adăugat.');
            }
            setModalOpen(false);
        });
    };

    const handleDelete = (id: number) => {
        setEvents(prev => prev.filter(ev => ev.id !== id));
        messageApi.success('Evenimentul a fost șters.');
    };

    const columns: ColumnsType<Eveniment> = [
        {
            title: 'Eveniment',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <span style={{ fontSize: 20 }}>{record.icon}</span>
                    <div>
                        <Text strong style={{ display: 'block' }}>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.organizer}</Text>
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
            title: 'Dată & Oră',
            key: 'datetime',
            render: (_, record) => (
                <div>
                    <Text style={{ display: 'block' }}>
                        {new Date(record.date).toLocaleDateString('ro-RO')}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.time}</Text>
                </div>
            ),
            sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        },
        {
            title: 'Localitate',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: 'Participanți',
            key: 'participants',
            render: (_, record) => {
                const pct = Math.round((record.participants / record.maxParticipants) * 100);
                const color = pct >= 90 ? 'red' : pct >= 60 ? 'orange' : 'green';
                return (
                    <div>
                        <Badge
                            count={`${record.participants}/${record.maxParticipants}`}
                            style={{ backgroundColor: color, fontSize: 11 }}
                        />
                        <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>
                            ({pct}%)
                        </Text>
                    </div>
                );
            },
        },
        {
            title: 'Preț',
            dataIndex: 'price',
            key: 'price',
            render: (price: string) => (
                <Tag color={price === 'Gratuit' ? 'green' : 'gold'}>{price}</Tag>
            ),
        },
        {
            title: 'Dificultate',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: (diff: Difficulty) => {
                const colors: Record<Difficulty, string> = {
                    'Ușor': 'green', 'Mediu': 'orange', 'Avansat': 'red', 'Toate': 'blue',
                };
                return <Tag color={colors[diff]}>{diff}</Tag>;
            },
        },
        {
            title: 'Acțiuni',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openEdit(record)}
                    >
                        Editează
                    </Button>
                    <Popconfirm
                        title="Șterge evenimentul"
                        description="Această acțiune este ireversibilă."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Șterge"
                        cancelText="Anulează"
                        okButtonProps={{ danger: true }}
                    >
                        <Button size="small" danger icon={<DeleteOutlined />}>
                            Șterge
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {contextHolder}
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>Gestionare Evenimente</Title>
                <Text type="secondary">Adaugă, editează sau șterge evenimente din platformă</Text>
            </div>

            {/* Filters */}
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Caută eveniment, oraș sau organizator..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 320 }}
                        allowClear
                    />
                    <Select
                        value={filterCategory}
                        onChange={setFilterCategory}
                        style={{ width: 180 }}
                    >
                        <Option value="all">Toate categoriile</Option>
                        {CATEGORIES.map(c => (
                            <Option key={c} value={c}>{c}</Option>
                        ))}
                    </Select>
                    <Text type="secondary">{filtered.length} evenimente găsite</Text>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openAdd}
                        style={{ marginLeft: 'auto' }}
                    >
                        Adaugă eveniment
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

            {/* Add / Edit Modal */}
            <Modal
                title={
                    <Space>
                        <CalendarOutlined />
                        <span>{editTarget ? 'Editează eveniment' : 'Adaugă eveniment nou'}</span>
                    </Space>
                }
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleSave}
                okText={editTarget ? 'Salvează' : 'Adaugă'}
                cancelText="Anulează"
                width={680}
                destroyOnClose
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Row gutter={16}>
                        <Col span={18}>
                            <Form.Item
                                name="name"
                                label="Denumire eveniment"
                                rules={[{ required: true, message: 'Câmp obligatoriu' }]}
                            >
                                <Input placeholder="Ex: Maratonul Chișinău 2027" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="icon" label="Icon (emoji)">
                                <Input placeholder="🏅" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="description" label="Descriere">
                        <TextArea rows={3} placeholder="Descrierea evenimentului..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="date"
                                label="Dată (AAAA-LL-ZZ)"
                                rules={[{ required: true, message: 'Câmp obligatoriu' }]}
                            >
                                <Input placeholder="2027-04-15" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="time" label="Oră (HH:MM)">
                                <Input placeholder="08:00" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={14}>
                            <Form.Item name="location" label="Locație">
                                <Input placeholder="Ex: Piața Marii Adunări Naționale" />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                name="city"
                                label="Oraș"
                                rules={[{ required: true, message: 'Câmp obligatoriu' }]}
                            >
                                <Input placeholder="Chișinău" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="category"
                                label="Categorie"
                                rules={[{ required: true, message: 'Selectează categoria' }]}
                            >
                                <Select placeholder="Selectează...">
                                    {CATEGORIES.map(c => (
                                        <Option key={c} value={c}>{c}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="difficulty" label="Dificultate">
                                <Select placeholder="Selectează...">
                                    {DIFFICULTIES.map(d => (
                                        <Option key={d} value={d}>{d}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="participants" label="Participanți actuali">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="maxParticipants" label="Capacitate maximă">
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="price" label="Preț">
                                <Input placeholder="Gratuit sau 150 MDL" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="organizer" label="Organizator">
                        <Input placeholder="Ex: FitMoldova & Primăria Chișinău" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminEvents;
