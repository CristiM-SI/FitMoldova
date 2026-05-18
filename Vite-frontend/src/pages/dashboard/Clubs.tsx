import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
    Box, Typography, Card, CardContent, Button, Chip,
    TextField, InputAdornment, Tabs, Tab, Rating, IconButton, Dialog,
    DialogContent, DialogActions, Divider, CircularProgress,
    Alert, Tooltip, Fade,
} from '@mui/material';
import {
    Search, Group, Add, ExitToApp, Close, LocationOn, Refresh,
    Schedule, ArrowBack, Edit,
} from '@mui/icons-material';
import DashboardLayout from './DashboardLayout.tsx';
import { useProgress } from '../../context/ProgressContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { clubApi, type ClubDto } from '../../services/api/clubApi.ts';
import postApi, { type PostInfoDto } from '../../services/api/postApi.ts';

const CATEGORIES = ['Toate', 'Alergare', 'Ciclism', 'Fitness', 'Yoga', 'Înot', 'Trail'] as const;

const CAT_COLORS: Record<string, string> = {
    Alergare: '#3b82f6', Ciclism: '#10b981', Fitness: '#f59e0b',
    Yoga: '#a855f7', Înot: '#06b6d4', Trail: '#84cc16',
};
const CAT_ICONS: Record<string, string> = {
    Alergare: '🏃', Ciclism: '🚴', Fitness: '💪',
    Yoga: '🧘', Înot: '🏊', Trail: '🌲',
};
const CAT_GRADIENTS: Record<string, string> = {
    Alergare: 'linear-gradient(135deg,#3b82f610 0%,#60a5fa08 100%)',
    Ciclism:  'linear-gradient(135deg,#10b98110 0%,#34d39908 100%)',
    Fitness:  'linear-gradient(135deg,#f59e0b10 0%,#fbbf2408 100%)',
    Yoga:     'linear-gradient(135deg,#a855f710 0%,#c084fc08 100%)',
    Înot:     'linear-gradient(135deg,#06b6d410 0%,#22d3ee08 100%)',
    Trail:    'linear-gradient(135deg,#84cc1610 0%,#a3e63508 100%)',
};

const ClubImage: React.FC<{ src?: string; height?: number; color: string; icon: string }> = ({ src, height = 140, color, icon }) => {
    const [error, setError] = useState(false);
    const show = !src || error;
    return (
        <Box sx={{
            width: '100%', height, overflow: 'hidden',
            background: show ? `linear-gradient(135deg,${color}20,${color}08)` : '#f8faff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {show
                ? <Box sx={{ fontSize: '3rem', opacity: 0.6 }}>{icon}</Box>
                : <img src={src} alt="" onError={() => setError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />}
        </Box>
    );
};

const StatPill: React.FC<{ icon: string; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, borderRadius: 3, bgcolor: `${color}08`, border: `1px solid ${color}18`, flex: 1 }}>
        <Typography fontSize="1.4rem" mb={0.5}>{icon}</Typography>
        <Typography variant="h5" fontWeight={900} color={color}>{value}</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
    </Box>
);

const ClubsPage: React.FC = () => {
    const navigate = useNavigate();
    const { completeJoinClub } = useProgress();
    const { user, isAuthenticated } = useAuth();

    const [clubs, setClubs] = useState<ClubDto[]>([]);
    const [joinedClubs, setJoinedClubs] = useState<ClubDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingJoined, setLoadingJoined] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [tabVal, setTabVal] = useState(0);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('Toate');
    const [detailClub, setDetailClub] = useState<ClubDto | null>(null);
    const [processing, setProcessing] = useState(false);
    const [clubPosts, setClubPosts] = useState<PostInfoDto[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [showPostForm, setShowPostForm] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [postSaving, setPostSaving] = useState(false);
    const [postSuccess, setPostSuccess] = useState(false);

    const fetchClubs = useCallback(async () => {
        setLoading(true); setApiError(null);
        try { setClubs((await clubApi.getAll()) ?? []); }
        catch (e: unknown) { setApiError(e instanceof Error ? e.message : 'Eroare server'); }
        finally { setLoading(false); }
    }, []);

    const fetchUserClubs = useCallback(async () => {
        if (!user?.id) { setJoinedClubs([]); return; }
        setLoadingJoined(true);
        try { setJoinedClubs((await clubApi.getUserClubs(user.id)) ?? []); }
        catch { setJoinedClubs([]); }
        finally { setLoadingJoined(false); }
    }, [user?.id]);

    useEffect(() => { fetchClubs(); }, [fetchClubs]);
    useEffect(() => { fetchUserClubs(); }, [fetchUserClubs]);

    useEffect(() => {
        if (!detailClub) { setClubPosts([]); return; }
        setLoadingPosts(true);
        setShowPostForm(false);
        setNewPostContent('');
        setPostSuccess(false);
        postApi.getByClub(detailClub.id)
            .then(p => setClubPosts(p ?? []))
            .catch(() => setClubPosts([]))
            .finally(() => setLoadingPosts(false));
    }, [detailClub]);

    const handlePostInClub = async () => {
        if (!detailClub || newPostContent.trim().length < 10) return;
        setPostSaving(true);
        try {
            await postApi.create({ userId: 0, content: newPostContent.trim(), sport: detailClub.category, clubId: detailClub.id });
            setNewPostContent('');
            setShowPostForm(false);
            setPostSuccess(true);
            setTimeout(() => setPostSuccess(false), 3000);
            setClubPosts((await postApi.getByClub(detailClub.id)) ?? []);
        } catch { /* ignore */ }
        finally { setPostSaving(false); }
    };

    const joinedIds = useMemo(() => new Set(joinedClubs.map(c => c.id)), [joinedClubs]);
    const isJoined = (id: number) => joinedIds.has(id);

    const joinClub = async (club: ClubDto) => {
        if (!isAuthenticated || !user?.id || isJoined(club.id)) return;
        setProcessing(true);
        try {
            await clubApi.joinClub(club.id);
            await Promise.all([fetchClubs(), fetchUserClubs()]);
            completeJoinClub();
            setDetailClub(null);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : '';
            if (msg.toLowerCase().includes('deja')) { await fetchUserClubs(); setDetailClub(null); }
            else { setApiError(msg); }
        } finally { setProcessing(false); }
    };

    const leaveClub = async (clubId: number) => {
        if (!user?.id) return;
        setProcessing(true);
        try {
            await clubApi.leaveClub(clubId);
            await Promise.all([fetchClubs(), fetchUserClubs()]);
            setDetailClub(null);
        } catch (e: unknown) { setApiError(e instanceof Error ? e.message : 'Eroare'); }
        finally { setProcessing(false); }
    };

    const availableClubs = clubs.filter(c => !joinedIds.has(c.id));
    const displayList = tabVal === 0 ? availableClubs : joinedClubs;
    const filtered = useMemo(() => displayList.filter(c => {
        const q = search.toLowerCase();
        return (c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q))
            && (filterCat === 'Toate' || c.category === filterCat);
    }), [displayList, search, filterCat]);

    const clubsParentRef = useRef<HTMLDivElement>(null);
    const clubRows: ClubDto[][] = [];
    for (let i = 0; i < filtered.length; i += 3) clubRows.push(filtered.slice(i, i + 3));
    const rowVirtualizer = useVirtualizer({ count: clubRows.length, getScrollElement: () => clubsParentRef.current, estimateSize: () => 300, overscan: 2 });
    const totalMembers = clubs.reduce((s, c) => s + (c.membersCount ?? 0), 0);

    return (
        <DashboardLayout>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800} color="#0f172a">Cluburi Sportive</Typography>
                <Typography variant="body2" color="text.secondary">Descoperă comunități active și alătură-te antrenamentelor</Typography>
            </Box>

            {apiError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}
                       action={<Button size="small" startIcon={<Refresh />} onClick={fetchClubs} color="inherit">Retry</Button>}
                       onClose={() => setApiError(null)}>{apiError}</Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <StatPill icon="🏟️" label="Disponibile" value={availableClubs.length} color="#1a6fff" />
                <StatPill icon="👥" label="Cluburile mele" value={joinedClubs.length} color="#10b981" />
                <StatPill icon="🏃" label="Total membri" value={totalMembers.toLocaleString()} color="#f59e0b" />
                <StatPill icon="🏅" label="Categorii" value={CATEGORIES.length - 1} color="#a855f7" />
            </Box>

            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf3', mb: 2.5 }}>
                <CardContent sx={{ p: 2 }}>
                    <Tabs value={tabVal} onChange={(_, v) => setTabVal(v)} sx={{ mb: 2 }}
                          TabIndicatorProps={{ style: { background: '#1a6fff', height: 3, borderRadius: 2 } }}>
                        <Tab label={`Explorează (${availableClubs.length})`} sx={{ fontWeight: 700, textTransform: 'none', '&.Mui-selected': { color: '#1a6fff' } }} />
                        <Tab label={`Cluburile Mele (${joinedClubs.length})`} sx={{ fontWeight: 700, textTransform: 'none', '&.Mui-selected': { color: '#1a6fff' } }} />
                    </Tabs>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField size="small" placeholder="Caută club sau locație..." value={search} onChange={e => setSearch(e.target.value)}
                                   InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> }}
                                   sx={{ flex: '1 1 200px', maxWidth: 300 }} />
                        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', flex: 1 }}>
                            {CATEGORIES.map(cat => (
                                <Chip key={cat} label={cat} onClick={() => setFilterCat(cat)} size="small" sx={{
                                    fontWeight: 600, fontSize: '0.7rem', cursor: 'pointer',
                                    bgcolor: filterCat === cat ? '#1a6fff' : 'transparent',
                                    color: filterCat === cat ? '#fff' : '#64748b',
                                    border: `1px solid ${filterCat === cat ? '#1a6fff' : '#e2e8f0'}`,
                                    '&:hover': { bgcolor: filterCat === cat ? '#1558d6' : '#f0f7ff' },
                                }} />
                            ))}
                        </Box>
                        <Tooltip title="Reîncarcă">
                            <IconButton size="small" onClick={fetchClubs} disabled={loading}>
                                {loading ? <CircularProgress size={18} /> : <Refresh sx={{ fontSize: 20, color: '#94a3b8' }} />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </CardContent>
            </Card>

            {(loading || loadingJoined) && clubs.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
            ) : filtered.length === 0 ? (
                <Card elevation={0} sx={{ borderRadius: 3, border: '1px dashed #e2e8f0' }}>
                    <CardContent sx={{ p: 6, textAlign: 'center' }}>
                        <Typography fontSize="2.5rem" mb={1}>🏟️</Typography>
                        <Typography color="text.secondary" fontWeight={600}>
                            {tabVal === 1 ? 'Nu ești în niciun club. Explorează tab-ul alăturat!' : 'Niciun club găsit.'}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <div ref={clubsParentRef} style={{ height: '72vh', overflowY: 'auto' }}>
                    <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
                        {rowVirtualizer.getVirtualItems().map(vRow => (
                            <div key={vRow.key} style={{
                                position: 'absolute', top: 0, left: 0, width: '100%',
                                transform: `translateY(${vRow.start}px)`,
                                display: 'flex', gap: 16, paddingBottom: 16,
                            }}>
                                {clubRows[vRow.index].map(club => {
                                    const joined_ = isJoined(club.id);
                                    const catColor = CAT_COLORS[club.category] || '#6366f1';
                                    const catIcon = CAT_ICONS[club.category] || '🏅';
                                    const catGrad = CAT_GRADIENTS[club.category] || '';
                                    return (
                                        <div key={club.id} style={{ flex: '1 1 0', minWidth: 0 }}>
                                            <Card elevation={0} onClick={() => navigate({ to: '/clubs/$id', params: { id: String(club.id) } })} sx={{
                                                borderRadius: 3, cursor: 'pointer', overflow: 'hidden',
                                                border: `1.5px solid ${joined_ ? catColor + '40' : '#e8edf3'}`,
                                                background: joined_ ? catGrad : '#fff',
                                                transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
                                                '&:hover': { boxShadow: `0 8px 30px ${catColor}20`, transform: 'translateY(-3px)', border: `1.5px solid ${catColor}60` },
                                                height: '100%',
                                            }}>
                                                <ClubImage src={club.imageUrl} color={catColor} icon={catIcon} height={130} />
                                                {joined_ && (
                                                    <Box sx={{ mx: 2, mt: 1.5, py: 0.4, px: 1.2, borderRadius: 20, bgcolor: `${catColor}15`, border: `1px solid ${catColor}30`, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: catColor }} />
                                                        <Typography variant="caption" fontWeight={700} color={catColor}>Membru activ</Typography>
                                                    </Box>
                                                )}
                                                <CardContent sx={{ p: 2 }}>
                                                    <Typography variant="body2" fontWeight={800} mb={0.5} noWrap>{club.name}</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                                        <LocationOn sx={{ fontSize: 11, color: '#94a3b8' }} />
                                                        <Typography variant="caption" color="text.secondary" noWrap>{club.location}</Typography>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, lineHeight: 1.5 }}>
                                                        {club.description.length > 70 ? club.description.slice(0, 70) + '...' : club.description}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Chip label={club.category} size="small" sx={{ height: 20, bgcolor: `${catColor}15`, color: catColor, fontWeight: 700, fontSize: '0.65rem' }} />
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Group sx={{ fontSize: 12, color: '#94a3b8' }} />
                                                            <Typography variant="caption" color="text.secondary">{club.membersCount ?? 0}</Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    );
                                })}
                                {clubRows[vRow.index].length < 3 &&
                                    Array(3 - clubRows[vRow.index].length).fill(null).map((_, i) => (
                                        <div key={`ph-${i}`} style={{ flex: '1 1 0' }} />
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Detail Dialog ── */}
            <Dialog open={!!detailClub} onClose={() => setDetailClub(null)} maxWidth="sm" fullWidth
                    TransitionComponent={Fade} PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
                {detailClub && (() => {
                    const catColor = CAT_COLORS[detailClub.category] || '#6366f1';
                    const catIcon = CAT_ICONS[detailClub.category] || '🏅';
                    const joined_ = isJoined(detailClub.id);
                    return (
                        <>
                            {/* Hero */}
                            <Box sx={{ position: 'relative' }}>
                                <ClubImage src={detailClub.imageUrl} color={catColor} icon={catIcon} height={200} />
                                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, p: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                                    <IconButton onClick={() => setDetailClub(null)} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#fff' } }}>
                                        <ArrowBack fontSize="small" />
                                    </IconButton>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {joined_ && (
                                            <Tooltip title="Părăsește clubul">
                                                <IconButton size="small" onClick={() => leaveClub(detailClub.id)} disabled={processing}
                                                            sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: '#ef4444', '&:hover': { bgcolor: '#fff1f1' } }}>
                                                    {processing ? <CircularProgress size={16} color="inherit" /> : <ExitToApp fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <IconButton onClick={() => setDetailClub(null)} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#fff' } }}>
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                                {joined_ && (
                                    <Box sx={{ position: 'absolute', bottom: 12, left: 16, py: 0.5, px: 1.5, borderRadius: 20, bgcolor: catColor, color: '#fff', display: 'flex', alignItems: 'center', gap: 0.75, boxShadow: `0 2px 12px ${catColor}60` }}>
                                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#fff', opacity: 0.9 }} />
                                        <Typography variant="caption" fontWeight={800} letterSpacing={0.5}>MEMBRU ACTIV</Typography>
                                    </Box>
                                )}
                            </Box>

                            <DialogContent sx={{ px: 3, pt: 2.5, pb: 0 }}>
                                {/* Title + join btn (ascuns daca esti deja membru) */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Box sx={{ flex: 1, mr: 1 }}>
                                        <Typography variant="h6" fontWeight={800} lineHeight={1.2}>{detailClub.name}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                            <LocationOn sx={{ fontSize: 13, color: '#94a3b8' }} />
                                            <Typography variant="caption" color="text.secondary">{detailClub.location}</Typography>
                                        </Box>
                                    </Box>
                                    {isAuthenticated && !joined_ && (
                                        <Button variant="contained" size="small"
                                                startIcon={processing ? <CircularProgress size={14} color="inherit" /> : <Add />}
                                                onClick={() => joinClub(detailClub)} disabled={processing}
                                                sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, flexShrink: 0, bgcolor: catColor, boxShadow: `0 4px 14px ${catColor}40`, '&:hover': { bgcolor: catColor, filter: 'brightness(0.9)' } }}>
                                            Alătură-te
                                        </Button>
                                    )}
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>{detailClub.description}</Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    <Chip label={`${catIcon} ${detailClub.category}`} size="small" sx={{ bgcolor: `${catColor}12`, color: catColor, fontWeight: 700, fontSize: '0.72rem' }} />
                                    <Chip label={`⚡ ${detailClub.level}`} size="small" sx={{ bgcolor: '#f8faff', color: '#475569', fontSize: '0.72rem' }} />
                                    <Chip icon={<Group sx={{ fontSize: '14px !important' }} />} label={`${detailClub.membersCount ?? 0} membri`} size="small" sx={{ bgcolor: '#f8faff', color: '#475569', fontSize: '0.72rem' }} />
                                    {detailClub.schedule && <Chip icon={<Schedule sx={{ fontSize: '14px !important' }} />} label={detailClub.schedule} size="small" sx={{ bgcolor: '#f8faff', color: '#475569', fontSize: '0.72rem' }} />}
                                </Box>
                                <Rating value={detailClub.rating} readOnly precision={0.5} size="small" sx={{ mb: 2 }} />

                                <Divider sx={{ mb: 2 }} />

                                {/* Posts */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Typography variant="subtitle2" fontWeight={800}>📝 Postări club</Typography>
                                    {joined_ && (
                                        <Button size="small" variant={showPostForm ? 'outlined' : 'contained'}
                                                startIcon={<Edit sx={{ fontSize: 14 }} />}
                                                onClick={() => setShowPostForm(v => !v)}
                                                sx={{ borderRadius: 3, textTransform: 'none', fontSize: '0.72rem', fontWeight: 700, boxShadow: 'none', ...(showPostForm ? {} : { bgcolor: catColor, '&:hover': { bgcolor: catColor, filter: 'brightness(0.9)' } }) }}>
                                            {showPostForm ? 'Anulează' : 'Postare nouă'}
                                        </Button>
                                    )}
                                </Box>

                                {postSuccess && <Alert severity="success" sx={{ mb: 1.5, borderRadius: 2, py: 0.5 }}>Postare publicată! Membrii au primit notificare. 🎉</Alert>}

                                {showPostForm && (
                                    <Box sx={{ p: 2, mb: 2, borderRadius: 3, border: `1px solid ${catColor}30`, bgcolor: `${catColor}05` }}>
                                        <TextField multiline fullWidth minRows={3}
                                                   placeholder={`Scrie ceva pentru membrii "${detailClub.name}"...`}
                                                   value={newPostContent} onChange={e => setNewPostContent(e.target.value)}
                                                   size="small" inputProps={{ maxLength: 1000 }} sx={{ mb: 1.5 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="caption" color="text.secondary">{newPostContent.length}/1000</Typography>
                                            <Button variant="contained" size="small"
                                                    disabled={newPostContent.trim().length < 10 || postSaving}
                                                    onClick={handlePostInClub}
                                                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, bgcolor: catColor, boxShadow: 'none', '&:hover': { bgcolor: catColor, filter: 'brightness(0.9)' } }}>
                                                {postSaving ? <CircularProgress size={14} color="inherit" /> : 'Publică'}
                                            </Button>
                                        </Box>
                                    </Box>
                                )}

                                {loadingPosts ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={24} /></Box>
                                ) : clubPosts.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 3, border: '1.5px dashed #e2e8f0', borderRadius: 3, mb: 2 }}>
                                        <Typography fontSize="1.8rem" mb={0.5}>📭</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {joined_ ? 'Nicio postare. Fii primul!' : 'Alătură-te pentru a vedea postări.'}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 260, overflowY: 'auto', pr: 0.5, mb: 2 }}>
                                        {clubPosts.slice(0, 10).map(post => (
                                            <Box key={post.id} sx={{ p: 1.5, borderRadius: 2.5, border: '1px solid #f0f4f8', bgcolor: '#fafbff', '&:hover': { bgcolor: '#f0f7ff', borderColor: `${catColor}30` }, transition: 'all 0.15s' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption" fontWeight={700} color={catColor}>{post.authorName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(post.createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                    {post.content.length > 180 ? post.content.slice(0, 180) + '...' : post.content}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, mt: 0.75 }}>
                                                    <Typography variant="caption" color="text.secondary">❤️ {post.likes}</Typography>
                                                    <Typography variant="caption" color="text.secondary">💬 {post.commentsCount}</Typography>
                                                    {post.sport && <Typography variant="caption" color="text.secondary">🏅 {post.sport}</Typography>}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </DialogContent>

                            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #f0f4f8' }}>
                                <Button onClick={() => setDetailClub(null)} sx={{ borderRadius: 3, textTransform: 'none', color: '#64748b' }}>Închide</Button>
                                {isAuthenticated && !joined_ && (
                                    <Button variant="contained" size="medium"
                                            startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <Add />}
                                            onClick={() => joinClub(detailClub)} disabled={processing}
                                            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, bgcolor: catColor, boxShadow: `0 4px 14px ${catColor}40`, '&:hover': { bgcolor: catColor, filter: 'brightness(0.9)' } }}>
                                        Alătură-te clubului
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
