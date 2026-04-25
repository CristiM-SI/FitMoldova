import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import {
    Box, Typography, Button, Avatar, Chip, TextField, IconButton,
    Divider, Dialog, DialogContent, Tooltip, CircularProgress,
} from '@mui/material';
import {
    Favorite, FavoriteBorder, ChatBubbleOutline, Send, Close,
    PhotoCamera, FitnessCenter, PersonAdd, Check,
} from '@mui/icons-material';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ROUTES } from '../../routes/paths';
import { useDashboardData } from '../../context/useDashboardData';
import { useProgress } from '../../context/ProgressContext';
import { useAuth } from '../../context/AuthContext';
import postApi from '../../services/api/postApi';
import type { PostInfoDto, PostWithRepliesDto } from '../../services/api/postApi';
import { challengeApi } from '../../services/api/challengeApi';
import type { ChallengeDto } from '../../services/api/challengeApi';
import {
    SPORTS, SPORT_CHIPS, INITIAL_CHALLENGES, MEMBERS,
} from '../../services/mock/community';
import type { Sport, FeedTab, Post, Challenge, ToastState, Member } from '../../services/mock/community';

// ── THEME TOKENS ─────────────────────────────
const T = {
    bg:     '#050d1a',
    card:   '#0a1628',
    card2:  '#0d1f3a',
    blue:   '#1a6fff',
    cyan:   '#00c8ff',
    cdim:   'rgba(0,200,255,0.10)',
    bdim:   'rgba(26,111,255,0.12)',
    text:   '#e8f0fe',
    muted:  '#5a7aa0',
    border: 'rgba(0,200,255,0.12)',
    radius: '14px',
} as const;

// ── HELPERS ───────────────────────────────────
const getInitials = (name: string): string =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

function stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const colors = ['#1a6fff', '#00b4d8', '#7209b7', '#f72585', '#06d6a0', '#ff9100', '#4361ee', '#e63946'];
    return colors[Math.abs(hash) % colors.length];
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'acum câteva secunde';
    if (m < 60) return `acum ${m} ${m === 1 ? 'minut' : 'minute'}`;
    const h = Math.floor(m / 60);
    if (h < 24) return `acum ${h} ${h === 1 ? 'oră' : 'ore'}`;
    const d = Math.floor(h / 24);
    return `acum ${d} ${d === 1 ? 'zi' : 'zile'}`;
}

function dtoToPost(dto: PostInfoDto): Post {
    const name = dto.authorName || `Utilizator #${dto.userId}`;
    return {
        id: dto.id,
        author: name,
        color: stringToColor(name),
        sport: (dto.sport as Sport) || 'Fotbal',
        time: timeAgo(dto.createdAt),
        content: dto.content,
        likes: dto.likes,
        comments: dto.commentsCount,
        liked: false,
    };
}

function challengeDtoToChallenge(dto: ChallengeDto): Challenge {
    const match = dto.duration.match(/\d+/);
    const days = match ? parseInt(match[0]) : 30;
    return {
        id: dto.id,
        sport: '🏆',
        title: dto.name,
        desc: dto.description,
        participants: dto.participants,
        days,
        progress: 0,
        joined: false,
    };
}

// ── CIRCLE PROGRESS ──────────────────────────
function CircleProgress({ pct, uid }: { pct: number; uid: string }) {
    const r = 28, circ = 2 * Math.PI * r;
    return (
        <Box sx={{ position: 'relative', width: 70, height: 70, flexShrink: 0 }}>
            <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle cx="35" cy="35" r={r} fill="none" stroke={`url(#g-${uid})`} strokeWidth="6"
                        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
                        strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease' }} />
                <defs>
                    <linearGradient id={`g-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={T.blue} />
                        <stop offset="100%" stopColor={T.cyan} />
                    </linearGradient>
                </defs>
            </svg>
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 900, color: T.cyan }}>{pct}%</Typography>
            </Box>
        </Box>
    );
}

// ── CARD WRAPPER ─────────────────────────────
function DarkCard({ children, sx = {} }: { children: React.ReactNode; sx?: object }) {
    return (
        <Box sx={{
            bgcolor: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius,
            p: 2.5, transition: 'border-color .2s',
            '&:hover': { borderColor: 'rgba(0,200,255,0.22)' },
            ...sx,
        }}>
            {children}
        </Box>
    );
}

// ── NAV BUTTON ───────────────────────────────
function NavBtn({ icon, label, active, badge, onClick }: {
    icon: string; label: string; active: boolean;
    badge?: { type: string; text: string }; onClick: () => void;
}) {
    return (
        <Box component="button" onClick={onClick} sx={{
            display: 'flex', alignItems: 'center', gap: 1.25, width: '100%',
            px: 1.75, py: 1.25, borderRadius: '10px', border: `1px solid ${active ? 'rgba(26,111,255,.2)' : 'transparent'}`,
            bgcolor: active ? T.bdim : 'transparent', color: active ? T.cyan : T.muted,
            fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
            transition: 'all .2s', textAlign: 'left',
            '&:hover': { bgcolor: T.cdim, color: '#fff' },
        }}>
            <span style={{ fontSize: '1.1rem', width: 22, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
            {label}
            {badge && (
                <Box sx={{
                    ml: 'auto', borderRadius: '100px', px: 1, py: 0.25,
                    fontSize: '0.62rem', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                    bgcolor: badge.type === 'hot' ? 'rgba(255,145,0,.14)' : T.cdim,
                    color: badge.type === 'hot' ? '#ff9100' : T.cyan,
                }}>
                    {badge.text}
                </Box>
            )}
        </Box>
    );
}

// ── MAIN COMPONENT ───────────────────────────
export default function CommunityPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const userName = user ? `${user.firstName} ${user.lastName}` : 'Oaspete';
    const userTag  = user ? `@${user.email.split('@')[0]}` : '';

    const [tab,            setTab]            = useState<FeedTab>('feed');
    const [filter,         setFilter]         = useState<Sport | 'all'>('all');
    const [posts,          setPosts]          = useState<Post[]>([]);
    const [postsLoading,   setPostsLoading]   = useState(true);
    const [challenges,     setChallenges]     = useState<Challenge[]>([]);
    const [challengesLoading, setChallengesLoading] = useState(true);
    const [postInput,      setPostInput]      = useState('');
    const [postSport,      setPostSport]      = useState<Sport>('Fotbal');
    const [toast,          setToast]          = useState<ToastState>({ icon: '', msg: '', visible: false });
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [following,      setFollowing]      = useState<Set<string>>(new Set());

    // Comments dialog state
    const [commentsPostId,  setCommentsPostId]  = useState<number | null>(null);
    const [commentsData,    setCommentsData]    = useState<PostWithRepliesDto | null>(null);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [replyInput,      setReplyInput]      = useState('');

    const { addProvocare, removeProvocare } = useDashboardData();
    const { completeChallenge }             = useProgress();

    // ── LOAD POSTS FROM API ───────────────────
    useEffect(() => {
        setPostsLoading(true);
        postApi.getAll()
            .then((data) => setPosts(data.map(dtoToPost)))
            .catch(() => setPosts([]))
            .finally(() => setPostsLoading(false));
    }, []);

    // ── LOAD CHALLENGES FROM API ──────────────
    useEffect(() => {
        setChallengesLoading(true);
        challengeApi.getAll()
            .then((data) => setChallenges(data.map(challengeDtoToChallenge)))
            .catch(() => setChallenges(INITIAL_CHALLENGES))
            .finally(() => setChallengesLoading(false));
    }, []);

    // ── LOAD COMMENTS WHEN DIALOG OPENS ──────
    useEffect(() => {
        if (commentsPostId === null) { setCommentsData(null); return; }
        setCommentsLoading(true);
        postApi.getById(commentsPostId)
            .then(setCommentsData)
            .catch(() => setCommentsData(null))
            .finally(() => setCommentsLoading(false));
    }, [commentsPostId]);

    const showToast = useCallback((icon: string, msg: string) => {
        setToast({ icon, msg, visible: true });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    }, []);

    // ── PUBLISH POST ─────────────────────────
    const handlePublish = useCallback(async () => {
        if (!isAuthenticated || !user) { navigate({ to: ROUTES.LOGIN }); return; }
        if (!postInput.trim()) { showToast('⚠️', 'Scrie ceva înainte de a publica!'); return; }
        try {
            const newId = await postApi.create({ userId: user.id, content: postInput.trim(), sport: postSport });
            const newPost: Post = {
                id: newId,
                author: userName,
                color: stringToColor(userName),
                sport: postSport,
                time: 'acum câteva secunde',
                content: postInput.trim(),
                likes: 0,
                comments: 0,
                liked: false,
            };
            setPosts((prev) => [newPost, ...prev]);
            setPostInput('');
            showToast('✅', 'Postare publicată!');
        } catch {
            showToast('❌', 'Eroare la publicare. Încearcă din nou.');
        }
    }, [postInput, postSport, showToast, user, userName, isAuthenticated, navigate]);

    // ── LIKE POST ────────────────────────────
    const handleLike = useCallback((id: number) => {
        if (!isAuthenticated || !user) { navigate({ to: ROUTES.LOGIN }); return; }
        // Optimistic toggle
        setPosts((prev) => prev.map((p) =>
            p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
        postApi.like(id)
            .then((newCount) => {
                setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: newCount } : p));
            })
            .catch(() => {
                // Revert on error
                setPosts((prev) => prev.map((p) =>
                    p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
            });
    }, [isAuthenticated, user, navigate]);

    // ── JOIN / LEAVE CHALLENGE ───────────────
    const handleJoin = useCallback((id: number) => {
        if (!isAuthenticated || !user) { navigate({ to: ROUTES.LOGIN }); return; }
        const challenge = challenges.find((c) => c.id === id);
        if (!challenge) return;
        const joining = !challenge.joined;

        setChallenges((prev) => prev.map((c) =>
            c.id !== id ? c : { ...c, joined: joining, participants: joining ? c.participants + 1 : c.participants - 1 }));

        showToast(joining ? '🏆' : '👋', joining ? 'Te-ai alăturat provocării!' : 'Ai ieșit din provocare.');

        if (joining) {
            const difficulty = challenge.days <= 7 ? 'Ușor' : challenge.days <= 30 ? 'Mediu' : 'Greu';
            addProvocare({
                id: 10000 + id, name: challenge.title, description: challenge.desc,
                participants: challenge.participants + 1,
                duration: `${challenge.days} zile`,
                difficulty: difficulty as 'Ușor' | 'Mediu' | 'Greu',
                progress: 0,
            });
            completeChallenge();
            challengeApi.joinChallenge(id).catch(() => {
                setChallenges((prev) => prev.map((c) =>
                    c.id !== id ? c : { ...c, joined: false, participants: c.participants - 1 }));
                removeProvocare(10000 + id);
                showToast('❌', 'Eroare la server. Încearcă din nou.');
            });
        } else {
            removeProvocare(10000 + id);
            challengeApi.leaveChallenge(id).catch(() => {
                setChallenges((prev) => prev.map((c) =>
                    c.id !== id ? c : { ...c, joined: true, participants: c.participants + 1 }));
                showToast('❌', 'Eroare la server. Încearcă din nou.');
            });
        }
    }, [isAuthenticated, user, navigate, challenges, showToast, addProvocare, removeProvocare, completeChallenge]);

    // ── FOLLOW / UNFOLLOW MEMBER ─────────────
    const handleFollow = useCallback((member: Member) => {
        const isFollowing = following.has(member.name);
        setFollowing((prev) => {
            const next = new Set(prev);
            if (isFollowing) next.delete(member.name); else next.add(member.name);
            return next;
        });
        showToast(isFollowing ? '👋' : '👤',
            isFollowing ? `Ai încetat să urmărești pe ${member.name}` : `Urmărești acum pe ${member.name}!`);
    }, [following, showToast]);

    // ── ADD REPLY ────────────────────────────
    const handleAddReply = useCallback(async () => {
        if (!isAuthenticated || !user || commentsPostId === null) return;
        if (!replyInput.trim()) return;
        try {
            await postApi.addReply({ postId: commentsPostId, userId: user.id, content: replyInput.trim() });
            setReplyInput('');
            const updated = await postApi.getById(commentsPostId);
            setCommentsData(updated);
            setPosts((prev) => prev.map((p) =>
                p.id === commentsPostId ? { ...p, comments: p.comments + 1 } : p));
        } catch {
            showToast('❌', 'Eroare la trimiterea comentariului.');
        }
    }, [isAuthenticated, user, commentsPostId, replyInput, showToast]);

    const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.sport === filter);

    const NAV_ITEMS = [
        { id: 'feed' as FeedTab,       icon: '📰', label: 'Feed',      onClick: () => setTab('feed') },
        { id: 'challenges' as FeedTab, icon: '🏆', label: 'Provocări', onClick: () => setTab('challenges'), badge: { type: 'hot', text: 'Live' } },
        { id: 'members' as FeedTab,    icon: '👥', label: 'Membri',    onClick: () => setTab('members') },
    ];

    // ── RENDER ───────────────────────────────
    return (
        <>
            <Navbar />

            <Box sx={{
                bgcolor: T.bg, color: T.text, minHeight: '100vh',
                fontFamily: "'Barlow', sans-serif",
                position: 'relative',
                paddingTop: '72px',
                '&::before': {
                    content: '""', position: 'fixed', inset: 0,
                    backgroundImage: `linear-gradient(rgba(0,200,255,0.025) 1px,transparent 1px),
                                      linear-gradient(90deg,rgba(0,200,255,0.025) 1px,transparent 1px)`,
                    backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0,
                },
            }}>
                <Box sx={{
                    position: 'relative', zIndex: 1,
                    maxWidth: 1340, mx: 'auto', px: { xs: 2, sm: 3.5 }, py: 3.5,
                    display: 'flex', gap: 3,
                }}>

                    {/* ── LEFT SIDEBAR ── */}
                    <Box component="aside" sx={{ width: 220, flexShrink: 0, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 0.75 }}>

                        <Box onClick={() => navigate({ to: ROUTES.PROFILE })} sx={{
                            display: 'flex', alignItems: 'center', gap: 1.25,
                            p: '12px 14px', bgcolor: T.card2, borderRadius: '10px',
                            border: `1px solid ${T.border}`, mb: 0.75, cursor: 'pointer',
                            transition: 'border-color .2s',
                            '&:hover': { borderColor: 'rgba(0,200,255,.25)' },
                        }}>
                            <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg,${T.blue},${T.cyan})`, fontSize: '0.85rem', fontWeight: 900, flexShrink: 0 }}>
                                {getInitials(userName)}
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: T.text }}>{userName}</Typography>
                                <Typography sx={{ fontSize: '0.72rem', color: T.muted }}>{userTag}</Typography>
                            </Box>
                        </Box>

                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: T.muted, px: 1.5, pb: 0.75 }}>
                            Comunitate
                        </Typography>

                        {NAV_ITEMS.map((item) => (
                            <NavBtn key={item.id} icon={item.icon} label={item.label}
                                    active={tab === item.id} badge={item.badge} onClick={item.onClick} />
                        ))}

                        <NavBtn icon="💬" label="Forum" active={false} onClick={() => navigate({ to: ROUTES.FORUM })} />
                        <NavBtn icon="🏟️" label="Cluburi" active={false} onClick={() => navigate({ to: ROUTES.CLUBS })} />

                        {isAuthenticated ? (
                            <Link to={ROUTES.DASHBOARD} style={{ textDecoration: 'none' }}>
                                <NavBtn icon="◀" label="Dashboard" active={false} onClick={() => {}} />
                            </Link>
                        ) : (
                            <Link to={ROUTES.HOME} style={{ textDecoration: 'none' }}>
                                <NavBtn icon="◀" label="Acasă" active={false} onClick={() => {}} />
                            </Link>
                        )}
                    </Box>

                    {/* ── MOBILE TAB BAR ── */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0.75, overflowX: 'auto', pb: 0.5, mb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
                        {NAV_ITEMS.map((item) => (
                            <Box component="button" key={item.id} onClick={item.onClick}
                                 sx={{
                                     display: 'flex', alignItems: 'center', gap: 0.75,
                                     px: 2, py: 1, borderRadius: '10px', whiteSpace: 'nowrap',
                                     border: `1px solid ${tab === item.id ? 'rgba(26,111,255,.3)' : T.border}`,
                                     bgcolor: tab === item.id ? T.bdim : T.card,
                                     color: tab === item.id ? T.cyan : T.muted,
                                     fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600,
                                     cursor: 'pointer', transition: 'all .2s', flexShrink: 0,
                                     '&:hover': { bgcolor: T.cdim, color: '#fff' },
                                 }}>
                                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                                {item.label}
                                {item.badge && (
                                    <Box component="span" sx={{ borderRadius: '100px', px: 0.75, py: 0.15, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'rgba(255,145,0,.14)', color: '#ff9100' }}>
                                        {item.badge.text}
                                    </Box>
                                )}
                            </Box>
                        ))}
                        <Box component="button" onClick={() => navigate({ to: ROUTES.FORUM })}
                             sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 2, py: 1, borderRadius: '10px', whiteSpace: 'nowrap', border: `1px solid ${T.border}`, bgcolor: T.card, color: T.muted, fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s', flexShrink: 0, '&:hover': { bgcolor: T.cdim, color: '#fff' } }}>
                            <span style={{ fontSize: '1rem' }}>💬</span> Forum
                        </Box>
                        <Box component="button" onClick={() => navigate({ to: ROUTES.CLUBS })}
                             sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 2, py: 1, borderRadius: '10px', whiteSpace: 'nowrap', border: `1px solid ${T.border}`, bgcolor: T.card, color: T.muted, fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s', flexShrink: 0, '&:hover': { bgcolor: T.cdim, color: '#fff' } }}>
                            <span style={{ fontSize: '1rem' }}>🏟️</span> Cluburi
                        </Box>
                    </Box>

                    {/* ── CENTER CONTENT ── */}
                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2.25 }}>

                        {/* ════ FEED ════ */}
                        {tab === 'feed' && (
                            <>
                                {/* Create Post */}
                                {isAuthenticated ? (
                                    <DarkCard>
                                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                                            <Avatar sx={{ width: 42, height: 42, background: `linear-gradient(135deg,${T.blue},${T.cyan})`, fontSize: '0.9rem', fontWeight: 900, flexShrink: 0 }}>
                                                {getInitials(userName)}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <TextField
                                                    multiline minRows={2} fullWidth
                                                    placeholder="Distribuie antrenamentul tău, un sfat sau o realizare…"
                                                    value={postInput}
                                                    onChange={(e) => setPostInput(e.target.value)}
                                                    sx={{
                                                        mb: 1.25,
                                                        '& .MuiOutlinedInput-root': {
                                                            bgcolor: T.bg, borderRadius: '10px', color: T.text,
                                                            '& fieldset': { borderColor: T.border },
                                                            '&:hover fieldset': { borderColor: 'rgba(0,200,255,.3)' },
                                                            '&.Mui-focused fieldset': { borderColor: 'rgba(0,200,255,.5)' },
                                                        },
                                                        '& .MuiInputBase-input::placeholder': { color: T.muted, opacity: 1 },
                                                    }}
                                                />
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <Box
                                                        component="select"
                                                        value={postSport}
                                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPostSport(e.target.value as Sport)}
                                                        sx={{
                                                            bgcolor: T.bg, border: `1px solid ${T.border}`, color: T.muted,
                                                            borderRadius: '7px', px: 1.25, py: 0.75, fontSize: '0.78rem',
                                                            outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
                                                            '&:focus': { borderColor: 'rgba(0,200,255,.4)', color: T.text },
                                                        }}
                                                    >
                                                        {SPORTS.map((s) => <option key={s}>{s}</option>)}
                                                    </Box>
                                                    <Tooltip title="Adaugă foto">
                                                        <IconButton size="small" onClick={() => setPostInput((v) => v + ' 📸')}
                                                                    sx={{ color: T.muted, border: `1px solid ${T.border}`, borderRadius: '7px', p: '5px 10px', '&:hover': { borderColor: T.cyan, color: T.cyan } }}>
                                                            <PhotoCamera sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Adaugă workout">
                                                        <IconButton size="small" onClick={() => setPostInput((v) => v + ' 💪')}
                                                                    sx={{ color: T.muted, border: `1px solid ${T.border}`, borderRadius: '7px', p: '5px 10px', '&:hover': { borderColor: T.cyan, color: T.cyan } }}>
                                                            <FitnessCenter sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Button variant="contained" size="small" endIcon={<Send sx={{ fontSize: 14 }} />}
                                                            onClick={handlePublish} disabled={!postInput.trim()}
                                                            sx={{ ml: 'auto', bgcolor: T.blue, borderRadius: '8px', fontWeight: 700, boxShadow: 'none', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.8rem', '&:hover': { bgcolor: '#2a7fff', boxShadow: '0 0 20px rgba(26,111,255,.5)' } }}>
                                                        Publică
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </DarkCard>
                                ) : (
                                    <DarkCard sx={{ textAlign: 'center', py: 5 }}>
                                        <Typography sx={{ fontSize: '2.5rem', mb: 1.5, opacity: 0.4 }}>✍️</Typography>
                                        <Typography sx={{ color: T.muted, mb: 2 }}>Autentifică-te pentru a publica postări</Typography>
                                        <Button variant="outlined" onClick={() => navigate({ to: ROUTES.LOGIN })}
                                                sx={{ borderColor: T.cyan, color: T.cyan, borderRadius: '8px', '&:hover': { bgcolor: T.cdim } }}>
                                            → Autentifică-te
                                        </Button>
                                    </DarkCard>
                                )}

                                {/* Sport filter chips */}
                                <DarkCard sx={{ py: 1.5 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.875 }}>
                                        {SPORT_CHIPS.map((c) => (
                                            <Box component="button" key={c.value} onClick={() => setFilter(c.value)}
                                                 sx={{
                                                     px: 1.5, py: 0.625, borderRadius: '100px', cursor: 'pointer',
                                                     border: `1px solid ${filter === c.value ? T.cyan : T.border}`,
                                                     bgcolor: filter === c.value ? T.cyan : 'transparent',
                                                     color: filter === c.value ? T.bg : T.muted,
                                                     fontSize: '0.74rem', fontWeight: 600, whiteSpace: 'nowrap',
                                                     fontFamily: 'inherit', transition: 'all .15s',
                                                     '&:hover': { borderColor: T.cyan, color: filter === c.value ? T.bg : T.cyan },
                                                 }}>
                                                {c.emoji} {c.label}
                                            </Box>
                                        ))}
                                    </Box>
                                </DarkCard>

                                {/* Posts */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                                    {postsLoading ? (
                                        <DarkCard sx={{ textAlign: 'center', py: 6 }}>
                                            <CircularProgress size={32} sx={{ color: T.cyan }} />
                                            <Typography sx={{ color: T.muted, mt: 2, fontSize: '0.85rem' }}>Se încarcă postările…</Typography>
                                        </DarkCard>
                                    ) : filteredPosts.length === 0 ? (
                                        <DarkCard sx={{ textAlign: 'center', py: 8 }}>
                                            <Typography sx={{ fontSize: '2.8rem', mb: 1.75, opacity: 0.4 }}>📭</Typography>
                                            <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff', mb: 0.75 }}>Nicio postare încă</Typography>
                                            <Typography sx={{ color: T.muted, fontSize: '0.85rem' }}>Fii primul care distribuie ceva cu comunitatea!</Typography>
                                        </DarkCard>
                                    ) : (
                                        filteredPosts.map((p) => (
                                            <DarkCard key={p.id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                                                    <Avatar sx={{ width: 42, height: 42, bgcolor: p.color, fontSize: '0.9rem', fontWeight: 900, flexShrink: 0 }}>
                                                        {getInitials(p.author)}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: T.text }}>{p.author}</Typography>
                                                        <Typography sx={{ fontSize: '0.72rem', color: T.muted }}>{p.time}</Typography>
                                                    </Box>
                                                    <Chip label={p.sport} size="small" sx={{ bgcolor: T.cdim, color: T.cyan, border: `1px solid rgba(0,200,255,.2)`, fontSize: '0.7rem', fontWeight: 600, height: 22 }} />
                                                </Box>
                                                <Typography sx={{ fontSize: '0.875rem', color: '#c8d8f0', lineHeight: 1.65, mb: 1.75 }}>
                                                    {p.content}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.5, borderTop: `1px solid ${T.border}`, pt: 1.5 }}>
                                                    <Box component="button" onClick={() => handleLike(p.id)}
                                                         sx={{ display: 'flex', alignItems: 'center', gap: 0.625, bgcolor: 'transparent', border: 'none', color: p.liked ? '#ff4d6d' : T.muted, cursor: 'pointer', fontSize: '0.79rem', fontWeight: 600, px: 1.375, py: 0.625, borderRadius: '7px', fontFamily: 'inherit', transition: 'all .2s', '&:hover': { bgcolor: p.liked ? 'rgba(255,77,109,.1)' : T.cdim, color: p.liked ? '#ff4d6d' : T.cyan } }}>
                                                        {p.liked ? <Favorite sx={{ fontSize: 15 }} /> : <FavoriteBorder sx={{ fontSize: 15 }} />}
                                                        {p.likes}
                                                    </Box>
                                                    <Box component="button" onClick={() => setCommentsPostId(p.id)}
                                                         sx={{ display: 'flex', alignItems: 'center', gap: 0.625, bgcolor: 'transparent', border: 'none', color: T.muted, cursor: 'pointer', fontSize: '0.79rem', fontWeight: 600, px: 1.375, py: 0.625, borderRadius: '7px', fontFamily: 'inherit', transition: 'all .2s', '&:hover': { bgcolor: T.cdim, color: T.cyan } }}>
                                                        <ChatBubbleOutline sx={{ fontSize: 15 }} />
                                                        {p.comments}
                                                    </Box>
                                                </Box>
                                            </DarkCard>
                                        ))
                                    )}
                                </Box>
                            </>
                        )}

                        {/* ════ PROVOCĂRI ════ */}
                        {tab === 'challenges' && (
                            <DarkCard>
                                <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.5px', color: '#fff', mb: 0.5 }}>
                                    Provocări Active 🔥
                                </Typography>
                                <Typography sx={{ fontSize: '0.84rem', color: T.muted, mb: 2.5 }}>
                                    Alătură-te și câștigă puncte în clasament
                                </Typography>

                                {challengesLoading ? (
                                    <Box sx={{ textAlign: 'center', py: 5 }}>
                                        <CircularProgress size={32} sx={{ color: T.cyan }} />
                                        <Typography sx={{ color: T.muted, mt: 2, fontSize: '0.85rem' }}>Se încarcă provocările…</Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                        {challenges.map((c, i) => (
                                            <Box key={c.id}>
                                                {i > 0 && <Divider sx={{ borderColor: T.border, my: 0.25 }} />}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                                                    <CircleProgress pct={c.progress} uid={String(c.id)} />
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: T.text, mb: 0.25 }}>
                                                            {c.title}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.8rem', color: T.muted, mb: 0.75, lineHeight: 1.5 }}>{c.desc}</Typography>
                                                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                                            <Typography sx={{ fontSize: '0.75rem', color: T.muted }}>
                                                                👥 {c.participants.toLocaleString()} participanți
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '0.75rem', color: T.muted }}>
                                                                ⏱ {c.days} zile rămase
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                                            <Box sx={{ height: '100%', borderRadius: 2, width: `${c.progress}%`, background: `linear-gradient(90deg, ${T.blue}, ${T.cyan})`, transition: 'width .5s ease' }} />
                                                        </Box>
                                                    </Box>
                                                    <Box component="button" onClick={() => handleJoin(c.id)}
                                                         sx={{
                                                             px: 2, py: 0.875, borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
                                                             fontSize: '0.78rem', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                                                             flexShrink: 0, transition: 'all .2s',
                                                             ...(c.joined
                                                                 ? { border: `1px solid rgba(255,77,109,.4)`, bgcolor: 'transparent', color: '#ff4d6d', '&:hover': { bgcolor: 'rgba(255,77,109,.1)', borderColor: '#ff4d6d' } }
                                                                 : { border: `1.5px solid ${T.cyan}`, bgcolor: 'transparent', color: T.cyan, '&:hover': { bgcolor: T.cdim } }),
                                                         }}>
                                                        {c.joined ? 'Părăsește' : 'Alătură-te'}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </DarkCard>
                        )}

                        {/* ════ MEMBRI ════ */}
                        {tab === 'members' && (
                            <DarkCard>
                                <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.5px', color: '#fff', mb: 0.5 }}>
                                    Membri Comunitate 👥
                                </Typography>
                                <Typography sx={{ fontSize: '0.84rem', color: T.muted, mb: 2.5 }}>
                                    Sportivi activi din Moldova
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    {MEMBERS.map((m, i) => (
                                        <Box key={m.name}>
                                            {i > 0 && <Divider sx={{ borderColor: T.border, my: 0.25 }} />}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.75 }}>
                                                <Avatar onClick={() => setSelectedMember(m)}
                                                        sx={{ width: 44, height: 44, bgcolor: m.color, fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', flexShrink: 0, boxShadow: `0 0 12px ${m.color}55`, transition: 'transform .2s', '&:hover': { transform: 'scale(1.08)' } }}>
                                                    {getInitials(m.name)}
                                                </Avatar>
                                                <Box sx={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setSelectedMember(m)}>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: T.text }}>{m.name}</Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.25, flexWrap: 'wrap' }}>
                                                        <Chip label={m.rank} size="small" sx={{ bgcolor: T.cdim, color: T.cyan, border: `1px solid rgba(0,200,255,.2)`, height: 18, fontSize: '0.62rem', fontWeight: 700 }} />
                                                        <Typography sx={{ fontSize: '0.72rem', color: T.muted }}>📍 {m.city}</Typography>
                                                        <Typography sx={{ fontSize: '0.72rem', color: T.muted }}>{m.sport}</Typography>
                                                        <Typography sx={{ fontSize: '0.72rem', color: T.blue, fontWeight: 700 }}>{m.points.toLocaleString()} pts</Typography>
                                                    </Box>
                                                </Box>
                                                <Box component="button" onClick={() => handleFollow(m)}
                                                     sx={{
                                                         px: 1.75, py: 0.75, borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
                                                         fontSize: '0.78rem', fontWeight: 700, letterSpacing: 0.5, flexShrink: 0, transition: 'all .2s',
                                                         display: 'flex', alignItems: 'center', gap: 0.75,
                                                         ...(following.has(m.name)
                                                             ? { border: `1px solid rgba(255,77,109,.4)`, bgcolor: T.cdim, color: '#c8d8f0', '&:hover': { bgcolor: 'rgba(255,77,109,.1)', borderColor: '#ff4d6d', color: '#ff4d6d' } }
                                                             : { border: `1.5px solid ${T.cyan}`, bgcolor: 'transparent', color: T.cyan, '&:hover': { bgcolor: T.cdim } }),
                                                     }}>
                                                    {following.has(m.name)
                                                        ? <><Check sx={{ fontSize: 14 }} /> Urmărești</>
                                                        : <><PersonAdd sx={{ fontSize: 14 }} /> Urmărește</>
                                                    }
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </DarkCard>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* ── MEMBER PROFILE DIALOG ── */}
            <Dialog open={!!selectedMember} onClose={() => setSelectedMember(null)} maxWidth="xs" fullWidth
                    slotProps={{ paper: { sx: { bgcolor: T.card, border: `1px solid ${T.border}`, borderRadius: 3, color: T.text, overflow: 'hidden' } } }}>
                {selectedMember && (
                    <>
                        <IconButton onClick={() => setSelectedMember(null)} size="small"
                                    sx={{ position: 'absolute', top: 10, right: 10, color: T.muted, zIndex: 1, bgcolor: 'rgba(0,0,0,.3)', '&:hover': { color: '#fff' } }}>
                            <Close fontSize="small" />
                        </IconButton>
                        <Box sx={{ textAlign: 'center', px: 3, pt: 4.5, pb: 2.5, borderBottom: `1px solid ${T.border}` }}>
                            <Avatar sx={{ width: 82, height: 82, bgcolor: selectedMember.color, fontSize: '1.9rem', fontWeight: 900, mx: 'auto', mb: 1.75, boxShadow: `0 0 24px ${selectedMember.color}66` }}>
                                {getInitials(selectedMember.name)}
                            </Avatar>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.5px', color: '#fff' }}>
                                {selectedMember.name}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 0.5, mb: 1.25, flexWrap: 'wrap' }}>
                                <Chip label={selectedMember.rank} size="small" sx={{ bgcolor: T.cdim, color: T.cyan, border: `1px solid rgba(0,200,255,.2)`, fontSize: '0.72rem', fontWeight: 700 }} />
                                <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>📍 {selectedMember.city}</Typography>
                                <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>{selectedMember.sport}</Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: T.cyan, mb: 1.75 }}>
                                {selectedMember.points.toLocaleString()} pts
                            </Typography>
                        </Box>
                        <DialogContent sx={{ p: 0 }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: `1px solid ${T.border}`, py: 2.25 }}>
                                {[
                                    { val: selectedMember.activities, lbl: 'Activități' },
                                    { val: selectedMember.daysActive, lbl: 'Zile Active' },
                                    { val: selectedMember.challenges, lbl: 'Provocări' },
                                    { val: selectedMember.achievements.length, lbl: 'Realizări' },
                                ].map((s) => (
                                    <Box key={s.lbl} sx={{ textAlign: 'center' }}>
                                        <Typography sx={{ fontWeight: 900, fontSize: '1.3rem', color: T.cyan }}>{s.val}</Typography>
                                        <Typography sx={{ fontSize: '0.62rem', color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.25 }}>{s.lbl}</Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Box sx={{ px: 2.75, py: 2, borderBottom: `1px solid ${T.border}` }}>
                                <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#c8d8f0' }}>{selectedMember.bio}</Typography>
                            </Box>
                            <Box sx={{ px: 2.75, py: 2, borderBottom: `1px solid ${T.border}` }}>
                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: T.muted, mb: 1.25 }}>
                                    🏅 Realizări
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {selectedMember.achievements.map((a, i) => (
                                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '10px 14px', borderRadius: '10px', bgcolor: T.card2, border: `1px solid ${T.border}` }}>
                                            <Typography sx={{ fontSize: '1.35rem', flexShrink: 0 }}>{a.icon}</Typography>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: T.text }}>{a.title}</Typography>
                                                <Typography sx={{ fontSize: '0.7rem', color: T.muted, mt: '1px' }}>{a.date}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            <Box sx={{ px: 2.75, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '0.75rem', color: T.muted }}>Membru din {selectedMember.joinedDate}</Typography>
                                <Box component="button" onClick={() => handleFollow(selectedMember)}
                                     sx={{
                                         px: 2, py: 0.875, borderRadius: '9px', cursor: 'pointer', fontFamily: 'inherit',
                                         fontSize: '0.84rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', transition: 'all .2s',
                                         display: 'flex', alignItems: 'center', gap: 0.75,
                                         ...(following.has(selectedMember.name)
                                             ? { border: `1px solid rgba(0,200,255,.4)`, bgcolor: T.cdim, color: '#c8d8f0', '&:hover': { bgcolor: 'rgba(255,77,109,.1)', borderColor: '#ff4d6d', color: '#ff4d6d' } }
                                             : { border: `1.5px solid ${T.cyan}`, bgcolor: 'transparent', color: T.cyan, '&:hover': { bgcolor: T.cdim } }),
                                     }}>
                                    {following.has(selectedMember.name)
                                        ? <><Check sx={{ fontSize: 15 }} /> Urmărești ✓</>
                                        : <><PersonAdd sx={{ fontSize: 15 }} /> Urmărește</>
                                    }
                                </Box>
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>

            {/* ── COMMENTS DIALOG ── */}
            <Dialog open={commentsPostId !== null} onClose={() => { setCommentsPostId(null); setReplyInput(''); }}
                    maxWidth="sm" fullWidth
                    slotProps={{ paper: { sx: { bgcolor: T.card, border: `1px solid ${T.border}`, borderRadius: 3, color: T.text } } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.75, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                        💬 Comentarii
                    </Typography>
                    <IconButton onClick={() => { setCommentsPostId(null); setReplyInput(''); }} size="small"
                                sx={{ color: T.muted, '&:hover': { color: '#fff' } }}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>

                <DialogContent sx={{ p: 0, maxHeight: '60vh', overflowY: 'auto' }}>
                    {commentsLoading ? (
                        <Box sx={{ textAlign: 'center', py: 5 }}>
                            <CircularProgress size={28} sx={{ color: T.cyan }} />
                        </Box>
                    ) : !commentsData ? (
                        <Box sx={{ textAlign: 'center', py: 5 }}>
                            <Typography sx={{ color: T.muted, fontSize: '0.85rem' }}>Nu s-au putut încărca comentariile.</Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Original post */}
                            <Box sx={{ px: 2.5, py: 2, bgcolor: T.card2, borderBottom: `1px solid ${T.border}` }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                                    <Avatar sx={{ width: 34, height: 34, bgcolor: stringToColor(commentsData.authorName || ''), fontSize: '0.8rem', fontWeight: 900 }}>
                                        {getInitials(commentsData.authorName || `U${commentsData.userId}`)}
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: T.text }}>
                                            {commentsData.authorName || `Utilizator #${commentsData.userId}`}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: T.muted }}>{timeAgo(commentsData.createdAt)}</Typography>
                                    </Box>
                                </Box>
                                <Typography sx={{ fontSize: '0.875rem', color: '#c8d8f0', lineHeight: 1.6 }}>
                                    {commentsData.content}
                                </Typography>
                            </Box>

                            {/* Replies */}
                            {(commentsData.replies ?? []).length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography sx={{ fontSize: '1.8rem', opacity: 0.3, mb: 1 }}>💬</Typography>
                                    <Typography sx={{ color: T.muted, fontSize: '0.82rem' }}>Niciun comentariu încă. Fii primul!</Typography>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {(commentsData.replies ?? []).map((reply, i) => (
                                        <Box key={reply.id}>
                                            {i > 0 && <Divider sx={{ borderColor: T.border }} />}
                                            <Box sx={{ px: 2.5, py: 1.75 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.75 }}>
                                                    <Avatar sx={{ width: 30, height: 30, bgcolor: stringToColor(reply.authorName || ''), fontSize: '0.72rem', fontWeight: 900 }}>
                                                        {getInitials(reply.authorName || `U${reply.userId}`)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: T.text }}>
                                                            {reply.authorName || `Utilizator #${reply.userId}`}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.68rem', color: T.muted }}>{timeAgo(reply.createdAt)}</Typography>
                                                    </Box>
                                                </Box>
                                                <Typography sx={{ fontSize: '0.84rem', color: '#c8d8f0', lineHeight: 1.6, pl: '42px' }}>
                                                    {reply.content}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </>
                    )}
                </DialogContent>

                {/* Reply input */}
                <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${T.border}` }}>
                    {isAuthenticated ? (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                            <Avatar sx={{ width: 32, height: 32, background: `linear-gradient(135deg,${T.blue},${T.cyan})`, fontSize: '0.75rem', fontWeight: 900, flexShrink: 0, mb: 0.25 }}>
                                {getInitials(userName)}
                            </Avatar>
                            <TextField
                                fullWidth size="small"
                                placeholder="Scrie un comentariu…"
                                value={replyInput}
                                onChange={(e) => setReplyInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddReply(); } }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: T.bg, borderRadius: '10px', color: T.text, fontSize: '0.85rem',
                                        '& fieldset': { borderColor: T.border },
                                        '&:hover fieldset': { borderColor: 'rgba(0,200,255,.3)' },
                                        '&.Mui-focused fieldset': { borderColor: 'rgba(0,200,255,.5)' },
                                    },
                                    '& .MuiInputBase-input::placeholder': { color: T.muted, opacity: 1 },
                                }}
                            />
                            <IconButton onClick={handleAddReply} disabled={!replyInput.trim()}
                                        sx={{ color: replyInput.trim() ? T.cyan : T.muted, transition: 'color .2s', flexShrink: 0 }}>
                                <Send sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Box>
                    ) : (
                        <Typography sx={{ color: T.muted, fontSize: '0.82rem', textAlign: 'center' }}>
                            <Box component="span" onClick={() => navigate({ to: ROUTES.LOGIN })}
                                 sx={{ color: T.cyan, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                Autentifică-te
                            </Box>{' '}pentru a comenta
                        </Typography>
                    )}
                </Box>
            </Dialog>

            {/* ── TOAST ── */}
            <Box sx={{
                position: 'fixed', bottom: 28, right: 28, zIndex: 300,
                bgcolor: '#0d1526', border: '1px solid rgba(26,127,255,0.3)',
                borderRadius: '12px', px: 2.25, py: 1.625,
                display: 'flex', alignItems: 'center', gap: 1.25,
                boxShadow: '0 8px 32px rgba(0,0,0,.5)', fontSize: '0.86rem',
                transform: toast.visible ? 'translateY(0)' : 'translateY(80px)',
                opacity: toast.visible ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                pointerEvents: 'none',
            }}>
                <Typography sx={{ fontSize: '1.2rem' }}>{toast.icon}</Typography>
                <Typography sx={{ color: '#e8f0fe', fontSize: '0.86rem' }}>{toast.msg}</Typography>
            </Box>

            <Footer />
        </>
    );
}
