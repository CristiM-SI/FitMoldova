import { useState, useEffect } from 'react';
import {
    Table, Card, Input, Space, Tag, Button, Typography,
    Popconfirm, message, Badge, Tooltip, Row, Col, Statistic,
} from 'antd';
import {
    SearchOutlined, DeleteOutlined, MailOutlined,
    CheckOutlined, ClockCircleOutlined, InboxOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import contactApi from '../../services/api/contactApi';
import type { ContactMessageInfoDto } from '../../types/Contact';

const { Title, Text, Paragraph } = Typography;

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ro-MD', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

export default function AdminContact() {
    const [messages_,   setMessages]   = useState<ContactMessageInfoDto[]>([]);
    const [loading,     setLoading]    = useState(true);
    const [search,      setSearch]     = useState('');
    const [filterRead,  setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
    const [messageApi,  contextHolder] = message.useMessage();

    useEffect(() => {
        contactApi.getAll()
            .then(setMessages)
            .catch(() => messageApi.error('Eroare la încărcarea mesajelor.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = messages_.filter(m => {
        const term = search.toLowerCase();
        const matchSearch =
            m.name.toLowerCase().includes(term) ||
            m.email.toLowerCase().includes(term) ||
            m.subject.toLowerCase().includes(term) ||
            m.message.toLowerCase().includes(term);
        const matchRead =
            filterRead === 'all' ||
            (filterRead === 'unread' && !m.isRead) ||
            (filterRead === 'read'   &&  m.isRead);
        return matchSearch && matchRead;
    });

    const handleMarkRead = async (id: number) => {
        try {
            await contactApi.markAsRead(id);
            setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
            messageApi.success('Mesaj marcat ca citit.');
        } catch {
            messageApi.error('Eroare la actualizare.');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await contactApi.delete(id);
            setMessages(prev => prev.filter(m => m.id !== id));
            messageApi.success('Mesaj șters.');
        } catch {
            messageApi.error('Eroare la ștergere.');
        }
    };

    const unreadCount = messages_.filter(m => !m.isRead).length;

    const columns: ColumnsType<ContactMessageInfoDto> = [
        {
            title: 'Status',
            dataIndex: 'isRead',
            key: 'isRead',
            width: 90,
            render: (isRead: boolean) =>
                isRead
                    ? <Tag icon={<CheckOutlined />} color="default">Citit</Tag>
                    : <Badge dot><Tag icon={<ClockCircleOutlined />} color="blue">Nou</Tag></Badge>,
        },
        {
            title: 'Expeditor',
            key: 'sender',
            width: 200,
            render: (_, record) => (
                <div>
                    <Text strong style={{ fontSize: 13, display: 'block' }}>{record.name}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
                </div>
            ),
        },
        {
            title: 'Subiect',
            dataIndex: 'subject',
            key: 'subject',
            width: 200,
            render: (subject: string, record) => (
                <Text strong={!record.isRead} style={{ fontSize: 13 }}>{subject}</Text>
            ),
        },
        {
            title: 'Mesaj',
            dataIndex: 'message',
            key: 'message',
            render: (msg: string) => (
                <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                    {msg}
                </Paragraph>
            ),
        },
        {
            title: 'Data',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 140,
            render: (d: string) => <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(d)}</Text>,
        },
        {
            title: 'Acțiuni',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    {!record.isRead && (
                        <Tooltip title="Marchează ca citit">
                            <Button
                                size="small"
                                icon={<CheckOutlined />}
                                onClick={() => handleMarkRead(record.id)}
                            />
                        </Tooltip>
                    )}
                    <Popconfirm
                        title="Șterge mesajul"
                        description="Această acțiune este ireversibilă."
                        onConfirm={() => handleDelete(record.id)}
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

            {/* Header stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card style={{ borderRadius: 12 }}>
                        <Statistic
                            title="Total mesaje"
                            value={messages_.length}
                            prefix={<InboxOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{ borderRadius: 12 }}>
                        <Statistic
                            title="Necitite"
                            value={unreadCount}
                            valueStyle={{ color: unreadCount > 0 ? '#1a6fff' : '#10b981' }}
                            prefix={<MailOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{ borderRadius: 12 }}>
                        <Statistic
                            title="Citite"
                            value={messages_.length - unreadCount}
                            valueStyle={{ color: '#10b981' }}
                            prefix={<CheckOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Caută după nume, email, subiect..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                    <Space>
                        {(['all', 'unread', 'read'] as const).map(f => (
                            <Button
                                key={f}
                                size="small"
                                type={filterRead === f ? 'primary' : 'default'}
                                onClick={() => setFilterRead(f)}
                            >
                                {f === 'all' ? 'Toate' : f === 'unread' ? 'Necitite' : 'Citite'}
                            </Button>
                        ))}
                    </Space>
                    <Text type="secondary">{filtered.length} mesaje</Text>
                </Space>
            </Card>

            {/* Table */}
            <Card style={{ borderRadius: 12 }}>
                <Title level={4} style={{ marginBottom: 16 }}>
                    <MailOutlined style={{ marginRight: 8 }} />
                    Mesaje Contact
                    {unreadCount > 0 && (
                        <Badge count={unreadCount} style={{ marginLeft: 10 }} />
                    )}
                </Title>
                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    size="middle"
                    rowClassName={record => !record.isRead ? 'ant-table-row-unread' : ''}
                    expandable={{
                        expandedRowRender: record => (
                            <div style={{ padding: '8px 16px', background: '#f8fafc', borderRadius: 8 }}>
                                <Text strong style={{ display: 'block', marginBottom: 4 }}>Mesaj complet:</Text>
                                <Text style={{ whiteSpace: 'pre-wrap' }}>{record.message}</Text>
                            </div>
                        ),
                    }}
                />
            </Card>
        </>
    );
}
