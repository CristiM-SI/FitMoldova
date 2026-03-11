import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useAuth } from '../context/AuthContext';
import {
    FORUM_CATEGORIES,
    TRENDING_TOPICS,
    SUGGESTED_USERS,
    INITIAL_THREADS,
} from '../services/mock/forum';
import type {
    ForumCategory,
    ForumThread,
    ForumReply,
    SuggestedUser,
} from '../services/mock/forum';
import {
  ft, fontImportCSS, keyframesCSS,
  sxPageRoot, sxBody, sxSidebar, sxNavItem, sxNavItemActive,
  sxNavIcon, sxNavIconActive, sxNavBadge, sxPostBtn, sxMain, sxHeader as sxHeaderBase,
  sxHeaderTitle, sxThread, sxThreadRow, sxThreadAva, sxThreadBody,
  sxThreadMeta, sxAuthor, sxHandle, sxDot, sxTime, sxCategoryTag,
  sxContent, sxHashtag, sxActions, sxAction, sxEmpty, sxEmptyIcon,
  sxEmptyTitle, sxEmptySub, sxToast, sxTab, sxTabs,
  sxRightSidebar, sxSearchBox, sxSearchIcon, sxSearchInput,
  sxSuggestBox, sxSuggestHeader, sxSuggestUser, sxSuggestAva,
  sxSuggestInfo, sxSuggestName, sxSuggestHandle, sxSuggestBio, sxFollowBtn,
} from '../styles/forumStyles';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const getInitials = (name: string): string =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const formatCount = (n: number): string => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
};

// ─────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────
const Icons = {
    reply: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>),
    repost: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>),
    heart: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>),
    heartFilled: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>),
    bookmark: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>),
    bookmarkFilled: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>),
    views: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>),
    share: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>),
    verified: (<svg width="16" height="16" viewBox="0 0 24 24" fill="#1a6fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /><circle cx="12" cy="12" r="11" fill="none" stroke="#1a6fff" strokeWidth="2" /><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" transform="scale(0.6) translate(8,8)" /></svg>),
    pin: (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" /></svg>),
    search: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>),
    back: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>),
    image: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>),
    gif: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">GIF</text></svg>),
    poll: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>),
    emoji: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>),
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function ForumPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const composeRef = useRef<HTMLTextAreaElement>(null);
    const replyRef = useRef<HTMLTextAreaElement>(null);

    const [activeCategory, setActiveCategory] = useState<ForumCategory>('Toate');
    const [threads, setThreads] = useState<ForumThread[]>(INITIAL_THREADS);
    const [expandedThread, setExpandedThread] = useState<number | null>(null);
    const [composeText, setComposeText] = useState('');
    const [composeCategory, setComposeCategory] = useState<ForumCategory>('Antrenament');
    const [replyText, setReplyText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
    const [toast, setToast] = useState({ msg: '', visible: false });
    const [heartAnims, setHeartAnims] = useState<Set<number>>(new Set());

    const userAvatar = user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : 'FM';
    const userName = user ? `${user.firstName} ${user.lastName}` : 'FitMoldova User';
    const userHandle = user ? `@${user.username}` : '@user';

    const showToast = useCallback((msg: string) => {
        setToast({ msg, visible: true });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
    }, []);

    useEffect(() => {
        if (composeRef.current) { composeRef.current.style.height = 'auto'; composeRef.current.style.height = composeRef.current.scrollHeight + 'px'; }
    }, [composeText]);
    useEffect(() => {
        if (replyRef.current) { replyRef.current.style.height = 'auto'; replyRef.current.style.height = replyRef.current.scrollHeight + 'px'; }
    }, [replyText]);

    const handleLike = useCallback((threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setHeartAnims((prev) => new Set(prev).add(threadId));
        setTimeout(() => setHeartAnims((prev) => { const n = new Set(prev); n.delete(threadId); return n; }), 350);
        setThreads((prev) => prev.map((t) => t.id === threadId ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 } : t));
    }, []);

    const handleRepost = useCallback((threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setThreads((prev) => prev.map((t) => t.id === threadId ? { ...t, reposted: !t.reposted, reposts: t.reposted ? t.reposts - 1 : t.reposts + 1 } : t));
        const thread = threads.find((t) => t.id === threadId);
        if (thread && !thread.reposted) showToast('Repostat cu succes!');
    }, [threads, showToast]);

    const handleBookmark = useCallback((threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setThreads((prev) => prev.map((t) => t.id === threadId ? { ...t, bookmarked: !t.bookmarked } : t));
        const thread = threads.find((t) => t.id === threadId);
        showToast(thread?.bookmarked ? 'Eliminat din salvate' : 'Adăugat la salvate');
    }, [threads, showToast]);

    const handleReplyLike = useCallback((threadId: number, replyId: number) => {
        setThreads((prev) => prev.map((t) => t.id === threadId ? { ...t, replies: t.replies.map((r) => r.id === replyId ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r) } : t));
    }, []);

    const handlePollVote = useCallback((threadId: number, optionIdx: number) => {
        setThreads((prev) => prev.map((t) => {
            if (t.id !== threadId || !t.poll || t.poll.voted) return t;
            const newOptions = t.poll.options.map((o, i) => i === optionIdx ? { ...o, votes: o.votes + 1 } : o);
            return { ...t, poll: { ...t.poll, options: newOptions, totalVotes: t.poll.totalVotes + 1, voted: true } };
        }));
        showToast('Votul tău a fost înregistrat!');
    }, [showToast]);

    const handlePublish = useCallback(() => {
        if (!composeText.trim()) return;
        const newThread: ForumThread = {
            id: Date.now(), author: userName, avatar: userAvatar, color: '#1a6fff',
            handle: userHandle, verified: false, content: composeText.trim(),
            category: composeCategory, time: 'acum', likes: 0, liked: false,
            replies: [], reposts: 0, reposted: false, bookmarked: false, views: 0,
        };
        setThreads((prev) => [newThread, ...prev]);
        setComposeText('');
        showToast('Postarea ta a fost publicată!');
    }, [composeText, composeCategory, userName, userAvatar, userHandle, showToast]);

    const handleReplySubmit = useCallback(() => {
        if (!replyText.trim() || expandedThread === null) return;
        const newReply: ForumReply = {
            id: Date.now(), author: userName, avatar: userAvatar, color: '#1a6fff',
            handle: userHandle, content: replyText.trim(), time: 'acum',
            likes: 0, liked: false, verified: false,
        };
        setThreads((prev) => prev.map((t) => t.id === expandedThread ? { ...t, replies: [newReply, ...t.replies] } : t));
        setReplyText('');
        showToast('Răspunsul tău a fost adăugat!');
    }, [replyText, expandedThread, userName, userAvatar, userHandle, showToast]);

    const handleFollow = useCallback((user: SuggestedUser) => {
        setFollowedUsers((prev) => { const next = new Set(prev); if (next.has(user.handle)) next.delete(user.handle); else next.add(user.handle); return next; });
    }, []);

    const filteredThreads = useMemo(() => {
        let result = threads;
        if (activeCategory !== 'Toate') result = result.filter((t) => t.category === activeCategory);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((t) => t.content.toLowerCase().includes(q) || t.author.toLowerCase().includes(q) || t.handle.toLowerCase().includes(q));
        }
        return [...result].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    }, [threads, activeCategory, searchQuery]);

    const expandedData = expandedThread !== null ? threads.find((t) => t.id === expandedThread) : null;

    const renderContent = (content: string) =>
        content.split(/(#\S+)/g).map((part, i) =>
            part.startsWith('#') ? <Box component="span" key={i} sx={sxHashtag}>{part}</Box> : <span key={i}>{part}</span>
        );

    const MAX_CHARS = 500;
    const charsLeft = MAX_CHARS - composeText.length;

    // ── Compose tool button style
    const sxComposeTool = {
        background: 'none', border: 'none', color: ft.cyan, opacity: 0.6,
        p: '8px', borderRadius: '50%', cursor: 'pointer', transition: 'all .15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        '&:hover': { opacity: 1, bgcolor: 'rgba(0,200,255,0.08)' },
    };

    // ── Poll option style
    const sxPollOption = (voted: boolean) => ({
        position: 'relative', borderRadius: '10px', overflow: 'hidden',
        border: `1px solid ${ft.border2}`, cursor: voted ? 'default' : 'pointer',
        transition: 'border-color .15s',
        '&:hover': voted ? {} : { borderColor: ft.cyan },
    });

    return (
        <>
            <style>{fontImportCSS}{keyframesCSS}</style>
            <Navbar />
            <Box sx={{ ...sxPageRoot, pt: '80px' }}>
                <Box sx={sxBody}>

                    {/* ══════════ LEFT SIDEBAR ══════════ */}
                    <Box component="aside" sx={sxSidebar}>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            p: '12px 14px', mb: '12px', cursor: 'pointer',
                        }} onClick={() => navigate(ROUTES.COMMUNITY)}>
                            <Box sx={{
                                width: 36, height: 36, borderRadius: '10px',
                                background: `linear-gradient(135deg, ${ft.blue}, ${ft.cyan})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: ft.fontCondensed, fontWeight: 900, fontSize: '.85rem', color: '#fff',
                            }}>FM</Box>
                            <Box className="sidebar-text" sx={{ fontFamily: ft.fontCondensed, fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px', color: '#fff' }}>
                                Fit<Box component="span" sx={{ color: ft.cyan }}>Forum</Box>
                            </Box>
                        </Box>

                        <Box component="button" sx={sxNavItemActive} className="nav-item">
                            <Box component="span" sx={sxNavIconActive}>🏠</Box>
                            <Box component="span" className="sidebar-text">Feed</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate(ROUTES.COMMUNITY)}>
                            <Box component="span" sx={sxNavIcon}>👥</Box>
                            <Box component="span" className="sidebar-text">Comunitate</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item">
                            <Box component="span" sx={sxNavIcon}>🔔</Box>
                            <Box component="span" className="sidebar-text">Notificări</Box>
                            <Box component="span" sx={sxNavBadge} className="nav-badge">3</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item">
                            <Box component="span" sx={sxNavIcon}>✉️</Box>
                            <Box component="span" className="sidebar-text">Mesaje</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item">
                            <Box component="span" sx={sxNavIcon}>🔖</Box>
                            <Box component="span" className="sidebar-text">Salvate</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate(ROUTES.PROFILE)}>
                            <Box component="span" sx={sxNavIcon}>👤</Box>
                            <Box component="span" className="sidebar-text">Profil</Box>
                        </Box>
                        <Box component="button" sx={sxPostBtn} className="sidebar-text" onClick={() => composeRef.current?.focus()}>
                            Postează
                        </Box>
                    </Box>

                    {/* ══════════ MAIN FEED ══════════ */}
                    <Box component="main" sx={sxMain}>
                        {/* Header */}
                        <Box sx={{ ...sxHeaderBase, p: 0, borderBottom: `1px solid ${ft.border}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', p: '16px 20px 12px' }}>
                                {expandedThread !== null && (
                                    <Box component="button" sx={{
                                        background: 'none', border: 'none', color: ft.text,
                                        cursor: 'pointer', p: '6px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'background .15s',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                                    }} onClick={() => { setExpandedThread(null); setReplyText(''); }}>
                                        {Icons.back}
                                    </Box>
                                )}
                                <Box sx={sxHeaderTitle}>
                                    {expandedThread !== null ? 'Postare' : 'Forum'}
                                </Box>
                            </Box>
                            {expandedThread === null && (
                                <Box sx={sxTabs}>
                                    {FORUM_CATEGORIES.map((cat) => (
                                        <Box component="button" key={cat} sx={sxTab(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
                                            {cat}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>

                        {/* ── Expanded Thread View ── */}
                        {expandedData ? (
                            <>
                                <Box sx={{ ...sxThread, cursor: 'default', '&:hover': { bgcolor: 'transparent' } }}>
                                    {expandedData.pinned && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '.72rem', color: ft.muted, fontWeight: 600, pb: '8px', pl: '58px' }}>
                                            {Icons.pin} Postare fixată
                                        </Box>
                                    )}
                                    <Box sx={sxThreadRow}>
                                        <Box sx={{ ...sxThreadAva, background: expandedData.color }}>{expandedData.avatar}</Box>
                                        <Box sx={sxThreadBody}>
                                            <Box sx={sxThreadMeta}>
                                                <Box component="span" sx={sxAuthor}>{expandedData.author}</Box>
                                                {expandedData.verified && <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: '-2px' }}>{Icons.verified}</Box>}
                                                <Box component="span" sx={sxHandle}>{expandedData.handle}</Box>
                                            </Box>
                                            <Box sx={sxContent}>{renderContent(expandedData.content)}</Box>

                                            {expandedData.poll && (
                                                <Box sx={{ mb: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {expandedData.poll.options.map((opt, idx) => {
                                                        const pct = expandedData.poll!.voted ? Math.round((opt.votes / expandedData.poll!.totalVotes) * 100) : 0;
                                                        const maxVotes = Math.max(...expandedData.poll!.options.map((o) => o.votes));
                                                        const isWinner = expandedData.poll!.voted && opt.votes === maxVotes;
                                                        return (
                                                            <Box key={idx} sx={sxPollOption(!!expandedData.poll!.voted)} onClick={() => !expandedData.poll!.voted && handlePollVote(expandedData.id, idx)}>
                                                                {expandedData.poll!.voted && (
                                                                    <Box sx={{ position: 'absolute', inset: 0, borderRadius: '10px', bgcolor: isWinner ? 'rgba(0,200,255,0.15)' : 'rgba(26,111,255,0.12)', width: `${pct}%`, transition: 'width .6s cubic-bezier(.22,1,.36,1)' }} />
                                                                )}
                                                                <Box sx={{ position: 'relative', zIndex: 1, p: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '.84rem', fontWeight: 600 }}>
                                                                    <span>{opt.label}</span>
                                                                    {expandedData.poll!.voted && <Box component="span" sx={{ color: ft.muted, fontSize: '.78rem', fontWeight: 700 }}>{pct}%</Box>}
                                                                </Box>
                                                            </Box>
                                                        );
                                                    })}
                                                    <Box sx={{ fontSize: '.74rem', color: ft.muted, mt: '4px' }}>{formatCount(expandedData.poll.totalVotes)} voturi</Box>
                                                </Box>
                                            )}

                                            <Box sx={{ fontSize: '.82rem', color: ft.muted, mb: '4px' }}>
                                                {expandedData.time} · <Box component="span" sx={{ ...sxCategoryTag, ml: 0, display: 'inline' }}>{expandedData.category}</Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: '20px', p: '14px 0', borderTop: `1px solid ${ft.border}`, borderBottom: `1px solid ${ft.border}`, mt: '12px' }}>
                                                <Box sx={{ fontSize: '.84rem', color: ft.muted }}><strong style={{ color: '#fff', fontWeight: 700 }}>{formatCount(expandedData.reposts)}</strong> Reposturi</Box>
                                                <Box sx={{ fontSize: '.84rem', color: ft.muted }}><strong style={{ color: '#fff', fontWeight: 700 }}>{formatCount(expandedData.likes)}</strong> Aprecieri</Box>
                                                <Box sx={{ fontSize: '.84rem', color: ft.muted }}><strong style={{ color: '#fff', fontWeight: 700 }}>{formatCount(expandedData.views)}</strong> Vizualizări</Box>
                                            </Box>

                                            <Box sx={{ ...sxActions, maxWidth: 'none', p: '8px 0' }}>
                                                <Box component="button" sx={{ ...sxAction, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.cyan } }}>{Icons.reply} <span>{expandedData.replies.length}</span></Box>
                                                <Box component="button" sx={{ ...sxAction, color: expandedData.reposted ? ft.green : ft.muted, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.green } }} onClick={(e: React.MouseEvent) => handleRepost(expandedData.id, e)}>{Icons.repost} <span>{formatCount(expandedData.reposts)}</span></Box>
                                                <Box component="button" sx={{ ...sxAction, color: expandedData.liked ? ft.red : ft.muted, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.red }, animation: heartAnims.has(expandedData.id) ? 'heartPop .35s ease' : 'none' }} onClick={(e: React.MouseEvent) => handleLike(expandedData.id, e)}>{expandedData.liked ? Icons.heartFilled : Icons.heart} <span>{formatCount(expandedData.likes)}</span></Box>
                                                <Box component="button" sx={{ ...sxAction, color: expandedData.bookmarked ? ft.cyan : ft.muted, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.cyan } }} onClick={(e: React.MouseEvent) => handleBookmark(expandedData.id, e)}>{expandedData.bookmarked ? Icons.bookmarkFilled : Icons.bookmark}</Box>
                                                <Box component="button" sx={{ ...sxAction, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.cyan } }}>{Icons.share}</Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Reply compose */}
                                <Box sx={{ p: '14px 20px', borderBottom: `1px solid ${ft.border}`, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <Box sx={{ ...sxThreadAva, width: 36, height: 36, fontSize: '.75rem', background: `linear-gradient(135deg, ${ft.blue}, ${ft.cyan})` }}>{userAvatar}</Box>
                                    <Box
                                        component="textarea"
                                        ref={replyRef}
                                        sx={{
                                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                            color: ft.text, fontFamily: ft.font, fontSize: '.92rem',
                                            resize: 'none', minHeight: 40, p: '8px 0',
                                            '&::placeholder': { color: ft.muted },
                                        }}
                                        placeholder="Scrie un răspuns..."
                                        value={replyText}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
                                        rows={1}
                                    />
                                    <Box component="button" sx={{
                                        p: '7px 18px', borderRadius: 100, border: 'none', bgcolor: ft.blue, color: '#fff',
                                        fontFamily: ft.fontCondensed, fontWeight: 700, fontSize: '.8rem', cursor: 'pointer',
                                        transition: 'all .15s', alignSelf: 'flex-end',
                                        '&:hover:not(:disabled)': { bgcolor: '#2a7fff' },
                                        '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
                                    }} disabled={!replyText.trim()} onClick={handleReplySubmit}>Răspunde</Box>
                                </Box>

                                {/* Replies list */}
                                {expandedData.replies.map((reply, idx) => (
                                    <Box key={reply.id} sx={{
                                        p: '14px 20px', borderBottom: `1px solid ${ft.border}`,
                                        display: 'flex', gap: '12px',
                                        animation: 'forumFadeIn .3s ease both', animationDelay: `${idx * 50}ms`,
                                    }}>
                                        <Box sx={{ ...sxThreadAva, width: 36, height: 36, fontSize: '.75rem', background: reply.color }}>{reply.avatar}</Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ ...sxThreadMeta }}>
                                                <Box component="span" sx={{ ...sxAuthor, fontSize: '.86rem' }}>{reply.author}</Box>
                                                {reply.verified && <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: '-2px' }}>{Icons.verified}</Box>}
                                                <Box component="span" sx={sxHandle}>{reply.handle}</Box>
                                                <Box component="span" sx={sxDot}>·</Box>
                                                <Box component="span" sx={sxTime}>{reply.time}</Box>
                                            </Box>
                                            <Box sx={{ fontSize: '.88rem', lineHeight: 1.55, color: ft.contentColor, mb: '8px' }}>{reply.content}</Box>
                                            <Box sx={{ display: 'flex', gap: '16px' }}>
                                                <Box component="button" sx={{ ...sxAction, p: 0, fontSize: '.74rem' }}>{Icons.reply}</Box>
                                                <Box component="button" sx={{ ...sxAction, p: 0, fontSize: '.74rem', color: reply.liked ? ft.red : ft.muted }} onClick={() => handleReplyLike(expandedData.id, reply.id)}>
                                                    {reply.liked ? Icons.heartFilled : Icons.heart} {reply.likes}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </>
                        ) : (
                            <>
                                {/* ── Compose box ── */}
                                <Box sx={{ p: '16px 20px', borderBottom: `1px solid ${ft.border}`, display: 'flex', gap: '14px' }}>
                                    <Box sx={{ ...sxThreadAva, background: `linear-gradient(135deg, ${ft.blue}, ${ft.cyan})` }}>{userAvatar}</Box>
                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Box
                                            component="textarea"
                                            ref={composeRef}
                                            sx={{
                                                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                                                color: ft.text, fontFamily: ft.font, fontSize: '1.1rem',
                                                resize: 'none', minHeight: 54, p: '8px 0', lineHeight: 1.5,
                                                '&::placeholder': { color: ft.muted },
                                            }}
                                            placeholder="Ce se întâmplă în lumea fitness?"
                                            value={composeText}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComposeText(e.target.value.slice(0, MAX_CHARS + 50))}
                                            rows={1}
                                        />
                                        <Box sx={{ height: 1, bgcolor: ft.border, my: '8px' }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', gap: '2px' }}>
                                                <Box component="button" sx={sxComposeTool} title="Imagine">{Icons.image}</Box>
                                                <Box component="button" sx={sxComposeTool} title="GIF">{Icons.gif}</Box>
                                                <Box component="button" sx={sxComposeTool} title="Sondaj">{Icons.poll}</Box>
                                                <Box component="button" sx={sxComposeTool} title="Emoji">{Icons.emoji}</Box>
                                                <select
                                                    style={{
                                                        background: 'transparent', border: `1px solid ${ft.border}`,
                                                        borderRadius: 100, padding: '4px 10px', color: ft.cyan,
                                                        fontSize: '.74rem', fontWeight: 600, outline: 'none', cursor: 'pointer',
                                                        fontFamily: ft.font,
                                                    }}
                                                    value={composeCategory}
                                                    onChange={(e) => setComposeCategory(e.target.value as ForumCategory)}
                                                >
                                                    {FORUM_CATEGORIES.filter((c) => c !== 'Toate').map((c) => (
                                                        <option key={c} value={c} style={{ background: '#0a1628' }}>{c}</option>
                                                    ))}
                                                </select>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {composeText.length > 0 && (
                                                    <Box component="span" sx={{
                                                        fontSize: '.72rem', mr: '12px',
                                                        color: charsLeft <= 0 ? ft.red : charsLeft <= 50 ? '#ff9100' : ft.muted,
                                                    }}>{charsLeft}</Box>
                                                )}
                                                <Box component="button" sx={{
                                                    p: '8px 22px', borderRadius: 100, border: 'none', bgcolor: ft.blue, color: '#fff',
                                                    fontFamily: ft.fontCondensed, fontWeight: 700, fontSize: '.85rem', letterSpacing: '.5px',
                                                    cursor: 'pointer', transition: 'all .15s',
                                                    '&:hover:not(:disabled)': { bgcolor: '#2a7fff', boxShadow: `0 0 16px rgba(26,111,255,.4)` },
                                                    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
                                                }} disabled={!composeText.trim() || charsLeft < 0} onClick={handlePublish}>Postează</Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* ── Threads ── */}
                                {filteredThreads.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', p: '64px 24px', color: ft.muted }}>
                                        <Box sx={{ fontSize: '2.5rem', mb: '14px', opacity: 0.5 }}>🔍</Box>
                                        <Box sx={{ fontFamily: ft.fontCondensed, fontSize: '1.2rem', fontWeight: 700, color: '#fff', mb: '6px' }}>
                                            Nicio postare găsită
                                        </Box>
                                        <Box sx={{ fontSize: '.85rem', lineHeight: 1.6 }}>
                                            Încearcă altă categorie sau scrie prima postare!
                                        </Box>
                                    </Box>
                                ) : (
                                    filteredThreads.map((thread, idx) => (
                                        <Box key={thread.id}>
                                            {thread.pinned && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '.72rem', color: ft.muted, fontWeight: 600, pt: '12px', pl: '58px' }}>
                                                    {Icons.pin} Postare fixată
                                                </Box>
                                            )}
                                            <Box sx={{ ...sxThread, animationDelay: `${idx * 40}ms` }} onClick={() => setExpandedThread(thread.id)}>
                                                <Box sx={sxThreadRow}>
                                                    <Box sx={{ ...sxThreadAva, background: thread.color }}>{thread.avatar}</Box>
                                                    <Box sx={sxThreadBody}>
                                                        <Box sx={sxThreadMeta}>
                                                            <Box component="span" sx={sxAuthor}>{thread.author}</Box>
                                                            {thread.verified && <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: '-2px' }}>{Icons.verified}</Box>}
                                                            <Box component="span" sx={sxHandle}>{thread.handle}</Box>
                                                            <Box component="span" sx={sxDot}>·</Box>
                                                            <Box component="span" sx={sxTime}>{thread.time}</Box>
                                                            <Box component="span" sx={sxCategoryTag}>{thread.category}</Box>
                                                        </Box>
                                                        <Box sx={{ ...sxContent, mb: '8px' }}>{renderContent(thread.content)}</Box>

                                                        {thread.poll && (
                                                            <Box sx={{ mb: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                                                                {thread.poll.options.map((opt, optIdx) => {
                                                                    const pct = thread.poll!.voted ? Math.round((opt.votes / thread.poll!.totalVotes) * 100) : 0;
                                                                    const maxVotes = Math.max(...thread.poll!.options.map((o) => o.votes));
                                                                    const isWinner = thread.poll!.voted && opt.votes === maxVotes;
                                                                    return (
                                                                        <Box key={optIdx} sx={sxPollOption(!!thread.poll!.voted)} onClick={() => !thread.poll!.voted && handlePollVote(thread.id, optIdx)}>
                                                                            {thread.poll!.voted && <Box sx={{ position: 'absolute', inset: 0, borderRadius: '10px', bgcolor: isWinner ? 'rgba(0,200,255,0.15)' : 'rgba(26,111,255,0.12)', width: `${pct}%`, transition: 'width .6s cubic-bezier(.22,1,.36,1)' }} />}
                                                                            <Box sx={{ position: 'relative', zIndex: 1, p: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '.84rem', fontWeight: 600 }}>
                                                                                <span>{opt.label}</span>
                                                                                {thread.poll!.voted && <Box component="span" sx={{ color: ft.muted, fontSize: '.78rem', fontWeight: 700 }}>{pct}%</Box>}
                                                                            </Box>
                                                                        </Box>
                                                                    );
                                                                })}
                                                                <Box sx={{ fontSize: '.74rem', color: ft.muted, mt: '4px' }}>{formatCount(thread.poll.totalVotes)} voturi</Box>
                                                            </Box>
                                                        )}

                                                        <Box sx={sxActions} onClick={(e) => e.stopPropagation()}>
                                                            <Box component="button" sx={{ ...sxAction, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.cyan } }}>{Icons.reply} <span>{thread.replies.length}</span></Box>
                                                            <Box component="button" sx={{ ...sxAction, color: thread.reposted ? ft.green : ft.muted, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.green } }} onClick={(e: React.MouseEvent) => handleRepost(thread.id, e)}>{Icons.repost} <span>{formatCount(thread.reposts)}</span></Box>
                                                            <Box component="button" sx={{ ...sxAction, color: thread.liked ? ft.red : ft.muted, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.red }, animation: heartAnims.has(thread.id) ? 'heartPop .35s ease' : 'none' }} onClick={(e: React.MouseEvent) => handleLike(thread.id, e)}>
                                                                {thread.liked ? Icons.heartFilled : Icons.heart} <span>{formatCount(thread.likes)}</span>
                                                            </Box>
                                                            <Box component="button" sx={{ ...sxAction, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.cyan } }}>{Icons.views} <span>{formatCount(thread.views)}</span></Box>
                                                            <Box component="button" sx={{ ...sxAction, color: thread.bookmarked ? ft.cyan : ft.muted, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.cyan } }} onClick={(e: React.MouseEvent) => handleBookmark(thread.id, e)}>
                                                                {thread.bookmarked ? Icons.bookmarkFilled : Icons.bookmark}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))
                                )}
                            </>
                        )}
                    </Box>

                    {/* ══════════ RIGHT SIDEBAR ══════════ */}
                    <Box component="aside" sx={sxRightSidebar}>
                        <Box sx={sxSearchBox}>
                            <Box component="span" sx={sxSearchIcon}>{Icons.search}</Box>
                            <Box component="input" sx={sxSearchInput} placeholder="Caută în forum..." value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} />
                        </Box>

                        {/* Trending */}
                        <Box sx={{ bgcolor: ft.card, border: `1px solid ${ft.border}`, borderRadius: ft.radius, overflow: 'hidden' }}>
                            <Box sx={{ p: '16px 18px', fontFamily: ft.fontCondensed, fontWeight: 800, fontSize: '1.15rem', letterSpacing: '.5px' }}>🔥 Trending</Box>
                            {TRENDING_TOPICS.slice(0, 4).map((topic) => (
                                <Box key={topic.id} sx={{
                                    p: '12px 18px', borderTop: `1px solid ${ft.border}`,
                                    cursor: 'pointer', transition: 'background .15s',
                                    '&:hover': { bgcolor: 'rgba(0,200,255,0.03)' },
                                }} onClick={() => setSearchQuery(topic.tag)}>
                                    <Box sx={{ fontSize: '.7rem', color: ft.muted, fontWeight: 600, letterSpacing: '.5px' }}>{topic.category}</Box>
                                    <Box sx={{ fontWeight: 700, fontSize: '.92rem', my: '2px' }}>{topic.tag}</Box>
                                    <Box sx={{ fontSize: '.72rem', color: ft.muted }}>{formatCount(topic.posts)} postări</Box>
                                </Box>
                            ))}
                            <Box component="button" sx={{
                                display: 'block', p: '14px 18px', borderTop: `1px solid ${ft.border}`,
                                color: ft.cyan, fontSize: '.86rem', fontWeight: 600,
                                background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                                transition: 'background .15s', '&:hover': { bgcolor: 'rgba(0,200,255,0.04)' },
                            }}>Arată mai mult</Box>
                        </Box>

                        {/* Suggested users */}
                        <Box sx={sxSuggestBox}>
                            <Box sx={sxSuggestHeader}>Sugestii de urmărit</Box>
                            {SUGGESTED_USERS.map((su) => {
                                const isFollowing = followedUsers.has(su.handle);
                                return (
                                    <Box key={su.handle} sx={sxSuggestUser}>
                                        <Box sx={{ ...sxSuggestAva, background: su.color }}>{getInitials(su.name)}</Box>
                                        <Box sx={sxSuggestInfo}>
                                            <Box sx={sxSuggestName}>{su.name}{su.verified && Icons.verified}</Box>
                                            <Box sx={sxSuggestHandle}>{su.handle}</Box>
                                            <Box sx={sxSuggestBio}>{su.bio}</Box>
                                        </Box>
                                        <Box component="button" sx={sxFollowBtn(isFollowing)} onClick={() => handleFollow(su)}>
                                            {isFollowing ? 'Urmăresc' : 'Urmărește'}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Footer links */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', px: '4px' }}>
                            {['Termeni', 'Confidențialitate', 'Cookies', 'Accesibilitate'].map((l) => (
                                <Box component="a" key={l} href="#" sx={{ fontSize: '.7rem', color: ft.muted, textDecoration: 'none', transition: 'color .15s', '&:hover': { color: ft.text, textDecoration: 'underline' } }}>{l}</Box>
                            ))}
                            <Box component="span" sx={{ fontSize: '.7rem', color: ft.muted }}>© 2026 FitMoldova</Box>
                        </Box>
                    </Box>

                </Box>

                <Box sx={sxToast(toast.visible)}>
                    {toast.msg}
                </Box>
            </Box>
        </>
    );
}
