import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
    ListItemIcon, ListItemText, Avatar, IconButton, Divider, Tooltip,
    useTheme, useMediaQuery, Chip, Grid,
} from '@mui/material';
import {
    Dashboard as DashboardIcon, DirectionsRun, EmojiEvents, Group,
    Event, Person, Logout, Menu as MenuIcon, ChevronLeft, FitnessCenter,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.tsx';
import { ROUTES } from '../../routes/paths.ts';

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED = 64;

const NAV_ITEMS = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
    { label: 'Activități', icon: <DirectionsRun />, path: ROUTES.ACTIVITIES },
    { label: 'Provocări', icon: <EmojiEvents />, path: ROUTES.CHALLENGES },
    { label: 'Comunitate', icon: <FitnessCenter />, path: ROUTES.COMMUNITY },
    { label: 'Cluburi', icon: <Group />, path: ROUTES.CLUBS },
    { label: 'Evenimente', icon: <Event />, path: ROUTES.EVENTS_DASHBOARD },
    { label: 'Profil', icon: <Person />, path: ROUTES.PROFILE },
];

export const DashboardFooter: React.FC = () => (
    <Box
        component="footer"
        sx={{
            mt: 6,
            bgcolor: '#0f172a',
            color: '#94a3b8',
            borderRadius: 3,
            overflow: 'hidden',
        }}
    >
        <Grid container>
            <Grid item xs={12} sm={6} md={3} sx={{
                p: 4,
                borderRight: { md: '1px solid rgba(255,255,255,0.06)' },
                borderBottom: { xs: '1px solid rgba(255,255,255,0.06)', md: 'none' },
            }}>
                <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', mb: 1.5, letterSpacing: 1 }}>
                    <Box component="span" sx={{ color: '#fff' }}>FIT</Box>
                    <Box component="span" sx={{ color: '#1a6fff' }}>MOLDOVA</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.9, display: 'block' }}>
                    Platforma ta completă pentru fitness, comunitate și progres.
                    Transformă-ți obiectivele în realitate.
                </Typography>
            </Grid>

            <Grid item xs={6} sm={3} md={3} sx={{
                p: 4,
                borderRight: { md: '1px solid rgba(255,255,255,0.06)' },
            }}>
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 800, display: 'block', mb: 2, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    Platformă
                </Typography>
                {[
                    { label: 'Tracking Activități', to: ROUTES.ACTIVITIES },
                    { label: 'Evenimente', to: ROUTES.EVENTS_DASHBOARD },
                    { label: 'Provocări', to: ROUTES.CHALLENGES },
                    { label: 'Trasee', to: ROUTES.ROUTES_MAP },
                ].map((l) => (
                    <Link key={l.label} to={l.to} style={{ display: 'block', color: '#64748b', textDecoration: 'none', fontSize: '0.82rem', marginBottom: 10 }}>
                        {l.label}
                    </Link>
                ))}
            </Grid>

            <Grid item xs={6} sm={3} md={3} sx={{
                p: 4,
                borderRight: { md: '1px solid rgba(255,255,255,0.06)' },
            }}>
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 800, display: 'block', mb: 2, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    Comunitate
                </Typography>
                {[
                    { label: 'Forum', to: ROUTES.FORUM },
                    { label: 'Cluburi', to: ROUTES.CLUBS },
                    { label: 'Comunitate', to: ROUTES.COMMUNITY },
                ].map((l) => (
                    <Link key={l.label} to={l.to} style={{ display: 'block', color: '#64748b', textDecoration: 'none', fontSize: '0.82rem', marginBottom: 10 }}>
                        {l.label}
                    </Link>
                ))}
            </Grid>

            <Grid item xs={12} sm={12} md={3} sx={{ p: 4 }}>
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 800, display: 'block', mb: 2, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    Suport
                </Typography>
                {[
                    { label: 'Contact', to: ROUTES.CONTACT },
                    { label: 'Feedback', to: ROUTES.FEEDBACK },
                ].map((l) => (
                    <Link key={l.label} to={l.to} style={{ display: 'block', color: '#64748b', textDecoration: 'none', fontSize: '0.82rem', marginBottom: 10 }}>
                        {l.label}
                    </Link>
                ))}
            </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', px: 4, py: 2 }}>
            <Typography variant="caption" sx={{ color: '#334155' }}>
                © 2026 FitMoldova. Toate drepturile rezervate.
            </Typography>
        </Box>
    </Box>
);

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const drawerWidth = collapsed && !isMobile ? DRAWER_COLLAPSED : DRAWER_WIDTH;

    const handleLogout = () => { logout(); navigate(ROUTES.HOME); };
    const getInitials = () => !user ? '?' : `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#0a1628' }}>
            <Box sx={{ px: 2, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: 64 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#1a6fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <DirectionsRun sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                {(!collapsed || isMobile) && (
                    <Typography sx={{ fontWeight: 900, fontSize: '1rem', letterSpacing: 1 }}>
                        <Box component="span" sx={{ color: '#fff' }}>FIT</Box>
                        <Box component="span" sx={{ color: '#1a6fff' }}>MOLDOVA</Box>
                    </Typography>
                )}
            </Box>

            <List sx={{ flex: 1, px: 1, py: 1.5 }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Tooltip key={item.path} title={collapsed && !isMobile ? item.label : ''} placement="right">
                            <ListItemButton
                                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                                sx={{
                                    borderRadius: '10px', mb: 0.5, px: 1.5,
                                    justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                                    bgcolor: isActive ? 'rgba(26,111,255,0.18)' : 'transparent',
                                    '&:hover': { bgcolor: 'rgba(26,111,255,0.12)' },
                                    transition: 'all 0.2s',
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? '#1a6fff' : 'rgba(255,255,255,0.55)', minWidth: collapsed && !isMobile ? 0 : 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                {(!collapsed || isMobile) && (
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 700 : 400, color: isActive ? '#fff' : 'rgba(255,255,255,0.7)' }}
                                    />
                                )}
                                {isActive && (!collapsed || isMobile) && (
                                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#1a6fff', ml: 'auto' }} />
                                )}
                            </ListItemButton>
                        </Tooltip>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

            <Box sx={{ p: 1.5 }}>
                {(!collapsed || isMobile) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#1a6fff', fontSize: '0.75rem' }}>{getInitials()}</Avatar>
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                                {user?.firstName} {user?.lastName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>Utilizator</Typography>
                        </Box>
                    </Box>
                )}
                <Tooltip title={collapsed && !isMobile ? 'Deconectare' : ''} placement="right">
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{ borderRadius: '10px', justifyContent: collapsed && !isMobile ? 'center' : 'flex-start', px: 1.5, '&:hover': { bgcolor: 'rgba(239,68,68,0.15)' } }}
                    >
                        <ListItemIcon sx={{ color: '#ef4444', minWidth: collapsed && !isMobile ? 0 : 40 }}><Logout /></ListItemIcon>
                        {(!collapsed || isMobile) && (
                            <ListItemText primary="Deconectare" primaryTypographyProps={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: 500 }} />
                        )}
                    </ListItemButton>
                </Tooltip>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f4f8' }}>
            {!isMobile && (
                <Drawer variant="permanent" sx={{
                    width: drawerWidth, flexShrink: 0, transition: 'width 0.25s ease',
                    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none', transition: 'width 0.25s ease', overflow: 'hidden' },
                }}>
                    {drawerContent}
                </Drawer>
            )}

            {isMobile && (
                <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
                        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
                    {drawerContent}
                </Drawer>
            )}

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #e8edf3', color: '#141414' }}>
                    <Toolbar sx={{ gap: 1 }}>
                        {isMobile ? (
                            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#444' }}><MenuIcon /></IconButton>
                        ) : (
                            <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: '#444' }}>
                                {collapsed ? <MenuIcon /> : <ChevronLeft />}
                            </IconButton>
                        )}
                        <Typography variant="subtitle1" fontWeight={700} sx={{ flexGrow: 1 }}>FitMoldova</Typography>
                        <Chip
                            avatar={<Avatar sx={{ bgcolor: '#1a6fff', width: 28, height: 28, fontSize: '0.7rem' }}>{getInitials()}</Avatar>}
                            label={`${user?.firstName} ${user?.lastName}`}
                            variant="outlined" size="small"
                            sx={{ borderColor: '#e0e0e0', fontWeight: 600 }}
                        />
                    </Toolbar>
                </AppBar>

                <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ flex: 1 }}>{children}</Box>
                    <DashboardFooter />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
