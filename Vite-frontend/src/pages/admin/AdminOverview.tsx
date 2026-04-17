import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography, Tag, Table, Badge, Space, Alert, Spin, Button } from 'antd';
import {
    //UserOutlined,
    CalendarOutlined,
    TeamOutlined,
    TrophyOutlined,
    FireOutlined,
    RiseOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import type { ColumnsType } from 'antd/es/table';

import { activityApi, type ActivityDto } from '../../services/api/activityApi';
import { clubApi, type ClubDto } from '../../services/api/clubApi';
import { eventApi, type EventDto } from '../../services/api/eventApi';
import { challengeApi, type ChallengeDto } from '../../services/api/challengeApi';

const { Title, Text } = Typography;

const PIE_COLORS = ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96'];

const difficultyColor: Record<string, string> = {
    'Ușor': 'green',
    'Mediu': 'orange',
    'Avansat': 'red',
    'Toate': 'blue',
};

const AdminOverview: React.FC = () => {
    const [activities, setActivities] = useState<ActivityDto[]>([]);
    const [clubs, setClubs] = useState<ClubDto[]>([]);
    const [events, setEvents] = useState<EventDto[]>([]);
    const [challenges, setChallenges] = useState<ChallengeDto[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const [act, cl, ev, ch] = await Promise.all([
                activityApi.getAll().catch(() => [] as ActivityDto[]),
                clubApi.getAll().catch(() => [] as ClubDto[]),
                eventApi.getAll().catch(() => [] as EventDto[]),
                challengeApi.getAll().catch(() => [] as ChallengeDto[]),
            ]);
            setActivities(act ?? []);
            setClubs(cl ?? []);
            setEvents(ev ?? []);
            setChallenges(ch ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Nu s-a putut conecta la server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAll(); }, []);

    // ── Grupări pentru grafice ───────────────────────────────────────────────
    const eventsByCategory = events.reduce<Record<string, number>>((acc, ev) => {
        const key = ev.category || 'Necategorizat';
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});
    const pieData = Object.entries(eventsByCategory).map(([name, value]) => ({ name, value }));

    const activitiesByType = activities.reduce<Record<string, number>>((acc, act) => {
        const key = act.type || 'Nespecificat';
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});
    const barData = Object.entries(activitiesByType).map(([type, count]) => ({ type, count }));

    const clubsByCategory = clubs.reduce<Record<string, number>>((acc, club) => {
        const key = club.category || 'Necategorizat';
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});
    const clubBarData = Object.entries(clubsByCategory).map(([category, count]) => ({ category, count }));

    // ── Statistici agregate ──────────────────────────────────────────────────
    const totalParticipants = events.reduce((sum, ev) => sum + (ev.participants ?? 0), 0);
    const totalMembers = clubs.reduce((sum, club) => sum + (club.members ?? 0), 0);

    const statCards = [
        {
            title: 'Evenimente',
            value: events.length,
            icon: <CalendarOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
            color: '#f6ffed',
            suffix: 'planificate',
        },
        {
            title: 'Cluburi',
            value: clubs.length,
            icon: <TeamOutlined style={{ fontSize: 24, color: '#faad14' }} />,
            color: '#fffbe6',
            suffix: 'active',
        },
        {
            title: 'Provocări',
            value: challenges.length,
            icon: <TrophyOutlined style={{ fontSize: 24, color: '#f5222d' }} />,
            color: '#fff1f0',
            suffix: 'în curs',
        },
        {
            title: 'Activități',
            value: activities.length,
            icon: <FireOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
            color: '#e6fffb',
            suffix: 'înregistrate',
        },
    ];

    // ── Coloane tabel evenimente recente ─────────────────────────────────────
    const recentEventsColumns: ColumnsType<EventDto> = [
        {
            title: 'Eveniment',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <Space>
                    <span style={{ fontSize: 18 }}>📅</span>
                    <Text strong>{name}</Text>
                </Space>
            ),
        },
        {
            title: 'Categorie',
            dataIndex: 'category',
            key: 'category',
            render: (cat: string) => <Tag color="blue">{cat || '—'}</Tag>,
        },
        {
            title: 'Dată',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => date ? new Date(date).toLocaleDateString('ro-RO') : '—',
        },
        {
            title: 'Oraș',
            dataIndex: 'city',
            key: 'city',
            render: (city: string) => city || '—',
        },
        {
            title: 'Participanți',
            key: 'participants',
            render: (_: unknown, record: EventDto) => (
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
            render: (diff: string) => <Tag color={difficultyColor[diff] ?? 'default'}>{diff || '—'}</Tag>,
        },
        {
            title: 'Preț',
            dataIndex: 'price',
            key: 'price',
            render: (price: string) => (
                <Tag color={price === 'Gratuit' ? 'green' : 'gold'}>{price || '—'}</Tag>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Prezentare Generală</Title>
                    <Text type="secondary">Statistici și date de ansamblu ale platformei FitMoldova</Text>
                </div>
                <Button icon={<ReloadOutlined />} onClick={loadAll} loading={loading}>
                    Reîncarcă
                </Button>
            </div>

            {error && (
                <Alert
                    type="warning"
                    showIcon
                    message="Problemă la încărcare"
                    description={`${error} — Verifică că serverul .NET rulează pe http://localhost:5296.`}
                    style={{ marginBottom: 16 }}
                    closable
                    onClose={() => setError(null)}
                />
            )}

            {loading && activities.length === 0 && clubs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 80 }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16, color: '#8c8c8c' }}>Se încarcă datele din backend...</div>
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        {statCards.map(card => (
                            <Col xs={24} sm={12} lg={6} key={card.title}>
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
                                {pieData.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}>
                                        Niciun eveniment în baza de date.
                                    </div>
                                ) : (
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
                                )}
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card title="Cluburi pe categorie" style={{ borderRadius: 12 }}>
                                {clubBarData.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}>
                                        Niciun club în baza de date.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={clubBarData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Bar dataKey="count" name="Cluburi" fill="#1677ff" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Card>
                        </Col>
                    </Row>

                    {/* Activities chart */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        <Col xs={24}>
                            <Card title="Activități pe tip" style={{ borderRadius: 12 }}>
                                {barData.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}>
                                        Nicio activitate în baza de date.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="type" tick={{ fontSize: 13 }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                                            <Tooltip />
                                            <Bar dataKey="count" name="Activități" fill="#52c41a" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Card>
                        </Col>
                    </Row>

                    {/* Recent Events Table */}
                    <Card title="Evenimente recente" style={{ borderRadius: 12 }}>
                        <Table
                            columns={recentEventsColumns}
                            dataSource={events.slice(0, 6)}
                            rowKey="id"
                            pagination={false}
                            size="middle"
                            locale={{ emptyText: 'Niciun eveniment în baza de date.' }}
                        />
                    </Card>
                </>
            )}
        </div>
    );
};

export default AdminOverview;
