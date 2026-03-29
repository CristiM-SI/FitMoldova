import React, { useState, useMemo } from 'react';
import {
    Box, Typography, Card, CardContent, Button, Chip,
    TextField, InputAdornment, Tabs, Tab, LinearProgress, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider,
} from '@mui/material';
import { Search, Add, ExitToApp, Close, LocationOn, AccessTime, Group, AttachMoney, CalendarToday } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import { useDashboardData } from '../../context/useDashboardData';
import type { Eveniment } from '../../services/mock/evenimente';

const CATEGORIES = ['Toate', 'Maraton', 'Ciclism', 'Yoga', 'Fitness', 'Trail', 'Inot', 'Social'] as const;
const MONTHS_RO = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CAT_COLORS: Record<string, string> = {
    Maraton: '#ef4444', Ciclism: '#3b82f6', Yoga: '#a855f7', Fitness: '#f59e0b',
    Trail: '#10b981', Inot: '#06b6d4', Social: '#ec4899',
};

const DIFF_COLORS: Record<string, string> = {
    'Usor': '#10b981', 'Mediu': '#f59e0b', 'Avansat': '#ef4444', 'Toate': '#3b82f6',
};

function getDiffColor(difficulty: string) {
    const norm = difficulty.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return DIFF_COLORS[norm] || '#64748b';
}

function getCatColor(category: string) {
    const norm = category.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return CAT_COLORS[category] || CAT_COLORS[norm] || '#6366f1';
}

const EvenimenteDashboard: React.FC = () => {
    const { evenimenteInscrise: inscrise, evenimenteDisponibile: disponibile, addEveniment, removeEveniment } = useDashboardData();

    const [tabVal, setTabVal] = useState(0);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('Toate');
    const [detail, setDetail] = useState<Eveniment | null>(null);

    const isRegistered = (id: number) => inscrise.some((e) => e.id === id);
    const register = (ev: Eveniment) => { addEveniment(ev); setDetail(null); };
    const cancel = (id: number) => { removeEveniment(id); setDetail(null); };

    const list = tabVal === 0 ? disponibile : inscrise;
    const freeEvents = disponibile.filter(e => e.price === 'Gratuit').length;
    const totalPart = [...inscrise, ...disponibile].reduce((s, e) => s + e.participants, 0);

    const filtered = useMemo(() => list.filter((e) => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === 'Toate' || e.category === filterCat || e.category.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === filterCat;
        return matchSearch && matchCat;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [list, search, filterCat]);

    return (
        <DashboardLayout>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} color="#0f172a">Evenimente</Typography>
                <Typography variant="body2" color="text.secondary">Descopera si inscrie-te la evenimentele sportive din Moldova</Typography>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                {[
                    { label: 'Disponibile', value: disponibile.length, emoji: '📅', bg: '#f0f7ff' },
                    { label: 'Inscrise', value: inscrise.length, emoji: '✅', bg: '#ecfdf5' },
                    { label: 'Total Participanti', value: totalPart.toLocaleString(), emoji: '👥', bg: '#fffbeb' },
                    { label: 'Evenimente Gratuite', value: freeEvents, emoji: '🆓', bg: '#fdf4ff' },
                ].map((s) => (
                    <Box key={s.label} sx={{ flex: '1 1 180px', minWidth: 0 }}>
                        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: s.bg, border: '1px solid rgba(0,0,0,0.04)', height: '100%' }}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1.3 }}>{s.label}</Typography>
                                    <Typography fontSize="1.4rem">{s.emoji}</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={900} color="#0f172a">{s.value}</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            {/* Tabs + Filters */}
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mb: 2 }}>
                <Box sx={{ borderBottom: '1px solid #e8edf3' }}>
                    <Tabs value={tabVal} onChange={(_, v) => setTabVal(v)} sx={{ px: 2 }}>
                        <Tab label={`Toate (${disponibile.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
                        <Tab label={`Inscrise (${inscrise.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
                    </Tabs>
                </Box>
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                            size="small"
                            placeholder="Cauta eveniment sau oras..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: '#94a3b8', fontSize: 18 }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{ width: 260, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                            {CATEGORIES.map((cat) => (
                                <Chip key={cat} label={cat} size="small" onClick={() => setFilterCat(cat)}
                                      variant={filterCat === cat ? 'filled' : 'outlined'}
                                      sx={{ fontSize: '0.72rem', bgcolor: filterCat === cat ? (CAT_COLORS[cat] || '#1a6fff') : 'transparent', color: filterCat === cat ? '#fff' : '#64748b', borderColor: '#e2e8f0' }} />
                            ))}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Events Grid */}
            {filtered.length === 0 ? (
                <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3' }}>
                    <CardContent sx={{ p: 6, textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ mb: 1 }}>📅</Typography>
                        <Typography color="text.secondary" fontWeight={600}>
                            {tabVal === 1 ? 'Nu esti inscris la niciun eveniment.' : 'Niciun eveniment gasit.'}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {filtered.map((ev) => {
                        const d = new Date(ev.date);
                        const pct = Math.round((ev.participants / ev.maxParticipants) * 100);
                        const catColor = getCatColor(ev.category);
                        const reg = isRegistered(ev.id);
                        return (
                            <Box key={ev.id} sx={{ flex: '1 1 280px', minWidth: 0 }}>
                                <Card
                                    elevation={0}
                                    onClick={() => setDetail(ev)}
                                    sx={{
                                        borderRadius: 3,
                                        border: `1px solid ${reg ? '#10b98130' : '#e8edf3'}`,
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' },
                                        transition: 'all 0.2s',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* ── Cover image ── */}
                                    <Box sx={{ position: 'relative', height: 148, flexShrink: 0, bgcolor: `${catColor}18`, overflow: 'hidden' }}>
                                        {ev.image ? (
                                            <Box
                                                component="img"
                                                src={ev.image}
                                                alt={ev.name}
                                                loading="lazy"
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                    transition: 'transform 0.35s ease',
                                                    '&:hover': { transform: 'scale(1.04)' },
                                                }}
                                            />
                                        ) : (
                                            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography fontSize="3.5rem">{ev.icon}</Typography>
                                            </Box>
                                        )}

                                        {/* Date badge — over the image */}
                                        <Box sx={{
                                            position: 'absolute', top: 10, left: 10,
                                            bgcolor: 'rgba(255,255,255,0.92)',
                                            backdropFilter: 'blur(6px)',
                                            borderRadius: 2, px: 1, py: 0.5,
                                            textAlign: 'center', minWidth: 44,
                                            boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
                                        }}>
                                            <Typography variant="h6" fontWeight={900} color={catColor} lineHeight={1} fontSize="1.1rem">{d.getDate()}</Typography>
                                            <Typography variant="caption" color={catColor} fontWeight={700} fontSize="0.6rem">{MONTHS_RO[d.getMonth()]}</Typography>
                                        </Box>

                                        {/* Registered badge */}
                                        {reg && (
                                            <Chip label="✓ Inscris" size="small" sx={{
                                                position: 'absolute', top: 10, right: 10,
                                                height: 20, bgcolor: '#10b981', color: '#fff',
                                                fontWeight: 900, fontSize: '0.6rem',
                                                boxShadow: '0 1px 6px rgba(0,0,0,0.15)',
                                            }} />
                                        )}
                                    </Box>

                                    {/* ── Card body ── */}
                                    <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="body2" fontWeight={800} sx={{ mb: 0.25, lineHeight: 1.35 }}>{ev.name}</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.25, display: 'block' }}>{ev.organizer}</Typography>

                                        <Box sx={{ display: 'flex', gap: 0.75, mb: 1.25, flexWrap: 'wrap' }}>
                                            <Chip label={ev.category} size="small" sx={{ height: 18, bgcolor: `${catColor}15`, color: catColor, fontWeight: 700, fontSize: '0.65rem' }} />
                                            <Chip label={ev.difficulty} size="small" sx={{ height: 18, bgcolor: `${getDiffColor(ev.difficulty)}15`, color: getDiffColor(ev.difficulty), fontSize: '0.65rem' }} />
                                            <Chip label={ev.price === 'Gratuit' ? 'Gratuit' : ev.price} size="small"
                                                  sx={{ height: 18, bgcolor: ev.price === 'Gratuit' ? '#ecfdf5' : '#fffbeb', color: ev.price === 'Gratuit' ? '#10b981' : '#f59e0b', fontSize: '0.65rem', fontWeight: 700 }} />
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 2, mb: 1.25 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <LocationOn sx={{ fontSize: 11, color: '#94a3b8' }} />
                                                <Typography variant="caption" color="text.secondary">{ev.city}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AccessTime sx={{ fontSize: 11, color: '#94a3b8' }} />
                                                <Typography variant="caption" color="text.secondary">{ev.time}</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mt: 'auto' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">{ev.participants}/{ev.maxParticipants}</Typography>
                                                <Typography variant="caption" fontWeight={700} color={pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981'}>{pct}%</Typography>
                                            </Box>
                                            <LinearProgress variant="determinate" value={pct}
                                                            sx={{ height: 4, borderRadius: 2, bgcolor: '#f0f4f8', '& .MuiLinearProgress-bar': { bgcolor: pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981', borderRadius: 2 } }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* Detail Dialog */}
            <Dialog open={!!detail} onClose={() => setDetail(null)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}>
                {detail && (
                    <>
                        {/* Dialog cover image */}
                        {detail.image && (
                            <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                                <Box
                                    component="img"
                                    src={detail.image}
                                    alt={detail.name}
                                    loading="lazy"
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                                <Box sx={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
                                }} />
                                <IconButton
                                    size="small"
                                    onClick={() => setDetail(null)}
                                    sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(0,0,0,0.4)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
                                >
                                    <Close fontSize="small" />
                                </IconButton>
                                <Box sx={{ position: 'absolute', bottom: 14, left: 16 }}>
                                    <Typography fontWeight={800} fontSize="1.15rem" color="#fff" sx={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{detail.name}</Typography>
                                    <Typography variant="caption" color="rgba(255,255,255,0.8)">{detail.organizer}</Typography>
                                </Box>
                            </Box>
                        )}

                        {!detail.image && (
                            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography fontWeight={800} fontSize="1.1rem">{detail.icon} {detail.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{detail.organizer}</Typography>
                                </Box>
                                <IconButton size="small" onClick={() => setDetail(null)}><Close /></IconButton>
                            </DialogTitle>
                        )}

                        <Divider />
                        <DialogContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>{detail.description}</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                                {[
                                    { icon: <CalendarToday sx={{ fontSize: 14 }} />, label: new Date(detail.date).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                                    { icon: <AccessTime sx={{ fontSize: 14 }} />, label: detail.time },
                                    { icon: <LocationOn sx={{ fontSize: 14 }} />, label: `${detail.location}, ${detail.city}` },
                                    { icon: <Group sx={{ fontSize: 14 }} />, label: `${detail.participants}/${detail.maxParticipants} participanti` },
                                    { icon: <AttachMoney sx={{ fontSize: 14 }} />, label: detail.price },
                                ].map((row, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ color: '#94a3b8' }}>{row.icon}</Box>
                                        <Typography variant="body2">{row.label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={() => setDetail(null)} sx={{ borderRadius: 2 }}>Inchide</Button>
                            {isRegistered(detail.id) ? (
                                <Button variant="outlined" color="error" startIcon={<ExitToApp />} onClick={() => cancel(detail.id)} sx={{ borderRadius: 2 }}>Anuleaza inregistrarea</Button>
                            ) : (
                                <Button variant="contained" startIcon={<Add />} onClick={() => register(detail)} sx={{ borderRadius: 2, boxShadow: 'none' }}>Inscrie-te</Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </DashboardLayout>
    );
};

export default EvenimenteDashboard;