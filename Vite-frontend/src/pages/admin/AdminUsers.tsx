import React, { useState } from 'react';
import {
    Table, Card, Input, Space, Tag, Avatar, Button, Modal,
    Typography, Descriptions, Badge, Popconfirm, message, Select,
} from 'antd';
import {
    SearchOutlined, UserOutlined, DeleteOutlined,
    EyeOutlined, StopOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { MOCK_USERS, type MockUser } from '../../services/mock/Mockdata';

const { Title, Text } = Typography;
const { Option } = Select;

interface AdminUser extends MockUser {
    status: 'activ' | 'blocat';
    role: 'admin' | 'utilizator';
}

// Seed local state with mock users
const seedUsers = (): AdminUser[] =>
    MOCK_USERS.map(u => ({
        ...u,
        status: 'activ',
        role: u.isAdmin ? 'admin' : 'utilizator',
    }));

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>(seedUsers);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'activ' | 'blocat'>('all');
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'utilizator'>('all');
    const [viewUser, setViewUser] = useState<AdminUser | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const filtered = users.filter(u => {
        const term = search.toLowerCase();
        const matchSearch =
            u.firstName.toLowerCase().includes(term) ||
            u.lastName.toLowerCase().includes(term) ||
            u.username.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term);
        const matchStatus = filterStatus === 'all' || u.status === filterStatus;
        const matchRole = filterRole === 'all' || u.role === filterRole;
        return matchSearch && matchStatus && matchRole;
    });

    const toggleStatus = (id: number) => {
        setUsers(prev =>
            prev.map(u =>
                u.id === id
                    ? { ...u, status: u.status === 'activ' ? 'blocat' : 'activ' }
                    : u
            )
        );
        const user = users.find(u => u.id === id);
        const next = user?.status === 'activ' ? 'blocat' : 'activ';
        messageApi.success(`Utilizatorul a fost ${next === 'blocat' ? 'blocat' : 'reactivat'}.`);
    };

    const deleteUser = (id: number) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        messageApi.success('Utilizatorul a fost șters.');
    };

    const columns: ColumnsType<AdminUser> = [
        {
            title: 'Utilizator',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <Avatar style={{ backgroundColor: record.isAdmin ? '#f5222d' : '#1677ff' }}>
                        {record.avatar}
                    </Avatar>
                    <div>
                        <Text strong style={{ display: 'block' }}>
                            {record.firstName} {record.lastName}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>@{record.username}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email: string) => <Text copyable style={{ fontSize: 13 }}>{email}</Text>,
        },
        {
            title: 'Rol',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag color={role === 'admin' ? 'red' : 'blue'}>{role.toUpperCase()}</Tag>
            ),
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'Utilizator', value: 'utilizator' },
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) =>
                status === 'activ'
                    ? <Badge status="success" text="Activ" />
                    : <Badge status="error" text="Blocat" />,
        },
        {
            title: 'Înregistrat',
            dataIndex: 'registeredAt',
            key: 'registeredAt',
            render: (date: string) => new Date(date).toLocaleDateString('ro-RO'),
            sorter: (a, b) =>
                new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime(),
        },
        {
            title: 'Acțiuni',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => setViewUser(record)}
                    >
                        Detalii
                    </Button>
                    <Button
                        size="small"
                        icon={record.status === 'activ' ? <StopOutlined /> : <CheckCircleOutlined />}
                        onClick={() => toggleStatus(record.id)}
                        type={record.status === 'activ' ? 'default' : 'primary'}
                        danger={record.status === 'activ'}
                        disabled={record.isAdmin === true}
                    >
                        {record.status === 'activ' ? 'Blochează' : 'Reactivează'}
                    </Button>
                    <Popconfirm
                        title="Șterge utilizatorul"
                        description="Această acțiune este ireversibilă."
                        onConfirm={() => deleteUser(record.id)}
                        okText="Șterge"
                        cancelText="Anulează"
                        okButtonProps={{ danger: true }}
                        disabled={record.isAdmin === true}
                    >
                        <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            disabled={record.isAdmin === true}
                        >
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
                <Title level={4} style={{ margin: 0 }}>Gestionare Utilizatori</Title>
                <Text type="secondary">Vizualizare, blocare și ștergere conturi utilizatori</Text>
            </div>

            {/* Filters */}
            <Card style={{ borderRadius: 12, marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Caută după nume, username sau email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 320 }}
                        allowClear
                    />
                    <Select
                        value={filterStatus}
                        onChange={setFilterStatus}
                        style={{ width: 150 }}
                    >
                        <Option value="all">Toate statusurile</Option>
                        <Option value="activ">Activ</Option>
                        <Option value="blocat">Blocat</Option>
                    </Select>
                    <Select
                        value={filterRole}
                        onChange={setFilterRole}
                        style={{ width: 150 }}
                    >
                        <Option value="all">Toate rolurile</Option>
                        <Option value="admin">Admin</Option>
                        <Option value="utilizator">Utilizator</Option>
                    </Select>
                    <Text type="secondary">{filtered.length} utilizatori găsiți</Text>
                </Space>
            </Card>

            <Card style={{ borderRadius: 12 }}>
                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    size="middle"
                    rowClassName={record =>
                        record.status === 'blocat' ? 'ant-table-row-blocked' : ''
                    }
                />
            </Card>

            {/* User Details Modal */}
            <Modal
                title={
                    <Space>
                        <UserOutlined />
                        <span>Detalii utilizator</span>
                    </Space>
                }
                open={viewUser !== null}
                onCancel={() => setViewUser(null)}
                footer={[
                    <Button key="close" onClick={() => setViewUser(null)}>Închide</Button>,
                ]}
                width={520}
            >
                {viewUser && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <Avatar
                                size={64}
                                style={{ backgroundColor: viewUser.isAdmin ? '#f5222d' : '#1677ff', fontSize: 24 }}
                            >
                                {viewUser.avatar}
                            </Avatar>
                            <div style={{ marginTop: 8 }}>
                                <Text strong style={{ fontSize: 16 }}>
                                    {viewUser.firstName} {viewUser.lastName}
                                </Text>
                                <br />
                                <Text type="secondary">@{viewUser.username}</Text>
                            </div>
                        </div>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Email">{viewUser.email}</Descriptions.Item>
                            <Descriptions.Item label="Rol">
                                <Tag color={viewUser.role === 'admin' ? 'red' : 'blue'}>
                                    {viewUser.role.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                {viewUser.status === 'activ'
                                    ? <Badge status="success" text="Activ" />
                                    : <Badge status="error" text="Blocat" />
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Înregistrat la">
                                {new Date(viewUser.registeredAt).toLocaleString('ro-RO')}
                            </Descriptions.Item>
                            <Descriptions.Item label="ID">{viewUser.id}</Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default AdminUsers;
