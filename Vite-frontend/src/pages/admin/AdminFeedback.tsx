import React, { useState, useEffect } from 'react';
import {
    Table, Card, Input, Space, Tag, Button, Tabs, Typography,
    Avatar, Popconfirm, message, Select, Rate, Row, Col,
    Statistic, Badge, Tooltip,
} from 'antd';
import feedbackApi from '../../services/api/feedbackApi';
import type { FeedbackInfoDto } from '../../types/Feedback';
import {
    SearchOutlined, DeleteOutlined, MessageOutlined,
    PushpinOutlined, EyeInvisibleOutlined, EyeOutlined,
    StarOutlined, LikeOutlined, StarFilled,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { INITIAL_THREADS, FORUM_CATEGORIES, type ForumThread, type ForumCategory } from '../../services/mock/forum';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const FEEDBACK_CATEGORIES = ['Interfață (UX)', 'Performanță', 'Funcționalități', 'Comunitate', 'Suport', 'Altele'];

/* ─── Admin thread type (adds status) ─── */
interface AdminThread extends ForumThread {
    hidden: boolean;
}

const seedThreads = (): AdminThread[] =>
    INITIAL_THREADS.map(t => ({ ...t, hidden: false }));

/* ─── Forum tab ─── */
const ForumTab: React.FC = () => {
    const [threads, setThreads] = useState<AdminThread[]>(seedThreads);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState<ForumCategory | 'Toate'>('Toate');
    const [messageApi, contextHolder] = message.useMessage();

    const filtered = threads.filter(t => {
        const term = search.toLowerCase();
        const matchSearch =
            t.content.toLowerCase().includes(term) ||
            t.author.toLowerCase().includes(term) ||
            t.handle.toLowerCase().includes(term);
        const matchCat = filterCat === 'Toate' || t.category === filterCat;
        return matchSearch && matchCat;
    });

    const togglePin = (id: number) => {
        setThreads(prev => prev.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
        const thread = threads.find(t => t.id === id);
        messageApi.success(thread?.pinned ? 'Postarea a fost despinsă.' : 'Postarea a fost pinsă.');
    };

    const toggleHide = (id: number) => {
        setThreads(prev => prev.map(t => t.id === id ? { ...t, hidden: !t.hidden } : t));
        const thread = threads.find(t => t.id === id);
        messageApi.success(thread?.hidden ? 'Postarea este din nou vizibilă.' : 'Postarea a fost ascunsă.');
    };

    const deleteThread = (id: number) => {
        setThreads(prev => prev.filter(t => t.id !== id));
        messageApi.success('Postarea a fost ștearsă.');
    };

    const columns: ColumnsType<AdminThread> = [
        {
            title: 'Autor',
            key: 'author',
            width: 160,
            render: (_, record) => (
                <Space>
                    <Avatar style={{ backgroundColor: record.color, flexShrink: 0 }}>
                        {record.avatar}
                    </Avatar>
                    <div>
                        <Text strong style={{ fontSize: 13, display: 'block' }}>{record.author}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>@{record.handle}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Conținut',
            dataIndex: 'content',
            key: 'content',
            render: (content: string, record) => (
                <div style={{ opacity: record.hidden ? 0.45 : 1 }}>
                    {record.pinned && <Tag color="gold" style={{ marginBottom: 4 }}>📌 Pinned</Tag>}
                    {record.hidden && <Tag color="default" style={{ marginBottom: 4 }}>👁 Ascuns</Tag>}
                    <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, fontSize: 13 }}>
                        {content}
                    </Paragraph>
                </div>
            ),
        },
        {
            title: 'Categorie',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            render: (cat: string) => <Tag color="blue">{cat}</Tag>,
        },
        {
            title: 'Statistici',
            key: 'stats',
            width: 140,
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    <Text style={{ fontSize: 12 }}>
                        <LikeOutlined /> {record.likes} &nbsp;
                        <MessageOutlined /> {record.replies.length}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        👁 {record.views.toLocaleString()} vizualizări
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Data',
            dataIndex: 'time',
            key: 'time',
            width: 100,
            render: (t: string) => <Text type="secondary" style={{ fontSize: 12 }}>{t}</Text>,
        },
        {
            title: 'Acțiuni',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Tooltip title={record.pinned ? 'Desprinde' : 'Pinsează'}>
                        <Button
                            size="small"
                            icon={<PushpinOutlined />}
                            type={record.pinned ? 'primary' : 'default'}
                            onClick={() => togglePin(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title={record.hidden ? 'Arată' : 'Ascunde'}>
                        <Button
                            size="small"
                            icon={record.hidden ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            onClick={() => toggleHide(record.id)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Șterge postarea"
                        description="Această acțiune este ireversibilă."
                        onConfirm={() => deleteThread(record.id)}
                        okText="Șterge"
                        cancelText="Anulează"
                        okButtonProps={{ danger: true }}
                    >
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Caută în postări, autor, handle..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                    <Select value={filterCat} onChange={setFilterCat} style={{ width: 180 }}>
                        {FORUM_CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
                    </Select>
                    <Text type="secondary">{filtered.length} postări găsite</Text>
                </Space>
            </Card>

            <Card style={{ borderRadius: 12 }}>
                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={{ pageSize: 6, showSizeChanger: true }}
                    size="middle"
                    rowClassName={record => record.hidden ? 'ant-table-row-hidden' : ''}
                />
            </Card>
        </>
    );
};

/* ─── Feedback tab ─── */
const FeedbackTab: React.FC = () => {
    const [reviews, setReviews] = useState<FeedbackInfoDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStars, setFilterStars] = useState<number | 'all'>('all');
    const [filterCat, setFilterCat] = useState<string>('all');
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        feedbackApi.getAllAdmin()
            .then(setReviews)
            .catch(() => messageApi.error('Nu s-au putut încărca recenziile.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = reviews.filter(r => {
        const term = search.toLowerCase();
        const matchSearch =
            r.title.toLowerCase().includes(term) ||
            r.message.toLowerCase().includes(term);
        const matchStars = filterStars === 'all' || r.rating === filterStars;
        const matchCat = filterCat === 'all' || r.categories.includes(filterCat);
        return matchSearch && matchStars && matchCat;
    });

    const toggleVisibility = async (id: number) => {
        const rev = reviews.find(r => r.id === id);
        if (!rev) return;
        const newStatus = rev.status === 'vizibil' ? 'ascuns' : 'vizibil';
        try {
            await feedbackApi.updateStatus(id, newStatus);
            setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            messageApi.success(newStatus === 'ascuns' ? 'Recenzia a fost ascunsă.' : 'Recenzia este din nou vizibilă.');
        } catch {
            messageApi.error('Eroare la actualizare.');
        }
    };

    const togglePin = async (id: number) => {
        const rev = reviews.find(r => r.id === id);
        if (!rev) return;
        try {
            await feedbackApi.togglePin(id);
            setReviews(prev => prev.map(r => r.id === id ? { ...r, isPinned: !r.isPinned } : r));
            messageApi.success(rev.isPinned ? 'Recenzia a fost despinsă.' : 'Recenzia a fost pinsată pe pagina publică.');
        } catch {
            messageApi.error('Eroare la actualizare.');
        }
    };

    const deleteReview = async (id: number) => {
        try {
            await feedbackApi.delete(id);
            setReviews(prev => prev.filter(r => r.id !== id));
            messageApi.success('Recenzia a fost ștearsă.');
        } catch {
            messageApi.error('Eroare la ștergere.');
        }
    };

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : '0';

    const starCounts = [5, 4, 3, 2, 1].map(s => ({
        star: s,
        count: reviews.filter(r => r.rating === s).length,
    }));

    const columns: ColumnsType<FeedbackInfoDto> = [
        {
            title: 'Titlu',
            key: 'title',
            render: (_, record) => (
                <div>
                    <Space size={4}>
                        {record.isPinned && <Tag color="gold">📌 Pinned</Tag>}
                        <Text strong style={{ fontSize: 13 }}>{record.title}</Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                        {new Date(record.createdAt).toLocaleDateString('ro-RO')}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            render: (rating: number) => <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />,
        },
        {
            title: 'Categorii',
            dataIndex: 'categories',
            key: 'categories',
            render: (cats: string[]) => (
                <>{cats.map(c => <Tag key={c} color="purple">{c}</Tag>)}</>
            ),
        },
        {
            title: 'Mesaj',
            dataIndex: 'message',
            key: 'message',
            render: (text: string, record) => (
                <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ margin: 0, fontSize: 13, opacity: record.status === 'ascuns' ? 0.45 : 1 }}
                >
                    {record.status === 'ascuns' && <Tag color="default" style={{ marginRight: 6 }}>Ascuns</Tag>}
                    {text}
                </Paragraph>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (s: string) =>
                s === 'vizibil'
                    ? <Badge status="success" text="Vizibil" />
                    : <Badge status="default" text="Ascuns" />,
        },
        {
            title: 'Acțiuni',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title={record.isPinned ? 'Desprinde de pe pagina publică' : 'Pinsează pe pagina publică'}>
                        <Button
                            size="small"
                            icon={<PushpinOutlined />}
                            type={record.isPinned ? 'primary' : 'default'}
                            onClick={() => togglePin(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title={record.status === 'vizibil' ? 'Ascunde' : 'Arată'}>
                        <Button
                            size="small"
                            icon={record.status === 'vizibil' ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            onClick={() => toggleVisibility(record.id)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Șterge recenzia"
                        description="Această acțiune este ireversibilă."
                        onConfirm={() => deleteReview(record.id)}
                        okText="Șterge"
                        cancelText="Anulează"
                        okButtonProps={{ danger: true }}
                    >
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            {/* Rating summary */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={8}>
                    <Card style={{ borderRadius: 12, textAlign: 'center' }}>
                        <Statistic
                            title="Rating mediu"
                            value={avgRating}
                            prefix={<StarFilled style={{ color: '#fadb14' }} />}
                            suffix="/ 5"
                            valueStyle={{ fontSize: 32, color: '#faad14' }}
                        />
                        <Rate disabled value={parseFloat(avgRating)} allowHalf style={{ marginTop: 8 }} />
                    </Card>
                </Col>
                <Col xs={24} sm={16}>
                    <Card style={{ borderRadius: 12 }}>
                        <Title level={5} style={{ marginTop: 0 }}>Distribuție rating</Title>
                        {starCounts.map(({ star, count }) => (
                            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                <Text style={{ width: 30, textAlign: 'right' }}>{star} ★</Text>
                                <div style={{
                                    flex: 1, height: 12, background: '#f0f0f0', borderRadius: 6, overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`,
                                        height: '100%',
                                        background: star >= 4 ? '#52c41a' : star === 3 ? '#faad14' : '#f5222d',
                                        borderRadius: 6,
                                        transition: 'width 0.4s',
                                    }} />
                                </div>
                                <Text type="secondary" style={{ width: 28 }}>{count}</Text>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Caută recenzie sau autor..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 280 }}
                        allowClear
                    />
                    <Select value={filterStars} onChange={setFilterStars} style={{ width: 150 }}>
                        <Option value="all">Toate ratingurile</Option>
                        {[5, 4, 3, 2, 1].map(s => (
                            <Option key={s} value={s}>{s} stele</Option>
                        ))}
                    </Select>
                    <Select value={filterCat} onChange={setFilterCat} style={{ width: 180 }}>
                        <Option value="all">Toate categoriile</Option>
                        {FEEDBACK_CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
                    </Select>
                    <Text type="secondary">{filtered.length} recenzii găsite</Text>
                </Space>
            </Card>

            <Card style={{ borderRadius: 12 }}>
                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 6, showSizeChanger: true }}
                    size="middle"
                />
            </Card>
        </>
    );
};

/* ─── Main page ─── */
const AdminFeedback: React.FC = () => {
    const tabItems = [
        {
            key: 'forum',
            label: (
                <Space>
                    <MessageOutlined />
                    Postări Forum
                </Space>
            ),
            children: <ForumTab />,
        },
        {
            key: 'feedback',
            label: (
                <Space>
                    <StarOutlined />
                    Recenzii Feedback
                </Space>
            ),
            children: <FeedbackTab />,
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>Forum & Feedback</Title>
                <Text type="secondary">Moderare postări forum și gestionare recenzii utilizatori</Text>
            </div>
            <Tabs defaultActiveKey="forum" items={tabItems} />
        </div>
    );
};

export default AdminFeedback;
