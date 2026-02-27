import React from 'react';
import { Card, Col, Row, Statistic, Typography, Tag, Table, Badge, Space } from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    TeamOutlined,
    TrophyOutlined,
    CompassOutlined,
    RiseOutlined,
    FireOutlined,
} from '@ant-design/icons';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { MOCK_USERS } from '../../services/mock/Mockdata';
import { MOCK_EVENIMENTE } from '../../services/mock/evenimente';
import { MOCK_CLUBURI } from '../../services/mock/cluburi';
import { MOCK_PROVOCARI } from '../../services/mock/provocari';
import { MOCK_TRASEE } from '../../services/mock/trasee';
import { MOCK_ACTIVITATI } from '../../services/mock/activitati';
import type { ColumnsType } from 'antd/es/table';
import type { Eveniment } from '../../services/mock/evenimente';

const { Title, Text } = Typography;

const PIE_COLORS = ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96'];

// Grupare evenimente după categorie pentru pie chart
const eventsByCategory = MOCK_EVENIMENTE.reduce<Record<string, number>>((acc, ev) => {
    acc[ev.category] = (acc[ev.category] ?? 0) + 1;
    return acc;
}, {});
const pieData = Object.entries(eventsByCategory).map(([name, value]) => ({ name, value }));

// Grupare activități după tip pentru bar chart
const activitiesByType = MOCK_ACTIVITATI.reduce<Record<string, number>>((acc, act) => {
    acc[act.type] = (acc[act.type] ?? 0) + 1;
    return acc;
}, {});
const barData = Object.entries(activitiesByType).map(([type, count]) => ({ type, count }));

// Grupare cluburi după categorie
const clubsByCategory = MOCK_CLUBURI.reduce<Record<string, number>>((acc, club) => {
    acc[club.category] = (acc[club.category] ?? 0) + 1;
    return acc;
}, {});
const clubBarData = Object.entries(clubsByCategory).map(([category, count]) => ({ category, count }));

const difficultyColor: Record<string, string> = {
    'Ușor': 'green',
    'Mediu': 'orange',
    'Avansat': 'red',
    'Toate': 'blue',
};

const recentEventsColumns: ColumnsType<Eveniment> = [
    {
        title: 'Eveniment',
        dataIndex: 'name',
        key: 'name',
        render: (name: string, record: Eveniment) => (
            <Space>
                <span style={{ fontSize: 18 }}>{record.icon}</span>
                <Text strong>{name}</Text>
            </Space>
        ),
    },
    {
        title: 'Categorie',
        dataIndex: 'category',
        key: 'category',
        render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
        title: 'Dată',
        dataIndex: 'date',
        key: 'date',
        render: (date: string) => new Date(date).toLocaleDateString('ro-RO'),
    },
    {
        title: 'Oraș',
        dataIndex: 'city',
        key: 'city',
    },
    {
        title: 'Participanți',
        key: 'participants',
        render: (_: unknown, record: Eveniment) => (
            <Badge
                count={`${record.participants}/${record.maxParticipants}`}
                style={{
                    backgroundColor: record.participants >= record.maxParticipants ? '#f5222d' : '#52c41a',
                    fontSize: 11,
                }}
            />
        ),
    },
    {
        title: 'Dificultate',
        dataIndex: 'difficulty',
        key: 'difficulty',
        render: (diff: string) => <Tag color={difficultyColor[diff] ?? 'default'}>{diff}</Tag>,
    },
    {
        title: 'Preț',
        dataIndex: 'price',
        key: 'price',
        render: (price: string) => (
            <Tag color={price === 'Gratuit' ? 'green' : 'gold'}>{price}</Tag>
        ),
    },
];

const statCards = [
    {
        title: 'Utilizatori',
        value: MOCK_USERS.length,
        icon: <UserOutlined style={{ fontSize: 24, color: '#1677ff' }} />,
        color: '#e6f4ff',
        suffix: 'înregistrați',
    },
    {
        title: 'Evenimente',
        value: MOCK_EVENIMENTE.length,
        icon: <CalendarOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
        color: '#f6ffed',
        suffix: 'planificate',
    },
    {
        title: 'Cluburi',
        value: MOCK_CLUBURI.length,
        icon: <TeamOutlined style={{ fontSize: 24, color: '#faad14' }} />,
        color: '#fffbe6',
        suffix: 'active',
    },
    {
        title: 'Provocări',
        value: MOCK_PROVOCARI.length,
        icon: <TrophyOutlined style={{ fontSize: 24, color: '#f5222d' }} />,
        color: '#fff1f0',
        suffix: 'în curs',
    },
    {
        title: 'Trasee',
        value: MOCK_TRASEE.length,
        icon: <CompassOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
        color: '#f9f0ff',
        suffix: 'cartografiate',
    },
    {
        title: 'Activități',
        value: MOCK_ACTIVITATI.length,
        icon: <FireOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
        color: '#e6fffb',
        suffix: 'înregistrate',
    },
];

const AdminOverview: React.FC = () => {
    const totalParticipants = MOCK_EVENIMENTE.reduce((sum, ev) => sum + ev.participants, 0);
    const totalMembers = MOCK_CLUBURI.reduce((sum, club) => sum + club.members, 0);

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>Prezentare Generală</Title>
                <Text type="secondary">Statistici și date de ansamblu ale platformei FitMoldova</Text>
            </div>

            {/* Stat Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {statCards.map(card => (
                    <Col xs={24} sm={12} lg={8} xl={4} key={card.title}>
                        <Card
                            style={{ borderRadius: 12, background: card.color, border: 'none' }}
                            styles={{ body: { padding: '16px 20px' } }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text type="secondary" style={{ fontSize: 13 }}>{card.title}</Text>
                                {card.icon}
                            </div>
                            <Statistic value={card.value} valueStyle={{ fontSize: 28, fontWeight: 700 }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>{card.suffix}</Text>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Extra stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12}>
                    <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 20px' } }}>
                        <Space>
                            <RiseOutlined style={{ fontSize: 24, color: '#1677ff' }} />
                            <div>
                                <Statistic value={totalParticipants} valueStyle={{ fontSize: 22, fontWeight: 700 }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>Total participanți la evenimente</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 20px' } }}>
                        <Space>
                            <TeamOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                            <div>
                                <Statistic value={totalMembers} valueStyle={{ fontSize: 22, fontWeight: 700 }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>Total membri în cluburi</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="Evenimente pe categorie" style={{ borderRadius: 12 }}>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Cluburi pe categorie" style={{ borderRadius: 12 }}>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={clubBarData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="count" name="Cluburi" fill="#1677ff" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Activities chart */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24}>
                    <Card title="Activități pe tip" style={{ borderRadius: 12 }}>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="type" tick={{ fontSize: 13 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                                <Tooltip />
                                <Bar dataKey="count" name="Activități" fill="#52c41a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Recent Events Table */}
            <Card title="Evenimente recente" style={{ borderRadius: 12 }}>
                <Table
                    columns={recentEventsColumns}
                    dataSource={MOCK_EVENIMENTE.slice(0, 6)}
                    rowKey="id"
                    pagination={false}
                    size="middle"
                />
            </Card>
        </div>
    );
};

export default AdminOverview;
