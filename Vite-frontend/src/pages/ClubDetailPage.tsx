import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
    Box, Typography, Button, Chip, Avatar, CircularProgress,
    Alert, Divider, TextField, Rating, Tooltip,
} from '@mui/material';
import {
    ArrowBack, Group, LocationOn, Schedule, Add, ExitToApp,
    Edit, NotificationsActive,
} from '@mui/icons-material';
import DashboardLayout from './dashboard/DashboardLayout.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useProgress } from '../context/ProgressContext.tsx';
import { clubApi, type ClubDto } from '../services/api/clubApi.ts';
import postApi, { type PostInfoDto } from '../services/api/postApi.ts';

const CAT_COLORS: Record<string, string> = {
    Alergare: '#3b82f6', Ciclism: '#10b981', Fitness: '#f59e0b',
    Yoga: '#a855f7', Înot: '#06b6d4', Trail: '#84cc16',
};
const CAT_ICONS: Record<string, string> = {
    Alergare: '🏃', Ciclism: '🚴', Fitness: '💪',
    Yoga: '🧘', Înot: '🏊', Trail: '🌲',
};

// ── Post card ──────────────────────────────────────────────────────────────────
const PostCard: React.FC<{ post: PostInfoDto; color: string }> = ({ post, color }) => (
    <Box sx={{
        p: 2, borderRadius: 2,
        border: '1px solid #f0f4f8',
        bgcolor: '#fff',
        '&:hover': { borderColor: `${color}40`, bgcolor: `${color}04` },
        transition: 'all 0.15s',
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: color, fontSize: '0.75rem', fontWeight: 800 }}>
                {post.authorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
                <Typography variant="caption" fontWeight={700} color={color}>
                    {post.authorName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>
                    {new Date(post.createdAt).toLocaleDateString('ro-RO', {
                        day: 'numeric', month: 'long', year: 'numeric',
                    })}
                </Typography>
            </Box>
            {post.sport && (
                <Chip label={post.sport} size="small"
                    sx={{ height: 18, bgcolor: `${color}12`, color, fontWeight: 700, fontSize: '0.62rem' }} />
            )}
        </Box>
        <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7, mb: 1 }}>
            {post.content}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">❤️ {post.likes}</Typography>
            <Typography variant="caption" color="text.secondary">💬 {post.commentsCount}</Typography>
        </Box>
    </Box>
);

// ── Main page ──────────────────────────────────────────────────────────────────
const ClubDetailPage: React.FC = () => {
    const { id } = useParams({ strict: false }) as { id: string };
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin } = useAuth();
    const { completeJoinClub } = useProgress();

    const [club, setClub]         = useState<ClubDto | null>(null);
    const [joined, setJoined]     = useState(false);
    const [posts, setPosts]       = useState<PostInfoDto[]>([]);
    const [members, setMembers]   = useState<{ id: number; username: string; joinedAt: string }[]>([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const [showPostForm, setShowPostForm] = useState(false);
    const [postContent, setPostContent]   = useState('');
    const [postSaving, setPostSaving]     = useState(false);
    const [postSuccess, setPostSuccess]   = useState(false);

    const clubId = parseInt(id);

    const fetchData = useCallback(async () => {
        if (!clubId) return;
        setLoading(true); setError(null);
        try {
            const [clubData, postsData] = await Promise.all([
                clubApi.getById(clubId),
                postApi.getByClub(clubId, 20),
            ]);
            setClub(clubData);
            setPosts(postsData ?? []);

            // Verificam daca userul e membru
            if (user?.id) {
                const userClubs = await clubApi.getUserClubs(user.id);
                setJoined((userClubs ?? []).some(c => c.id === clubId));
            }

            // Membri
            try {
                const membersData = await clubApi.getMembers(clubId);
                setMembers(membersData ?? []);
            } catch { setMembers([]); }

        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Nu s-a putut încărca clubul.');
        } finally {
            setLoading(false);
        }
    }, [clubId, user?.id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleJoin = async () => {
        if (!club) return;
        setProcessing(true);
        try {
            await clubApi.joinClub(club.id);
            setJoined(true);
            completeJoinClub();
            await fetchData();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : '';
            if (msg.toLowerCase().includes('deja')) { setJoined(true); }
            else { setError(msg); }
        } finally { setProcessing(false); }
    };

    const handleLeave = async () => {
        if (!club) return;
        setProcessing(true);
        try {
            await clubApi.leaveClub(club.id);
            setJoined(false);
            await fetchData();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Eroare la părăsire.');
        } finally { setProcessing(false); }
    };

    const handlePost = async () => {
        if (!club || postContent.trim().length < 10) return;
        setPostSaving(true);
        try {
            await postApi.create({ userId: 0, content: postContent.trim(), sport: club.category, clubId: club.id });
            setPostContent('');
            setShowPostForm(false);
            setPostSuccess(true);
            setTimeout(() => setPostSuccess(false), 4000);
            const updated = await postApi.getByClub(club.id, 20);
            setPosts(updated ?? []);
        } catch { /* handled by toast */ }
        finally { setPostSaving(false); }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            </DashboardLayout>
        );
    }

    if (error || !club) {
        return (
            <DashboardLayout>
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error ?? 'Club negăsit.'}</Alert>
            </DashboardLayout>
        );
    }

    const catColor = CAT_COLORS[club.category] || '#6366f1';
    const catIcon  = CAT_ICONS[club.category]  || '🏅';

    return (
        <DashboardLayout>
            {/* Back button */}
            <Button startIcon={<ArrowBack />} onClick={() => navigate({ to: '/clubs' })}
                sx={{ mb: 2, color: '#64748b', textTransform: 'none', fontWeight: 600 }}>
                Înapoi la cluburi
            </Button>

            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* ── LEFT COLUMN — main content ── */}
                <Box sx={{ flex: '1 1 500px', minWidth: 0 }}>

                    {/* Club header card */}
                    <Box sx={{
                        borderRadius: 3, overflow: 'hidden',
                        border: '1px solid #e8edf3', bgcolor: '#fff',
                        mb: 2,
                    }}>
                        {/* Hero image */}
                        <Box sx={{
                            height: 180, position: 'relative',
                            background: club.imageUrl
                                ? `url(${club.imageUrl}) center/cover`
                                : `linear-gradient(135deg, ${catColor}25, ${catColor}08)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {!club.imageUrl && (
                                <Typography fontSize="5rem" sx={{ opacity: 0.5 }}>{catIcon}</Typography>
                            )}
                            {/* Gradient overlay */}
                            <Box sx={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
                            }} />
                        </Box>

                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                {/* Club avatar */}
                                <Avatar sx={{
                                    width: 64, height: 64, fontSize: '2rem',
                                    bgcolor: `${catColor}20`, borderRadius: 3,
                                    border: `2px solid ${catColor}30`,
                                    mt: -6, flexShrink: 0,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                }}>
                                    {catIcon}
                                </Avatar>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                        <Box>
                                            <Typography variant="h5" fontWeight={800} color="#0f172a">
                                                {club.name}
                                            </Typography>
                                            {joined && (
                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10b981' }} />
                                                    <Typography variant="caption" color="#10b981" fontWeight={700}>
                                                        Membru activ
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Action buttons */}
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {isAuthenticated && !joined && (
                                                <Button variant="contained" size="medium"
                                                    startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <Add />}
                                                    onClick={handleJoin} disabled={processing}
                                                    sx={{
                                                        borderRadius: 3, textTransform: 'none', fontWeight: 700,
                                                        bgcolor: catColor, boxShadow: `0 4px 14px ${catColor}40`,
                                                        '&:hover': { bgcolor: catColor, filter: 'brightness(0.9)' },
                                                    }}>
                                                    Alătură-te
                                                </Button>
                                            )}
                                            {joined && (
                                                <Tooltip title="Părăsește clubul">
                                                    <Button variant="outlined" size="small" color="error"
                                                        startIcon={processing ? <CircularProgress size={14} color="inherit" /> : <ExitToApp />}
                                                        onClick={handleLeave} disabled={processing}
                                                        sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}>
                                                        Părăsește
                                                    </Button>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Stats row */}
                            <Box sx={{ display: 'flex', gap: 3, mt: 2.5, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <Group sx={{ fontSize: 16, color: '#94a3b8' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        <strong style={{ color: '#0f172a' }}>{club.membersCount ?? 0}</strong> membri
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <LocationOn sx={{ fontSize: 16, color: '#94a3b8' }} />
                                    <Typography variant="body2" color="text.secondary">{club.location}</Typography>
                                </Box>
                                {club.schedule && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        <Schedule sx={{ fontSize: 16, color: '#94a3b8' }} />
                                        <Typography variant="body2" color="text.secondary">{club.schedule}</Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Tags */}
                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                <Chip label={`${catIcon} ${club.category}`} size="small"
                                    sx={{ bgcolor: `${catColor}12`, color: catColor, fontWeight: 700 }} />
                                <Chip label={`⚡ ${club.level}`} size="small"
                                    sx={{ bgcolor: '#f8faff', color: '#475569' }} />
                                {club.rating > 0 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Rating value={club.rating} readOnly size="small" precision={0.5} />
                                        <Typography variant="caption" color="text.secondary">({club.rating})</Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Description */}
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                {club.description}
                            </Typography>
                        </Box>
                    </Box>

                    {/* ── Posts section ── */}
                    <Box sx={{ borderRadius: 3, border: '1px solid #e8edf3', bgcolor: '#fff', p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight={800} color="#0f172a">
                                📢 Postări club
                            </Typography>
                            {/* Doar Admin poate posta */}
                            {isAdmin && (
                                <Button variant="contained" size="small"
                                    startIcon={<Edit sx={{ fontSize: 14 }} />}
                                    onClick={() => setShowPostForm(v => !v)}
                                    sx={{
                                        borderRadius: 3, textTransform: 'none', fontWeight: 700,
                                        boxShadow: 'none', bgcolor: catColor,
                                        '&:hover': { bgcolor: catColor, filter: 'brightness(0.9)' },
                                        ...(showPostForm && { bgcolor: 'transparent', color: catColor, border: `1px solid ${catColor}` }),
                                    }}>
                                    {showPostForm ? 'Anulează' : 'Postare nouă'}
                                </Button>
                            )}
                        </Box>

                        {postSuccess && (
                            <Alert severity="success" icon={<NotificationsActive />} sx={{ mb: 2, borderRadius: 2 }}>
                                Postare publicată! Toți cei <strong>{club.membersCount ?? 0} membri</strong> au primit o notificare în timp real. 🎉
                            </Alert>
                        )}

                        {/* Post form — doar Admin */}
                        {showPostForm && isAdmin && (
                            <Box sx={{
                                p: 2.5, mb: 2.5, borderRadius: 3,
                                border: `1.5px solid ${catColor}30`,
                                bgcolor: `${catColor}04`,
                            }}>
                                <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="#0f172a">
                                    Scrie o postare pentru membrii clubului
                                </Typography>
                                <TextField multiline fullWidth minRows={4}
                                    placeholder={`Anunță ceva important pentru membrii "${club.name}"...`}
                                    value={postContent}
                                    onChange={e => setPostContent(e.target.value)}
                                    inputProps={{ maxLength: 1000 }}
                                    sx={{ mb: 1.5 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {postContent.length}/1000 caractere
                                    </Typography>
                                    <Button variant="contained" size="medium"
                                        disabled={postContent.trim().length < 10 || postSaving}
                                        onClick={handlePost}
                                        sx={{
                                            borderRadius: 3, textTransform: 'none', fontWeight: 700,
                                            bgcolor: catColor, boxShadow: 'none',
                                            '&:hover': { bgcolor: catColor, filter: 'brightness(0.9)' },
                                        }}>
                                        {postSaving
                                            ? <><CircularProgress size={14} color="inherit" sx={{ mr: 1 }} />Se publică...</>
                                            : '📢 Publică și notifică membrii'}
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* Posts list */}
                        {posts.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                                <Typography fontSize="2rem" mb={1}>📭</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {isAdmin ? 'Nicio postare. Scrie prima postare pentru membri!' : 'Nicio postare în acest club încă.'}
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                {posts.map(post => (
                                    <PostCard key={post.id} post={post} color={catColor} />
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* ── RIGHT COLUMN — sidebar ── */}
                <Box sx={{ width: 260, flexShrink: 0 }}>

                    {/* About card */}
                    <Box sx={{ borderRadius: 3, border: '1px solid #e8edf3', bgcolor: '#fff', mb: 2, overflow: 'hidden' }}>
                        <Box sx={{ bgcolor: catColor, px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" fontWeight={800} color="#fff">
                                {club.name}
                            </Typography>
                        </Box>
                        <Box sx={{ p: 0 }}>
                            {[
                                { label: 'Despre club', icon: '📋' },
                                { label: 'Membri', icon: '👥' },
                                { label: 'Evenimente club', icon: '📅' },
                            ].map(item => (
                                <Box key={item.label} sx={{
                                    px: 2, py: 1.25,
                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                    borderBottom: '1px solid #f0f4f8',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: `${catColor}06` },
                                    '&:last-child': { borderBottom: 'none' },
                                }}>
                                    <Typography fontSize="0.95rem">{item.icon}</Typography>
                                    <Typography variant="body2" fontWeight={600} color="#334155">
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Members card */}
                    <Box sx={{ borderRadius: 3, border: '1px solid #e8edf3', bgcolor: '#fff', mb: 2 }}>
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f4f8' }}>
                            <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                                👥 Membri recenți
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            {members.length === 0 ? (
                                <Typography variant="caption" color="text.secondary">Niciun membru disponibil.</Typography>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {members.slice(0, 8).map(m => (
                                        <Box key={m.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: catColor, fontSize: '0.7rem', fontWeight: 800 }}>
                                                {m.username.slice(0, 2).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" fontWeight={700} color="#334155" display="block">
                                                    {m.username}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" fontSize="0.62rem">
                                                    {new Date(m.joinedAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                    {members.length > 8 && (
                                        <Typography variant="caption" color={catColor} fontWeight={600} sx={{ cursor: 'pointer', mt: 0.5 }}>
                                            + {members.length - 8} alți membri →
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* Stats card */}
                    <Box sx={{ borderRadius: 3, border: '1px solid #e8edf3', bgcolor: '#fff' }}>
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f4f8' }}>
                            <Typography variant="subtitle2" fontWeight={800} color="#0f172a">📊 Statistici</Typography>
                        </Box>
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {[
                                { label: 'Total membri', value: club.membersCount ?? 0, emoji: '👥' },
                                { label: 'Postări', value: posts.length, emoji: '📝' },
                                { label: 'Rating', value: `${club.rating ?? 0} / 5`, emoji: '⭐' },
                            ].map(stat => (
                                <Box key={stat.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {stat.emoji} {stat.label}
                                    </Typography>
                                    <Typography variant="caption" fontWeight={800} color="#0f172a">
                                        {stat.value}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </DashboardLayout>
    );
};

export default ClubDetailPage;
