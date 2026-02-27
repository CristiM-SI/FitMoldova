import React, { useState, useMemo } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, Chip, Avatar,
    TextField, InputAdornment, Tabs, Tab, LinearProgress, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider,
} from '@mui/material';
import { Search, Add, ExitToApp, Close, LocationOn, AccessTime, Group, AttachMoney, CalendarToday } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import { useDashboardData } from '../context/useDashboardData';
import type { Eveniment } from '../services/mock/evenimente';

const CATEGORIES = ['Toate', 'Maraton', 'Ciclism', 'Yoga', 'Fitness', 'Trail', 'Înot', 'Social'] as const;
const MONTHS_RO = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CAT_COLORS: Record<string, string> = {
    Maraton: '#ef4444', Ciclism: '#3b82f6', Yoga: '#a855f7', Fitness: '#f59e0b',
    Trail: '#10b981', Înot: '#06b6d4', Social: '#ec4899',
};

const DIFF_COLORS: Record<string, string> = {
    'Ușor': '#10b981', 'Mediu': '#f59e0b', 'Avansat': '#ef4444', 'Toate': '#3b82f6',
};

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

    const filtered = useMemo(() => list.filter((e) => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === 'Toate' || e.category === filterCat;
        return matchSearch && matchCat;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [list, search, filterCat]);

    const totalPart = [...inscrise, ...disponibile].reduce((s, e) => s + e.participants, 0);
    const freeEvents = disponibile.filter(e => e.price === 'Gratuit').length;

    return (
        <DashboardLayout>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} color="#0f172a">Evenimente</Typography>
                <Typography variant="body2" color="text.secondary">Descoperă și înscrie-te la evenimentele sportive din Moldova</Typography>
            </Box>

            {/* Stats — 4 full row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Disponibile', value: disponibile.length, emoji: '📅', bg: '#f0f7ff' },
                    { label: 'Înscrise', value: inscrise.length, emoji: '✅', bg: '#ecfdf5' },
                    { label: 'Total Participanți', value: totalPart.toLocaleString(), emoji: '👥', bg: '#fffbeb' },
                    { label: 'Evenimente Gratuite', value: freeEvents, emoji: '🆓', bg: '#fdf4ff' },
                ].map((s) => (
                    <Grid item xs={6} sm={3} key={s.label}>
                        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: s.bg, border: '1px solid rgba(0,0,0,0.04)', height: '100%' }}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1.3 }}>{s.label}</Typography>
                                    <Typography fontSize="1.4rem">{s.emoji}</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={900} color="#0f172a">{s.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Filters */}
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                    <Tabs value={tabVal} onChange={(_, v) => setTabVal(v)} sx={{ mb: 2 }}>
                        <Tab label={`Toate (${disponibile.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
                        <Tab label={`Înscrise (${inscrise.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
                    </Tabs>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField size="small" placeholder="Caută eveniment sau oraș..."
                                   value={search} onChange={(e) => setSearch(e.target.value)}
                                   InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment> }}
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
                            {tabVal === 1 ? 'Nu ești înscris la niciun eveniment.' : 'Niciun eveniment găsit.'}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={2}>
                    {filtered.map((ev) => {
                        const d = new Date(ev.date);
                        const pct = Math.round((ev.participants / ev.maxParticipants) * 100);
                        const catColor = CAT_COLORS[ev.category] || '#6366f1';
                        const reg = isRegistered(ev.id);
                        return (
                            <Grid item xs={12} sm={6} md={4} key={ev.id}>
                                <Card elevation={0} onClick={() => setDetail(ev)}
                                      sx={{ borderRadius: 3, border: `1px solid ${reg ? '#10b98130' : '#e8edf3'}`, cursor: 'pointer', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' }, transition: 'all 0.2s', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                                            <Box sx={{ textAlign: 'center', bgcolor: `${catColor}10`, borderRadius: 2, p: 1, minWidth: 52, flexShrink: 0 }}>
                                                <Typography variant="h5" fontWeight={900} color={catColor} lineHeight={1}>{d.getDate()}</Typography>
                                                <Typography variant="caption" color={catColor} fontWeight={700}>{MONTHS_RO[d.getMonth()]}</Typography>
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 0.25 }}>
                                                    <Typography variant="body2" fontWeight={800} sx={{ flex: 1, lineHeight: 1.3 }}>{ev.icon} {ev.name}</Typography>
                                                    {reg && <Chip label="✓" size="small" sx={{ height: 16, bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 900, fontSize: '0.6rem', flexShrink: 0 }} />}
                                                </Box>
                                                <Typography variant="caption" color="text.secondary" noWrap>{ev.organizer}</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5, flexWrap: 'wrap' }}>
                                            <Chip label={ev.category} size="small" sx={{ height: 18, bgcolor: `${catColor}10`, color: catColor, fontWeight: 700, fontSize: '0.65rem' }} />
                                            <Chip label={ev.difficulty} size="small" sx={{ height: 18, bgcolor: `${DIFF_COLORS[ev.difficulty] || '#94a3b8'}10`, color: DIFF_COLORS[ev.difficulty] || '#94a3b8', fontSize: '0.65rem' }} />
                                            <Chip label={ev.price === 'Gratuit' ? '🆓 Gratuit' : `💰 ${ev.price}`} size="small"
                                                  sx={{ height: 18, bgcolor: ev.price === 'Gratuit' ? '#ecfdf5' : '#fffbeb', color: ev.price === 'Gratuit' ? '#10b981' : '#f59e0b', fontSize: '0.65rem', fontWeight: 700 }} />
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
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
                                                <Typography variant="caption" fontWeight={700}
                                                            color={pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981'}>{pct}%</Typography>
                                            </Box>
                                            <LinearProgress variant="determinate" value={pct}
                                                            sx={{ height: 4, borderRadius: 2, bgcolor: '#f0f4f8', '& .MuiLinearProgress-bar': { bgcolor: pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981', borderRadius: 2 } }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Detail Dialog */}
            <Dialog open={!!detail} onClose={() => setDetail(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                {detail && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography fontWeight={800} fontSize="1.1rem">{detail.icon} {detail.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{detail.organizer}</Typography>
                            </Box>
                            <IconButton size="small" onClick={() => setDetail(null)}><Close /></IconButton>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>{detail.description}</Typography>
                            <Grid container spacing={1.5}>
                                {[
                                    { icon: <CalendarToday sx={{ fontSize: 14 }} />, label: new Date(detail.date).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                                    { icon: <AccessTime sx={{ fontSize: 14 }} />, label: detail.time },
                                    { icon: <LocationOn sx={{ fontSize: 14 }} />, label: `${detail.location}, ${detail.city}` },
                                    { icon: <Group sx={{ fontSize: 14 }} />, label: `${detail.participants}/${detail.maxParticipants} participanți` },
                                    { icon: <AttachMoney sx={{ fontSize: 14 }} />, label: detail.price },
                                ].map((row, i) => (
                                    <Grid item xs={12} key={i}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ color: '#94a3b8' }}>{row.icon}</Box>
                                            <Typography variant="body2">{row.label}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={() => setDetail(null)} sx={{ borderRadius: 2 }}>Închide</Button>
                            {isRegistered(detail.id) ? (
                                <Button variant="outlined" color="error" startIcon={<ExitToApp />} onClick={() => cancel(detail.id)} sx={{ borderRadius: 2 }}>Anulează înregistrarea</Button>
                            ) : (
                                <Button variant="contained" startIcon={<Add />} onClick={() => register(detail)} sx={{ borderRadius: 2, boxShadow: 'none' }}>Înscrie-te</Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </DashboardLayout>
    );
};

export default EvenimenteDashboard;
