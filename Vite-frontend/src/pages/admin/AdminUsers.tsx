import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Card, Input, Space, Tag, Avatar, Button, Modal,
    Typography, Descriptions, Badge, Popconfirm, message, Select, Spin, Alert,
} from 'antd';
import {
    SearchOutlined, UserOutlined, DeleteOutlined,
    EyeOutlined, StopOutlined, CheckCircleOutlined, ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { userApi, type AdminUserDto } from '../../services/api/userApi';

const { Title, Text } = Typography;
const { Option } = Select;

const ROLE_OPTIONS = ['User', 'Moderator', 'Admin'];

function getInitials(firstName: string, lastName: string) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'activ' | 'blocat'>('all');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [viewUser, setViewUser] = useState<AdminUserDto | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userApi.getAll();
            setUsers(data);
        } catch {
            setError('Nu s-au putut încărca utilizatorii. Verifică că serverul rulează.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const filtered = users.filter(u => {
        const term = search.toLowerCase();
        const matchSearch =
            u.firstName.toLowerCase().includes(term) ||
            u.lastName.toLowerCase().includes(term) ||
            u.username.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term);
        const matchStatus =
            filterStatus === 'all' ||
            (filterStatus === 'activ' ? u.isActive : !u.isActive);
        const matchRole = filterRole === 'all' || u.role === filterRole;
        return matchSearch && matchStatus && matchRole;
    });

    const handleToggleStatus = async (user: AdminUserDto) => {
        setActionLoading(user.id);
        try {
            await userApi.changeStatus(user.id, !user.isActive);
            setUsers(prev => prev.map(u =>
                u.id === user.id ? { ...u, isActive: !u.isActive } : u
            ));
            messageApi.success(user.isActive ? 'Utilizatorul a fost blocat.' : 'Utilizatorul a fost reactivat.');
        } catch {
            messageApi.error('Eroare la actualizarea statusului.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleChangeRole = async (userId: number, newRole: string) => {
        setActionLoading(userId);
        try {
            await userApi.changeRole(userId, newRole);
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
            messageApi.success(`Rol schimbat în ${newRole}.`);
        } catch {
            messageApi.error('Eroare la schimbarea rolului.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: number) => {
        setActionLoading(id);
        try {
            await userApi.delete(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            setViewUser(null);
            messageApi.success('Utilizatorul a fost șters.');
        } catch {
            messageApi.error('Eroare la ștergerea utilizatorului.');
        } finally {
            setActionLoading(null);
        }
    };

    const columns: ColumnsType<AdminUserDto> = [
        {
            title: 'Utilizator',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <Avatar style={{ backgroundColor: record.role === 'Admin' ? '#f5222d' : record.role === 'Moderator' ? '#fa8c16' : '#1677ff' }}>
                        {getInitials(record.firstName, record.lastName)}
                    </Avatar>
                    <div>
                        <Text strong style={{ display: 'block' }}>{record.firstName} {record.lastName}</Text>
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
            key: 'role',
            render: (_, record) => (
                <Select
                    value={record.role}
                    size="small"
                    style={{ width: 120 }}
                    loading={actionLoading === record.id}
                    onChange={(val) => handleChangeRole(record.id, val)}
                >
                    {ROLE_OPTIONS.map(r => (
                        <Option key={r} value={r}>
                            <Tag color={r === 'Admin' ? 'red' : r === 'Moderator' ? 'orange' : 'blue'} style={{ margin: 0 }}>
                                {r.toUpperCase()}
                            </Tag>
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => record.isActive
                ? <Badge status="success" text="Activ" />
                : <Badge status="error" text="Blocat" />,
            filters: [
                { text: 'Activ', value: true },
                { text: 'Blocat', value: false },
            ],
            onFilter: (value, record) => record.isActive === value,
        },
        {
            title: 'Înregistrat',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString('ro-RO'),
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
        {
            title: 'Acțiuni',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => setViewUser(record)}>
                        Detalii
                    </Button>
                    <Button
                        size="small"
                        icon={record.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
                        onClick={() => handleToggleStatus(record)}
                        type={record.isActive ? 'default' : 'primary'}
                        danger={record.isActive}
                        loading={actionLoading === record.id}
                        disabled={record.role === 'Admin'}
                    >
                        {record.isActive ? 'Blochează' : 'Reactivează'}
                    </Button>
                    <Popconfirm
                        title="Șterge utilizatorul"
                        description="Această acțiune este ireversibilă."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Șterge"
                        cancelText="Anulează"
                        okButtonProps={{ danger: true }}
                        disabled={record.role === 'Admin'}
                    >
                        <Button size="small" danger icon={<DeleteOutlined />} disabled={record.role === 'Admin'}>
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
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Gestionare Utilizatori</Title>
                    <Text type="secondary">Vizualizare, blocare, schimbare rol și ștergere conturi</Text>
                </div>
                <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={loading}>
                    Reîncarcă
                </Button>
            </div>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    style={{ marginBottom: 16, borderRadius: 8 }}
                    action={<Button size="small" onClick={fetchUsers}>Reîncearcă</Button>}
                />
            )}

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
                    <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 160 }}>
                        <Option value="all">Toate statusurile</Option>
                        <Option value="activ">Activ</Option>
                        <Option value="blocat">Blocat</Option>
                    </Select>
                    <Select value={filterRole} onChange={setFilterRole} style={{ width: 150 }}>
                        <Option value="all">Toate rolurile</Option>
                        {ROLE_OPTIONS.map(r => <Option key={r} value={r}>{r}</Option>)}
                    </Select>
                    <Text type="secondary">{filtered.length} utilizatori găsiți</Text>
                </Space>
            </Card>

            <Card style={{ borderRadius: 12 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 48 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 12 }}>Se încarcă utilizatorii...</div>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filtered}
                        rowKey="id"
                        pagination={{ pageSize: 10, showSizeChanger: true }}
                        size="middle"
                        rowClassName={record => !record.isActive ? 'ant-table-row-blocked' : ''}
                    />
                )}
            </Card>

            {/* Modal detalii */}
            <Modal
                title={<Space><UserOutlined /><span>Detalii utilizator</span></Space>}
                open={viewUser !== null}
                onCancel={() => setViewUser(null)}
                footer={[
                    <Popconfirm
                        key="delete"
                        title="Ești sigur că vrei să ștergi acest utilizator?"
                        onConfirm={() => viewUser && handleDelete(viewUser.id)}
                        okText="Șterge" cancelText="Anulează"
                        okButtonProps={{ danger: true }}
                        disabled={viewUser?.role === 'Admin'}
                    >
                        <Button danger disabled={viewUser?.role === 'Admin'} icon={<DeleteOutlined />}>
                            Șterge cont
                        </Button>
                    </Popconfirm>,
                    <Button key="close" onClick={() => setViewUser(null)}>Închide</Button>,
                ]}
                width={520}
            >
                {viewUser && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <Avatar size={64} style={{
                                backgroundColor: viewUser.role === 'Admin' ? '#f5222d' : viewUser.role === 'Moderator' ? '#fa8c16' : '#1677ff',
                                fontSize: 24
                            }}>
                                {getInitials(viewUser.firstName, viewUser.lastName)}
                            </Avatar>
                            <div style={{ marginTop: 8 }}>
                                <Text strong style={{ fontSize: 16 }}>{viewUser.firstName} {viewUser.lastName}</Text>
                                <br />
                                <Text type="secondary">@{viewUser.username}</Text>
                            </div>
                        </div>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Email">{viewUser.email}</Descriptions.Item>
                            <Descriptions.Item label="Rol">
                                <Select
                                    value={viewUser.role}
                                    size="small"
                                    style={{ width: 140 }}
                                    onChange={async (val) => {
                                        await handleChangeRole(viewUser.id, val);
                                        setViewUser(prev => prev ? { ...prev, role: val } : null);
                                    }}
                                    disabled={viewUser.role === 'Admin'}
                                >
                                    {ROLE_OPTIONS.map(r => (
                                        <Option key={r} value={r}>
                                            <Tag color={r === 'Admin' ? 'red' : r === 'Moderator' ? 'orange' : 'blue'} style={{ margin: 0 }}>
                                                {r.toUpperCase()}
                                            </Tag>
                                        </Option>
                                    ))}
                                </Select>
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                {viewUser.isActive
                                    ? <Badge status="success" text="Activ" />
                                    : <Badge status="error" text="Blocat" />}
                            </Descriptions.Item>
                            <Descriptions.Item label="Înregistrat la">
                                {new Date(viewUser.createdAt).toLocaleString('ro-RO')}
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
