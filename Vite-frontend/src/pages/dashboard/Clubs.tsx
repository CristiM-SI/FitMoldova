import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, Chip, Avatar,
    TextField, InputAdornment, Tabs, Tab, Rating, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, Divider, CircularProgress, Alert,
} from '@mui/material';
import { Search, Group, Add, ExitToApp, Close, LocationOn, Refresh } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout.tsx';
import { useProgress } from '../../context/ProgressContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { clubApi, type ClubDto } from '../../services/api/clubApi.ts';

const CATEGORIES = ['Toate', 'Alergare', 'Ciclism', 'Fitness', 'Yoga', 'Înot', 'Trail'] as const;

const CAT_COLORS: Record<string, string> = {
    Alergare: '#3b82f6', Ciclism: '#10b981', Fitness: '#f59e0b',
    Yoga: '#a855f7', Înot: '#06b6d4', Trail: '#84cc16',
};

const CAT_ICONS: Record<string, string> = {
    Alergare: '🏃', Ciclism: '🚴', Fitness: '💪',
    Yoga: '🧘', Înot: '🏊', Trail: '🌲',
};

// Imagine cu fallback pentru emoji categorie
const ClubImage: React.FC<{ src?: string; height?: number; color: string; icon: string }> = ({
                                                                                                 src, height = 120, color, icon
                                                                                             }) => {
    const [error, setError] = useState(false);
    const show = !src || error;

    return (
        <Box sx={{
            width: '100%', height, borderRadius: 2, overflow: 'hidden',
            background: show ? `${color}15` : '#f8faff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mb: 1.5,
        }}>
            {show ? (
                <Box sx={{ fontSize: '2.5rem', opacity: 0.7 }}>{icon}</Box>
            ) : (
                <img
                    src={src}
                    alt=""
                    onError={() => setError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                />
            )}
        </Box>
    );
};

const ClubsPage: React.FC = () => {
    const { completeJoinClub } = useProgress();
    const { user, isAuthenticated } = useAuth();

    const [clubs, setClubs]           = useState<ClubDto[]>([]);
    const [joinedClubs, setJoinedClubs] = useState<ClubDto[]>([]);
    const [loading, setLoading]       = useState(false);
    const [loadingJoined, setLoadingJoined] = useState(false);
    const [apiError, setApiError]     = useState<string | null>(null);

    const [tabVal, setTabVal]         = useState(0);
    const [search, setSearch]         = useState('');
    const [filterCat, setFilterCat]   = useState('Toate');
    const [detailClub, setDetailClub] = useState<ClubDto | null>(null);
    const [processing, setProcessing] = useState(false);

    // ── Fetch toate cluburile ────────────────────────────────────────────────
    const fetchClubs = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            const data = await clubApi.getAll();
            setClubs(data ?? []);
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : 'Nu s-a putut conecta la server.');
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Fetch cluburile userului (N-N via ClubMembers) ───────────────────────
    const fetchUserClubs = useCallback(async () => {
        if (!user?.id) { setJoinedClubs([]); return; }
        setLoadingJoined(true);
        try {
            const data = await clubApi.getUserClubs(user.id);
            setJoinedClubs(data ?? []);
        } catch {
            setJoinedClubs([]);
        } finally {
            setLoadingJoined(false);
        }
    }, [user?.id]);

    useEffect(() => { fetchClubs(); }, [fetchClubs]);
    useEffect(() => { fetchUserClubs(); }, [fetchUserClubs]);

    const joinedIds = useMemo(() => new Set(joinedClubs.map(c => c.id)), [joinedClubs]);
    const isJoined = (id: number) => joinedIds.has(id);

    // ── Alătură-te unui club ─────────────────────────────────────────────────
    const joinClub = async (club: ClubDto) => {
        if (!isAuthenticated || !user?.id) {
            setApiError('Trebuie să te autentifici pentru a te alătura unui club.');
            return;
        }
        if (isJoined(club.id)) return;
        setProcessing(true);
        try {
            await clubApi.joinClub(club.id, user.id);
            // Reîncarcă pentru a avea MembersCount actualizat din backend
            await Promise.all([fetchClubs(), fetchUserClubs()]);
            completeJoinClub();
            setDetailClub(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Eroare la înscriere';
            // Dacă deja membru, doar reîmprospătăm
            if (msg.toLowerCase().includes('deja')) {
                await fetchUserClubs();
                setDetailClub(null);
            } else {
                setApiError(msg);
            }
        } finally {
            setProcessing(false);
        }
    };

    // ── Părăsește clubul ─────────────────────────────────────────────────────
    const leaveClub = async (clubId: number) => {
        if (!user?.id) return;
        setProcessing(true);
        try {
            await clubApi.leaveClub(clubId, user.id);
            await Promise.all([fetchClubs(), fetchUserClubs()]);
            setDetailClub(null);
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : 'Eroare la părăsire');
        } finally {
            setProcessing(false);
        }
    };

    const availableClubs = clubs.filter(c => !joinedIds.has(c.id));
    const displayList    = tabVal === 0 ? availableClubs : joinedClubs;

    const filtered = useMemo(() => displayList.filter(c => {
        const matchSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.location.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === 'Toate' || c.category === filterCat;
        return matchSearch && matchCat;
    }), [displayList, search, filterCat]);

    const totalMembers = clubs.reduce((s, c) => s + (c.membersCount ?? 0), 0);

    return (
        <DashboardLayout>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} color="#0f172a">Cluburi</Typography>
                <Typography variant="body2" color="text.secondary">
                    Descoperă și alătură-te cluburilor sportive din comunitate
                </Typography>
            </Box>

            {apiError && (
                <Alert
                    severity="error"
                    sx={{ mb: 2, borderRadius: 2 }}
                    action={
                        <Button size="small" startIcon={<Refresh />} onClick={fetchClubs} color="inherit">
                            Reîncearcă
                        </Button>
                    }
                    onClose={() => setApiError(null)}
                >
                    {apiError}
                </Alert>
            )}

            {/* Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Cluburi Disponibile', value: availableClubs.length, emoji: '🏟️', bg: '#f0f7ff', color: '#1a6fff' },
                    { label: 'Cluburile Mele',      value: joinedClubs.length,    emoji: '👥', bg: '#ecfdf5', color: '#10b981' },
                    { label: 'Total Membri',        value: totalMembers.toLocaleString(), emoji: '🏃', bg: '#fffbeb', color: '#f59e0b' },
                    { label: 'Categorii',           value: CATEGORIES.length - 1, emoji: '🏅', bg: '#fdf4ff', color: '#a855f7' },
                ].map(s => (
                    <Grid size={{ xs: 6, sm: 3 }} key={s.label}>
                        <Card elevation={0} sx={{ borderRadius: 3, bgcolor: s.bg, border: '1px solid rgba(0,0,0,0.04)', height: '100%' }}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1.3 }}>
                                        {s.label}
                                    </Typography>
                                    <Typography fontSize="1.4rem">{s.emoji}</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={900} color="#0f172a">{s.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Filtre */}
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                    <Tabs value={tabVal} onChange={(_, v) => setTabVal(v)} sx={{ mb: 2 }}>
                        <Tab label={`Explorează (${availableClubs.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
                        <Tab label={`Cluburile Mele (${joinedClubs.length})`} sx={{ fontWeight: 700, textTransform: 'none' }} />
                    </Tabs>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField
                            size="small"
                            placeholder="Caută club..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment>,
                            }}
                            sx={{ flex: '1 1 200px', maxWidth: 320 }}
                        />
                        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', flex: 1 }}>
                            {CATEGORIES.map(cat => (
                                <Chip
                                    key={cat}
                                    label={cat}
                                    onClick={() => setFilterCat(cat)}
                                    variant={filterCat === cat ? 'filled' : 'outlined'}
                                    size="small"
                                    sx={{
                                        fontWeight: 700, fontSize: '0.72rem',
                                        bgcolor: filterCat === cat ? '#1a6fff' : 'transparent',
                                        color: filterCat === cat ? '#fff' : '#64748b',
                                        borderColor: filterCat === cat ? '#1a6fff' : '#e8edf3',
                                        '&:hover': { bgcolor: filterCat === cat ? '#1558d6' : '#f0f7ff' },
                                    }}
                                />
                            ))}
                        </Box>
                        <IconButton size="small" onClick={fetchClubs} disabled={loading} title="Reîncarcă">
                            {loading ? <CircularProgress size={18} /> : <Refresh sx={{ fontSize: 20, color: '#94a3b8' }} />}
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>

            {(loading || loadingJoined) && clubs.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : filtered.length === 0 ? (
                <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3' }}>
                    <CardContent sx={{ p: 6, textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ mb: 1 }}>🏟️</Typography>
                        <Typography color="text.secondary" fontWeight={600}>
                            {tabVal === 1
                                ? 'Nu ești în niciun club. Explorează și alătură-te!'
                                : apiError
                                    ? 'Cluburile nu pot fi încărcate momentan.'
                                    : 'Niciun club găsit.'}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={2}>
                    {filtered.map(club => {
                        const joined_ = isJoined(club.id);
                        const catColor = CAT_COLORS[club.category] || '#6366f1';
                        const catIcon  = CAT_ICONS[club.category] || '🏅';
                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={club.id}>
                                <Card
                                    elevation={0}
                                    onClick={() => setDetailClub(club)}
                                    sx={{
                                        borderRadius: 3,
                                        border: `1px solid ${joined_ ? '#1a6fff30' : '#e8edf3'}`,
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' },
                                        transition: 'all 0.2s',
                                        height: '100%',
                                    }}
                                >
                                    <CardContent sx={{ p: 2.5 }}>
                                        {/* Imagine club */}
                                        <ClubImage src={club.imageUrl} color={catColor} icon={catIcon} height={120} />

                                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                            <Avatar sx={{ width: 44, height: 44, fontSize: '1.3rem', bgcolor: `${catColor}12`, borderRadius: '12px' }}>
                                                {catIcon}
                                            </Avatar>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Typography variant="body2" fontWeight={800} noWrap sx={{ flex: 1 }}>{club.name}</Typography>
                                                    {joined_ && (
                                                        <Chip label="✓ Înscris" size="small"
                                                              sx={{ height: 18, bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 700, fontSize: '0.6rem', ml: 0.5 }}
                                                        />
                                                    )}
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                                    <LocationOn sx={{ fontSize: 11, color: '#94a3b8' }} />
                                                    <Typography variant="caption" color="text.secondary" noWrap>{club.location}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, lineHeight: 1.5 }}>
                                            {club.description.length > 85 ? club.description.slice(0, 85) + '...' : club.description}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                                            <Chip label={club.category} size="small" sx={{ height: 20, bgcolor: `${catColor}12`, color: catColor, fontWeight: 700, fontSize: '0.68rem' }} />
                                            <Chip label={club.level}    size="small" sx={{ height: 20, bgcolor: '#f8faff', color: '#64748b', fontSize: '0.68rem' }} />
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Group sx={{ fontSize: 13, color: '#94a3b8' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {(club.membersCount ?? 0).toLocaleString()} membri
                                                </Typography>
                                            </Box>
                                            <Rating value={club.rating} readOnly size="small" precision={0.5} sx={{ fontSize: '0.8rem' }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Detail Dialog */}
            <Dialog
                open={!!detailClub}
                onClose={() => setDetailClub(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                {detailClub && (() => {
                    const catColor = CAT_COLORS[detailClub.category] || '#6366f1';
                    const catIcon  = CAT_ICONS[detailClub.category] || '🏅';
                    return (
                        <>
                            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: `${catColor}12`, width: 48, height: 48, fontSize: '1.4rem', borderRadius: '12px' }}>
                                        {catIcon}
                                    </Avatar>
                                    <Box>
                                        <Typography fontWeight={800}>{detailClub.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{detailClub.location}</Typography>
                                    </Box>
                                </Box>
                                <IconButton onClick={() => setDetailClub(null)} size="small"><Close /></IconButton>
                            </DialogTitle>
                            <Divider />
                            <DialogContent sx={{ pt: 2 }}>
                                {/* Imagine club mare în dialog */}
                                <ClubImage src={detailClub.imageUrl} color={catColor} icon={catIcon} height={180} />

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                                    {detailClub.description}
                                </Typography>
                                <Grid container spacing={1.5}>
                                    {[
                                        { label: 'Categorie', value: detailClub.category },
                                        { label: 'Nivel',     value: detailClub.level },
                                        { label: 'Membri',    value: (detailClub.membersCount ?? 0).toLocaleString() },
                                        { label: 'Program',   value: detailClub.schedule },
                                    ].filter(r => r.value).map(row => (
                                        <Grid size={6} key={row.label}>
                                            <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                                            <Typography variant="body2" fontWeight={700}>{row.value}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{ mt: 2 }}>
                                    <Rating value={detailClub.rating} readOnly precision={0.5} />
                                </Box>
                            </DialogContent>
                            <Divider />
                            <DialogActions sx={{ p: 2 }}>
                                <Button onClick={() => setDetailClub(null)} sx={{ borderRadius: 2 }}>Închide</Button>
                                {!isAuthenticated ? (
                                    <Button variant="contained" disabled sx={{ borderRadius: 2 }}>
                                        Autentifică-te pentru a te alătura
                                    </Button>
                                ) : isJoined(detailClub.id) ? (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <ExitToApp />}
                                        onClick={() => leaveClub(detailClub.id)}
                                        disabled={processing}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Părăsește
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <Add />}
                                        onClick={() => joinClub(detailClub)}
                                        disabled={processing}
                                        sx={{ borderRadius: 2, boxShadow: 'none' }}
                                    >
                                        Alătură-te
                                    </Button>
                                )}
                            </DialogActions>
                        </>
                    );
                })()}
            </Dialog>
        </DashboardLayout>
    );
};

export default ClubsPage;
