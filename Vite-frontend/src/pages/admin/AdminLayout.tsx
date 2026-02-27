import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Button, Space } from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    CalendarOutlined,
    TeamOutlined,
    TrophyOutlined,
    CompassOutlined,
    MessageOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';

const { Sider, Header, Content } = Layout;
const { Title, Text } = Typography;

const menuItems = [
    { key: ROUTES.ADMIN, icon: <DashboardOutlined />, label: 'Prezentare generală' },
    { key: ROUTES.ADMIN_USERS, icon: <UserOutlined />, label: 'Utilizatori' },
    { key: ROUTES.ADMIN_EVENTS, icon: <CalendarOutlined />, label: 'Evenimente' },
    { key: ROUTES.ADMIN_CLUBS, icon: <TeamOutlined />, label: 'Cluburi' },
    { key: ROUTES.ADMIN_CHALLENGES, icon: <TrophyOutlined />, label: 'Provocări' },
    { key: ROUTES.ADMIN_ROUTES, icon: <CompassOutlined />, label: 'Trasee' },
    { key: ROUTES.ADMIN_FEEDBACK, icon: <MessageOutlined />, label: 'Forum & Feedback' },
];

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const selectedKey = menuItems.find(item => item.key === location.pathname)?.key ?? ROUTES.ADMIN;

    const handleLogout = () => {
        logout();
        navigate(ROUTES.HOME);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                theme="dark"
                width={240}
                trigger={null}
                style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}
            >
                <div style={{
                    padding: collapsed ? '20px 8px' : '20px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    textAlign: 'center',
                }}>
                    <Title level={5} style={{ color: '#1677ff', margin: 0, whiteSpace: 'nowrap' }}>
                        {collapsed ? 'FM' : '⚡ FitMoldova Admin'}
                    </Title>
                </div>

                <Menu
                    theme="dark"
                    selectedKeys={[selectedKey]}
                    mode="inline"
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    style={{ marginTop: 8, borderInlineEnd: 'none' }}
                />

                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    padding: collapsed ? '12px 8px' : '12px 16px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    background: '#001529',
                }}>
                    {!collapsed && (
                        <Space style={{ marginBottom: 8, width: '100%' }}>
                            <Avatar style={{ backgroundColor: '#1677ff', flexShrink: 0 }}>
                                {user?.avatar}
                            </Avatar>
                            <div style={{ overflow: 'hidden' }}>
                                <Text style={{ color: '#fff', fontSize: 12, display: 'block' }}>
                                    {user?.firstName} {user?.lastName}
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                                    Administrator
                                </Text>
                            </div>
                        </Space>
                    )}
                    <Button
                        type="text"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ width: '100%', textAlign: collapsed ? 'center' : 'left', color: '#ff4d4f' }}
                    >
                        {!collapsed && 'Deconectare'}
                    </Button>
                </div>
            </Sider>

            <Layout>
                <Header style={{
                    background: '#fff',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f0f0f0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}>
                    <Space>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                        />
                        <Title level={5} style={{ margin: 0, color: '#141414' }}>
                            Panou de Administrare — FitMoldova
                        </Title>
                    </Space>
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(ROUTES.DASHBOARD)}
                        >
                            Înapoi la site
                        </Button>
                        <Avatar style={{ backgroundColor: '#1677ff' }}>{user?.avatar}</Avatar>
                        <Text>{user?.firstName} {user?.lastName}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>Administrator</Text>
                    </Space>
                </Header>

                <Content style={{
                    padding: 24,
                    background: '#f5f5f5',
                    minHeight: 'calc(100vh - 64px)',
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
