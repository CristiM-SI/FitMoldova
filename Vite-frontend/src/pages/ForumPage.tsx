import { useState, useCallback, useMemo, useRef } from 'react';
import { message } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import Box from '@mui/material/Box';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useAuth } from '../context/AuthContext';
import { useForumContext } from '../context/ForumContext';
import {
    FORUM_CATEGORIES,
    TRENDING_TOPICS,
    SUGGESTED_USERS,
} from '../services/mock/forum';
import type {
    ForumCategory,
    ForumThread,
    SuggestedUser,
} from '../services/mock/forum';
import {
    ft, fontImportCSS, keyframesCSS,
    sxPageRoot, sxBody, sxSidebar, sxNavItem, sxNavItemActive,
    sxNavIcon, sxNavIconActive, sxNavBadge, sxPostBtn, sxMain, sxHeader as sxHeaderBase,
    sxHeaderTitle, sxThread, sxThreadRow, sxThreadAva, sxThreadBody,
    sxThreadMeta, sxAuthor, sxHandle, sxDot, sxTime, sxCategoryTag,
    sxContent, sxActions, sxAction, sxTab, sxTabs,
    sxRightSidebar, sxSearchBox, sxSearchIcon, sxSearchInput,
    sxSuggestBox, sxSuggestHeader, sxSuggestUser, sxSuggestAva,
    sxSuggestInfo, sxSuggestName, sxSuggestHandle, sxSuggestBio, sxFollowBtn,
} from '../styles/forumStyles';
import { formatCount, getInitials, Icons, renderContent } from '../utils/forumHelpers';

// ─── Types ───────────────────────────────────────────────
type ActiveView = 'feed' | 'salvate' | 'notificari' | 'mesaje';

interface Notification {
    id: number;
    type: 'like' | 'repost' | 'reply' | 'follow';
    fromUser: string;
    fromAvatar: string;
    fromColor: string;
    fromHandle: string;
    threadContent?: string;
    replyContent?: string;
    time: string;
    read: boolean;
}

interface Conversation {
    id: number;
    user: string;
    avatar: string;
    color: string;
    handle: string;
    lastMessage: string;
    time: string;
    unread: number;
    messages: { id: number; from: 'me' | 'them'; text: string; time: string }[];
}

// ─── Mock Notifications ──────────────────────────────────
const INITIAL_NOTIFICATIONS: Notification[] = [
    { id: 1,  type: 'like',   fromUser: 'Maria Lungu',  fromAvatar: 'ML', fromColor: '#e84393', fromHandle: '@maria_runs',   threadContent: 'Înscrierile pentru Maratonul Chișinău 2026...', time: '2min', read: false },
    { id: 2,  type: 'repost', fromUser: 'Ion Ceban',    fromAvatar: 'IC', fromColor: '#1a6fff', fromHandle: '@ion_fitness',  threadContent: 'Înscrierile pentru Maratonul Chișinău 2026...', time: '5min', read: false },
    { id: 3,  type: 'reply',  fromUser: 'Andrei Popescu', fromAvatar: 'AP', fromColor: '#00b894', fromHandle: '@andrei_fit', threadContent: 'Înscrierile pentru Maratonul Chișinău 2026...', replyContent: 'Primul meu maraton! Merg pe 10K!', time: '12min', read: false },
    { id: 4,  type: 'follow', fromUser: 'Ana Stratan',  fromAvatar: 'AS', fromColor: '#fdcb6e', fromHandle: '@ana_yoga',    time: '1h', read: true },
    { id: 5,  type: 'like',   fromUser: 'Pavel Rotaru', fromAvatar: 'PR', fromColor: '#00b894', fromHandle: '@pavel_lifts', threadContent: 'Cele mai comune greșeli la squat...', time: '2h', read: true },
    { id: 6,  type: 'reply',  fromUser: 'Cristina Rusu', fromAvatar: 'CR', fromColor: '#6c5ce7', fromHandle: '@cristina_gym', threadContent: 'Cele mai comune greșeli la squat...', replyContent: 'Tocmai aveam această problemă cu genunchii!', time: '3h', read: true },
    { id: 7,  type: 'like',   fromUser: 'Diana Moraru', fromAvatar: 'DM', fromColor: '#a29bfe', fromHandle: '@diana_nutrition', threadContent: 'Meal prep duminică — 5 mese în 2 ore!', time: '4h', read: true },
    { id: 8,  type: 'repost', fromUser: 'Sergiu Dabija', fromAvatar: 'SD', fromColor: '#e17055', fromHandle: '@sergiu_runner', threadContent: 'Cele mai comune greșeli la squat...', time: '5h', read: true },
];

// ─── Mock Conversations ──────────────────────────────────
const INITIAL_CONVERSATIONS: Conversation[] = [
    {
        id: 1, user: 'Ion Ceban', avatar: 'IC', color: '#1a6fff', handle: '@ion_fitness',
        lastMessage: 'Hai la antrenament mâine dimineață?', time: '5min', unread: 2,
        messages: [
            { id: 1, from: 'them', text: 'Salut! Ai văzut postarea despre maraton?', time: '10min' },
            { id: 2, from: 'me',   text: 'Da, m-am și înscris! Tu mergi?', time: '8min' },
            { id: 3, from: 'them', text: 'Sigur! Merg pe 21K. Hai la antrenament mâine dimineață?', time: '5min' },
        ],
    },
    {
        id: 2, user: 'Maria Lungu', avatar: 'ML', color: '#e84393', handle: '@maria_runs',
        lastMessage: 'Mulțumesc pentru sfaturi! 🙏', time: '1h', unread: 0,
        messages: [
            { id: 1, from: 'me',   text: 'Bună Maria! Cum merge antrenamentul?', time: '2h' },
            { id: 2, from: 'them', text: 'Merge bine! Am alergat 18km ieri 💪', time: '1h 30min' },
            { id: 3, from: 'me',   text: 'Impresionant! Ai vreun sfat pentru pace?', time: '1h 15min' },
            { id: 4, from: 'them', text: 'Mulțumesc pentru sfaturi! 🙏', time: '1h' },
        ],
    },
    {
        id: 3, user: 'Ana Stratan', avatar: 'AS', color: '#fdcb6e', handle: '@ana_yoga',
        lastMessage: 'Sesiunea de yoga e vineri la 9!', time: '3h', unread: 1,
        messages: [
            { id: 1, from: 'them', text: 'Sesiunea de yoga e vineri la 9!', time: '3h' },
        ],
    },
    {
        id: 4, user: 'Pavel Rotaru', avatar: 'PR', color: '#00b894', handle: '@pavel_lifts',
        lastMessage: 'Noul program de powerlifting e gata', time: '1zi', unread: 0,
        messages: [
            { id: 1, from: 'them', text: 'Noul program de powerlifting e gata. Vrei să-l încerc?', time: '1zi' },
            { id: 2, from: 'me',   text: 'Da, trimite-mi te rog!', time: '1zi' },
        ],
    },
];

// ─── Notif Icon Helper ───────────────────────────────────
const notifIcon = (type: Notification['type']) => {
    if (type === 'like')   return { icon: '❤️', label: 'a apreciat postarea ta' };
    if (type === 'repost') return { icon: '🔁', label: 'a repostat postarea ta' };
    if (type === 'reply')  return { icon: '💬', label: 'a răspuns la postarea ta' };
    if (type === 'follow') return { icon: '👤', label: 'a început să te urmărească' };
    return { icon: '🔔', label: '' };
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function ForumPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const forum = useForumContext();
    const composeRef = useRef<HTMLTextAreaElement>(null);

    const [activeView, setActiveView]             = useState<ActiveView>('feed');
    const [activeCategory, setActiveCategory]     = useState<ForumCategory>('Toate');
    const [expandedThread, setExpandedThread]     = useState<number | null>(null);
    const [composeText, setComposeText]           = useState('');
    const [composeCategory, setComposeCategory]   = useState<ForumCategory>('Antrenament');
    const [replyText, setReplyText]               = useState('');
    const [searchQuery, setSearchQuery]           = useState('');
    const [notifications, setNotifications]       = useState<Notification[]>(INITIAL_NOTIFICATIONS);
    const [conversations, setConversations]       = useState<Conversation[]>(INITIAL_CONVERSATIONS);
    const [activeConv, setActiveConv]             = useState<number | null>(null);
    const [msgInput, setMsgInput]                 = useState('');

    // Thread state and actions come from ForumContext (API-backed)
    const { threads, loading: threadsLoading, heartAnims, followedUsers } = forum;

    const userAvatar = user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : 'FM';
    const userName   = user ? `${user.firstName} ${user.lastName}` : 'FitMoldova User';
    const userHandle = user ? `@${user.username}` : '@user';

    const unreadNotifs = notifications.filter((n) => !n.read).length;
    const unreadMsgs   = conversations.reduce((s, c) => s + c.unread, 0);

    const showToast = useCallback((msg: string) => { message.info(msg); }, []);

    // ── Nav helper ──────────────────────────────────────
    const goTo = useCallback((view: ActiveView) => {
        setActiveView(view);
        setExpandedThread(null);
        setReplyText('');
        if (view === 'notificari') {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }
        if (view === 'mesaje') {
            setConversations((prev) => prev.map((c) => activeConv === c.id ? { ...c, unread: 0 } : c));
        }
    }, [activeConv]);

    // ── Thread actions — delegate to ForumContext (API-backed) ───────────────────────────────────
    const handleLike = forum.handleLike;
    const handleRepost = forum.handleRepost;
    const handleBookmark = forum.handleBookmark;
    const handleReplyLike = forum.handleReplyLike;
    const handlePollVote = forum.handlePollVote;
    const handleFollow = forum.handleFollow;

    const handlePublish = useCallback(() => {
        if (!composeText.trim()) return;
        forum.handlePublish(composeText, composeCategory, userName, userAvatar, userHandle);
        setComposeText('');
    }, [composeText, composeCategory, userName, userAvatar, userHandle, forum]);

    const handleReplySubmit = useCallback(() => {
        if (!replyText.trim() || expandedThread === null) return;
        forum.handleReplySubmit(replyText, expandedThread, userName, userAvatar, userHandle);
        setReplyText('');
    }, [replyText, expandedThread, userName, userAvatar, userHandle, forum]);

    // ── Messages ────────────────────────────────────────
    const openConversation = useCallback((convId: number) => {
        setActiveConv(convId);
        setConversations((prev) => prev.map((c) => c.id === convId ? { ...c, unread: 0 } : c));
    }, []);

    const sendMessage = useCallback(() => {
        if (!msgInput.trim() || activeConv === null) return;
        const newMsg = { id: Date.now(), from: 'me' as const, text: msgInput.trim(), time: 'acum' };
        setConversations((prev) => prev.map((c) => c.id === activeConv
            ? { ...c, messages: [...c.messages, newMsg], lastMessage: msgInput.trim(), time: 'acum' }
            : c
        ));
        setMsgInput('');
    }, [msgInput, activeConv]);

    const filteredThreads = useMemo(() => {
        let result = threads;
        if (activeCategory !== 'Toate') result = result.filter((t) => t.category === activeCategory);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((t) => t.content.toLowerCase().includes(q) || t.author.toLowerCase().includes(q));
        }
        return [...result].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    }, [threads, activeCategory, searchQuery]);

    const savedThreads  = useMemo(() => threads.filter((t) => t.bookmarked), [threads]);
    const expandedData  = expandedThread !== null ? threads.find((t) => t.id === expandedThread) : null;
    const activeConvData = activeConv !== null ? conversations.find((c) => c.id === activeConv) : null;

    const MAX_CHARS = 500;
    const charsLeft = MAX_CHARS - composeText.length;

    const sxComposeTool = {
        background: 'none', border: 'none', color: ft.cyan, opacity: 0.6,
        p: '8px', borderRadius: '50%', cursor: 'pointer', transition: 'all .15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        '&:hover': { opacity: 1, bgcolor: 'rgba(0,200,255,0.08)' },
    };

    const sxPollOption = (voted: boolean) => ({
        position: 'relative', borderRadius: '10px', overflow: 'hidden',
        border: `1px solid ${ft.border2}`, cursor: voted ? 'default' : 'pointer',
        transition: 'border-color .15s',
        '&:hover': voted ? {} : { borderColor: ft.cyan },
    });

    // ── Shared thread card renderer ──────────────────────
    const renderThread = (thread: ForumThread, idx: number) => (
        <Box key={thread.id}>
            {thread.pinned && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '.72rem', color: ft.muted, fontWeight: 600, pt: '12px', pl: '58px' }}>
                    {Icons.pin} Postare fixată
                </Box>
            )}
            <Box sx={{ ...sxThread, animationDelay: `${idx * 40}ms` }} onClick={() => { setActiveView('feed'); setExpandedThread(thread.id); }}>
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
                        <Box sx={sxActions} onClick={(e) => e.stopPropagation()}>
                            <Box component="button" sx={{ ...sxAction, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.cyan } }}>{Icons.reply} <span>{thread.replies.length}</span></Box>
                            <Box component="button" sx={{ ...sxAction, color: thread.reposted ? ft.green : ft.muted, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.green } }} onClick={(e) => handleRepost(thread.id, e)}>{Icons.repost} <span>{formatCount(thread.reposts)}</span></Box>
                            <Box component="button" sx={{ ...sxAction, color: thread.liked ? ft.red : ft.muted, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.red }, animation: heartAnims.has(thread.id) ? 'heartPop .35s ease' : 'none' }} onClick={(e) => handleLike(thread.id, e)}>
                                {thread.liked ? Icons.heartFilled : Icons.heart} <span>{formatCount(thread.likes)}</span>
                            </Box>
                            <Box component="button" sx={{ ...sxAction, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.cyan } }}>{Icons.views} <span>{formatCount(thread.views)}</span></Box>
                            <Box component="button" sx={{ ...sxAction, color: thread.bookmarked ? ft.cyan : ft.muted, '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.cyan } }} onClick={(e) => handleBookmark(thread.id, e)}>
                                {thread.bookmarked ? Icons.bookmarkFilled : Icons.bookmark}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <>
            <style>{fontImportCSS}{keyframesCSS}</style>
            <Navbar />
            <Box sx={{ ...sxPageRoot, pt: '80px' }}>
                <Box sx={sxBody}>

                    {/* ══════════ LEFT SIDEBAR ══════════ */}
                    <Box component="aside" sx={sxSidebar}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', p: '12px 14px', mb: '12px', cursor: 'pointer' }} onClick={() => navigate({ to: ROUTES.COMMUNITY })}>
                            <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: `linear-gradient(135deg, ${ft.blue}, ${ft.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ft.fontCondensed, fontWeight: 900, fontSize: '.85rem', color: '#fff' }}>FM</Box>
                            <Box className="sidebar-text" sx={{ fontFamily: ft.fontCondensed, fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px', color: '#fff' }}>
                                Fit<Box component="span" sx={{ color: ft.cyan }}>Forum</Box>
                            </Box>
                        </Box>

                        {/* Feed */}
                        <Box component="button" sx={activeView === 'feed' ? sxNavItemActive : sxNavItem} className="nav-item" onClick={() => goTo('feed')}>
                            <Box component="span" sx={activeView === 'feed' ? sxNavIconActive : sxNavIcon}>🏠</Box>
                            <Box component="span" className="sidebar-text">Feed</Box>
                        </Box>

                        {/* Comunitate */}
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.COMMUNITY })}>
                            <Box component="span" sx={sxNavIcon}>👥</Box>
                            <Box component="span" className="sidebar-text">Comunitate</Box>
                        </Box>

                        {/* Notificări */}
                        <Box component="button" sx={activeView === 'notificari' ? sxNavItemActive : sxNavItem} className="nav-item" onClick={() => goTo('notificari')}>
                            <Box component="span" sx={activeView === 'notificari' ? sxNavIconActive : sxNavIcon}>🔔</Box>
                            <Box component="span" className="sidebar-text">Notificări</Box>
                            {unreadNotifs > 0 && <Box component="span" sx={sxNavBadge} className="nav-badge">{unreadNotifs}</Box>}
                        </Box>

                        {/* Mesaje */}
                        <Box component="button" sx={activeView === 'mesaje' ? sxNavItemActive : sxNavItem} className="nav-item" onClick={() => goTo('mesaje')}>
                            <Box component="span" sx={activeView === 'mesaje' ? sxNavIconActive : sxNavIcon}>✉️</Box>
                            <Box component="span" className="sidebar-text">Mesaje</Box>
                            {unreadMsgs > 0 && <Box component="span" sx={sxNavBadge} className="nav-badge">{unreadMsgs}</Box>}
                        </Box>

                        {/* Salvate */}
                        <Box component="button" sx={activeView === 'salvate' ? sxNavItemActive : sxNavItem} className="nav-item" onClick={() => goTo('salvate')}>
                            <Box component="span" sx={activeView === 'salvate' ? sxNavIconActive : sxNavIcon}>🔖</Box>
                            <Box component="span" className="sidebar-text">Salvate</Box>
                            {savedThreads.length > 0 && <Box component="span" sx={sxNavBadge} className="nav-badge">{savedThreads.length}</Box>}
                        </Box>

                        {/* Profil */}
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.PROFILE })}>
                            <Box component="span" sx={sxNavIcon}>👤</Box>
                            <Box component="span" className="sidebar-text">Profil</Box>
                        </Box>

                        <Box component="button" sx={sxPostBtn} className="sidebar-text" onClick={() => { goTo('feed'); setTimeout(() => composeRef.current?.focus(), 100); }}>
                            Postează
                        </Box>
                    </Box>

                    {/* ══════════ MAIN CONTENT ══════════ */}
                    <Box component="main" sx={sxMain}>

                        {/* ══ SALVATE VIEW ══ */}
                        {activeView === 'salvate' && (
                            <>
                                <Box sx={{ ...sxHeaderBase, p: '16px 20px 14px', borderBottom: `1px solid ${ft.border}` }}>
                                    <Box sx={sxHeaderTitle}>🔖 Salvate</Box>
                                    <Box sx={{ fontSize: '.82rem', color: ft.muted, mt: '2px' }}>
                                        {savedThreads.length} {savedThreads.length === 1 ? 'postare salvată' : 'postări salvate'}
                                    </Box>
                                </Box>
                                {savedThreads.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', p: '64px 24px', color: ft.muted }}>
                                        <Box sx={{ fontSize: '2.5rem', mb: '14px', opacity: 0.5 }}>🔖</Box>
                                        <Box sx={{ fontFamily: ft.fontCondensed, fontSize: '1.2rem', fontWeight: 700, color: '#fff', mb: '6px' }}>Nicio postare salvată</Box>
                                        <Box sx={{ fontSize: '.85rem', lineHeight: 1.6 }}>Apasă iconița 🔖 pe orice postare pentru a o salva aici.</Box>
                                    </Box>
                                ) : (
                                    savedThreads.map((thread, idx) => renderThread(thread, idx))
                                )}
                            </>
                        )}

                        {/* ══ NOTIFICĂRI VIEW ══ */}
                        {activeView === 'notificari' && (
                            <>
                                <Box sx={{ ...sxHeaderBase, p: '16px 20px 14px', borderBottom: `1px solid ${ft.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={sxHeaderTitle}>🔔 Notificări</Box>
                                    <Box component="button" sx={{ background: 'none', border: 'none', color: ft.cyan, fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', opacity: 0.8, '&:hover': { opacity: 1 } }}
                                         onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}>
                                        Marchează toate ca citite
                                    </Box>
                                </Box>
                                {notifications.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', p: '64px 24px', color: ft.muted }}>
                                        <Box sx={{ fontSize: '2.5rem', mb: '14px', opacity: 0.5 }}>🔔</Box>
                                        <Box sx={{ fontFamily: ft.fontCondensed, fontSize: '1.2rem', fontWeight: 700, color: '#fff', mb: '6px' }}>Nicio notificare</Box>
                                    </Box>
                                ) : (
                                    notifications.map((notif, idx) => {
                                        const { icon, label } = notifIcon(notif.type);
                                        return (
                                            <Box key={notif.id} sx={{
                                                display: 'flex', gap: '14px', p: '14px 20px',
                                                borderBottom: `1px solid ${ft.border}`,
                                                bgcolor: notif.read ? 'transparent' : 'rgba(26,111,255,0.05)',
                                                cursor: 'pointer', transition: 'background .15s',
                                                animation: 'forumFadeIn .3s ease both',
                                                animationDelay: `${idx * 30}ms`,
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                                            }}>
                                                {/* Notif type icon */}
                                                <Box sx={{ fontSize: '1.3rem', width: 28, flexShrink: 0, textAlign: 'center', mt: '2px' }}>{icon}</Box>
                                                {/* Avatar */}
                                                <Box sx={{ ...sxThreadAva, width: 38, height: 38, fontSize: '.75rem', background: notif.fromColor, flexShrink: 0 }}>{notif.fromAvatar}</Box>
                                                {/* Content */}
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Box sx={{ fontSize: '.88rem', lineHeight: 1.5, mb: '4px' }}>
                                                        <Box component="span" sx={{ fontWeight: 700 }}>{notif.fromUser}</Box>
                                                        <Box component="span" sx={{ color: ft.muted }}> {notif.fromHandle}</Box>
                                                        <Box component="span" sx={{ color: ft.text }}> {label}</Box>
                                                    </Box>
                                                    {notif.threadContent && (
                                                        <Box sx={{ fontSize: '.78rem', color: ft.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%', p: '6px 10px', bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: `1px solid ${ft.border}`, mb: '4px' }}>
                                                            "{notif.threadContent}"
                                                        </Box>
                                                    )}
                                                    {notif.replyContent && (
                                                        <Box sx={{ fontSize: '.78rem', color: ft.text, p: '6px 10px', bgcolor: 'rgba(0,200,255,0.06)', borderRadius: '8px', border: `1px solid ${ft.border2}`, mb: '4px' }}>
                                                            💬 "{notif.replyContent}"
                                                        </Box>
                                                    )}
                                                    <Box sx={{ fontSize: '.72rem', color: ft.muted }}>{notif.time}</Box>
                                                </Box>
                                                {/* Unread dot */}
                                                {!notif.read && (
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: ft.blue, flexShrink: 0, alignSelf: 'center' }} />
                                                )}
                                            </Box>
                                        );
                                    })
                                )}
                            </>
                        )}

                        {/* ══ MESAJE VIEW ══ */}
                        {activeView === 'mesaje' && (
                            <>
                                <Box sx={{ ...sxHeaderBase, p: '16px 20px 14px', borderBottom: `1px solid ${ft.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {activeConvData && (
                                        <Box component="button" sx={{ background: 'none', border: 'none', color: ft.text, cursor: 'pointer', p: '6px', borderRadius: '50%', display: 'flex', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
                                             onClick={() => setActiveConv(null)}>
                                            {Icons.back}
                                        </Box>
                                    )}
                                    <Box sx={sxHeaderTitle}>
                                        {activeConvData ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <Box sx={{ ...sxThreadAva, width: 32, height: 32, fontSize: '.7rem', background: activeConvData.color }}>{activeConvData.avatar}</Box>
                                                <Box>
                                                    <Box sx={{ fontSize: '.95rem', fontWeight: 700 }}>{activeConvData.user}</Box>
                                                    <Box sx={{ fontSize: '.72rem', color: ft.muted, fontWeight: 400 }}>{activeConvData.handle}</Box>
                                                </Box>
                                            </Box>
                                        ) : '✉️ Mesaje'}
                                    </Box>
                                </Box>

                                {!activeConvData ? (
                                    /* Conversations list */
                                    conversations.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', p: '64px 24px', color: ft.muted }}>
                                            <Box sx={{ fontSize: '2.5rem', mb: '14px', opacity: 0.5 }}>✉️</Box>
                                            <Box sx={{ fontFamily: ft.fontCondensed, fontSize: '1.2rem', fontWeight: 700, color: '#fff', mb: '6px' }}>Nicio conversație</Box>
                                        </Box>
                                    ) : (
                                        conversations.map((conv, idx) => (
                                            <Box key={conv.id} sx={{
                                                display: 'flex', gap: '14px', p: '14px 20px',
                                                borderBottom: `1px solid ${ft.border}`,
                                                cursor: 'pointer', transition: 'background .15s',
                                                bgcolor: conv.unread > 0 ? 'rgba(26,111,255,0.05)' : 'transparent',
                                                animation: 'forumFadeIn .3s ease both',
                                                animationDelay: `${idx * 40}ms`,
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                                            }} onClick={() => openConversation(conv.id)}>
                                                <Box sx={{ ...sxThreadAva, width: 44, height: 44, fontSize: '.82rem', background: conv.color, flexShrink: 0 }}>{conv.avatar}</Box>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '3px' }}>
                                                        <Box sx={{ fontWeight: conv.unread > 0 ? 700 : 600, fontSize: '.9rem' }}>{conv.user}</Box>
                                                        <Box sx={{ fontSize: '.72rem', color: ft.muted }}>{conv.time}</Box>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box sx={{ fontSize: '.82rem', color: conv.unread > 0 ? ft.text : ft.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '85%' }}>
                                                            {conv.lastMessage}
                                                        </Box>
                                                        {conv.unread > 0 && (
                                                            <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: ft.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                                                                {conv.unread}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))
                                    )
                                ) : (
                                    /* Chat view */
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
                                        {/* Messages */}
                                        <Box sx={{ flex: 1, overflowY: 'auto', p: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {activeConvData.messages.map((msg) => (
                                                <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                                                    <Box sx={{
                                                        maxWidth: '70%', p: '10px 14px', borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                                        bgcolor: msg.from === 'me' ? ft.blue : 'rgba(255,255,255,0.08)',
                                                        fontSize: '.88rem', lineHeight: 1.5,
                                                    }}>
                                                        {msg.text}
                                                        <Box sx={{ fontSize: '.65rem', color: msg.from === 'me' ? 'rgba(255,255,255,0.6)' : ft.muted, mt: '4px', textAlign: msg.from === 'me' ? 'right' : 'left' }}>
                                                            {msg.time}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                        {/* Input */}
                                        <Box sx={{ p: '12px 20px', borderTop: `1px solid ${ft.border}`, display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <Box
                                                component="input"
                                                sx={{
                                                    flex: 1, p: '10px 16px', borderRadius: 100,
                                                    bgcolor: 'rgba(255,255,255,0.06)', border: `1px solid ${ft.border}`,
                                                    color: ft.text, fontFamily: ft.font, fontSize: '.88rem',
                                                    outline: 'none', transition: 'border-color .15s',
                                                    '&:focus': { borderColor: ft.blue },
                                                    '&::placeholder': { color: ft.muted },
                                                }}
                                                placeholder="Scrie un mesaj..."
                                                value={msgInput}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMsgInput(e.target.value)}
                                                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && sendMessage()}
                                            />
                                            <Box component="button" sx={{
                                                p: '10px 20px', borderRadius: 100, border: 'none',
                                                bgcolor: msgInput.trim() ? ft.blue : 'rgba(255,255,255,0.08)',
                                                color: '#fff', fontFamily: ft.fontCondensed, fontWeight: 700,
                                                fontSize: '.82rem', cursor: msgInput.trim() ? 'pointer' : 'not-allowed',
                                                transition: 'all .15s', '&:hover': { bgcolor: msgInput.trim() ? '#2a7fff' : undefined },
                                            }} onClick={sendMessage} disabled={!msgInput.trim()}>
                                                Trimite
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </>
                        )}

                        {/* ══ FEED VIEW ══ */}
                        {activeView === 'feed' && (
                            <>
                                <Box sx={{ ...sxHeaderBase, p: 0, borderBottom: `1px solid ${ft.border}` }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', p: '16px 20px 12px' }}>
                                        {expandedThread !== null && (
                                            <Box component="button" sx={{ background: 'none', border: 'none', color: ft.text, cursor: 'pointer', p: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
                                                 onClick={() => { setExpandedThread(null); setReplyText(''); }}>
                                                {Icons.back}
                                            </Box>
                                        )}
                                        <Box sx={sxHeaderTitle}>{expandedThread !== null ? 'Postare' : 'Forum'}</Box>
                                    </Box>
                                    {expandedThread === null && (
                                        <Box sx={sxTabs}>
                                            {FORUM_CATEGORIES.map((cat) => (
                                                <Box component="button" key={cat} sx={sxTab(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>{cat}</Box>
                                            ))}
                                        </Box>
                                    )}
                                </Box>

                                {/* Expanded thread */}
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
                                                                const isWinner = expandedData.poll!.voted && opt.votes === Math.max(...expandedData.poll!.options.map((o) => o.votes));
                                                                return (
                                                                    <Box key={idx} sx={sxPollOption(!!expandedData.poll!.voted)} onClick={() => !expandedData.poll!.voted && handlePollVote(expandedData.id, idx)}>
                                                                        {expandedData.poll!.voted && <Box sx={{ position: 'absolute', inset: 0, borderRadius: '10px', bgcolor: isWinner ? 'rgba(0,200,255,0.15)' : 'rgba(26,111,255,0.12)', width: `${pct}%`, transition: 'width .6s cubic-bezier(.22,1,.36,1)' }} />}
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
                                            <Box component="textarea" sx={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: ft.text, fontFamily: ft.font, fontSize: '.92rem', resize: 'none', minHeight: 40, p: '8px 0', fieldSizing: 'content', overflow: 'hidden', '&::placeholder': { color: ft.muted } }}
                                                 placeholder="Scrie un răspuns..."
                                                 value={replyText}
                                                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
                                            />
                                            <Box component="button" sx={{ p: '7px 18px', borderRadius: 100, border: 'none', bgcolor: ft.blue, color: '#fff', fontFamily: ft.fontCondensed, fontWeight: 700, fontSize: '.8rem', cursor: 'pointer', transition: 'all .15s', alignSelf: 'flex-end', '&:hover:not(:disabled)': { bgcolor: '#2a7fff' }, '&:disabled': { opacity: 0.4, cursor: 'not-allowed' } }}
                                                 disabled={!replyText.trim()} onClick={handleReplySubmit}>Răspunde</Box>
                                        </Box>

                                        {/* Replies */}
                                        {expandedData.replies.map((reply, idx) => (
                                            <Box key={reply.id} sx={{ p: '14px 20px', borderBottom: `1px solid ${ft.border}`, display: 'flex', gap: '12px', animation: 'forumFadeIn .3s ease both', animationDelay: `${idx * 50}ms` }}>
                                                <Box sx={{ ...sxThreadAva, width: 36, height: 36, fontSize: '.75rem', background: reply.color }}>{reply.avatar}</Box>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Box sx={sxThreadMeta}>
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
                                        {/* Compose box */}
                                        <Box sx={{ p: '16px 20px', borderBottom: `1px solid ${ft.border}`, display: 'flex', gap: '14px' }}>
                                            <Box sx={{ ...sxThreadAva, background: `linear-gradient(135deg, ${ft.blue}, ${ft.cyan})` }}>{userAvatar}</Box>
                                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <Box component="textarea" ref={composeRef}
                                                     sx={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: ft.text, fontFamily: ft.font, fontSize: '1.1rem', resize: 'none', minHeight: 54, p: '8px 0', lineHeight: 1.5, fieldSizing: 'content', overflow: 'hidden', '&::placeholder': { color: ft.muted } }}
                                                     placeholder="Ce se întâmplă în lumea fitness?"
                                                     value={composeText}
                                                     onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComposeText(e.target.value.slice(0, MAX_CHARS + 50))}
                                                />
                                                <Box sx={{ height: 1, bgcolor: ft.border, my: '8px' }} />
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Box sx={{ display: 'flex', gap: '2px' }}>
                                                        <Box component="button" sx={sxComposeTool} title="Imagine">{Icons.image}</Box>
                                                        <Box component="button" sx={sxComposeTool} title="GIF">{Icons.gif}</Box>
                                                        <Box component="button" sx={sxComposeTool} title="Sondaj">{Icons.poll}</Box>
                                                        <Box component="button" sx={sxComposeTool} title="Emoji">{Icons.emoji}</Box>
                                                        <select style={{ background: 'transparent', border: `1px solid ${ft.border}`, borderRadius: 100, padding: '4px 10px', color: ft.cyan, fontSize: '.74rem', fontWeight: 600, outline: 'none', cursor: 'pointer', fontFamily: ft.font }}
                                                                value={composeCategory} onChange={(e) => setComposeCategory(e.target.value as ForumCategory)}>
                                                            {FORUM_CATEGORIES.filter((c) => c !== 'Toate').map((c) => (
                                                                <option key={c} value={c} style={{ background: '#0a1628' }}>{c}</option>
                                                            ))}
                                                        </select>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {composeText.length > 0 && (
                                                            <Box component="span" sx={{ fontSize: '.72rem', mr: '12px', color: charsLeft <= 0 ? ft.red : charsLeft <= 50 ? '#ff9100' : ft.muted }}>{charsLeft}</Box>
                                                        )}
                                                        <Box component="button" sx={{ p: '8px 22px', borderRadius: 100, border: 'none', bgcolor: ft.blue, color: '#fff', fontFamily: ft.fontCondensed, fontWeight: 700, fontSize: '.85rem', letterSpacing: '.5px', cursor: 'pointer', transition: 'all .15s', '&:hover:not(:disabled)': { bgcolor: '#2a7fff', boxShadow: `0 0 16px rgba(26,111,255,.4)` }, '&:disabled': { opacity: 0.4, cursor: 'not-allowed' } }}
                                                             disabled={!composeText.trim() || charsLeft < 0} onClick={handlePublish}>Postează</Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Threads */}
                                        {threadsLoading ? (
                                            <Box sx={{ textAlign: 'center', p: '64px 24px', color: ft.muted }}>
                                                <Box sx={{ fontSize: '.9rem' }}>Se încarcă postările...</Box>
                                            </Box>
                                        ) : filteredThreads.length === 0 ? (
                                            <Box sx={{ textAlign: 'center', p: '64px 24px', color: ft.muted }}>
                                                <Box sx={{ fontSize: '2.5rem', mb: '14px', opacity: 0.5 }}>🔍</Box>
                                                <Box sx={{ fontFamily: ft.fontCondensed, fontSize: '1.2rem', fontWeight: 700, color: '#fff', mb: '6px' }}>Nicio postare găsită</Box>
                                                <Box sx={{ fontSize: '.85rem', lineHeight: 1.6 }}>Încearcă altă categorie sau scrie prima postare!</Box>
                                            </Box>
                                        ) : (
                                            filteredThreads.map((thread, idx) => renderThread(thread, idx))
                                        )}
                                    </>
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

                        <Box sx={{ bgcolor: ft.card, border: `1px solid ${ft.border}`, borderRadius: ft.radius, overflow: 'hidden' }}>
                            <Box sx={{ p: '16px 18px', fontFamily: ft.fontCondensed, fontWeight: 800, fontSize: '1.15rem', letterSpacing: '.5px' }}>🔥 Trending</Box>
                            {TRENDING_TOPICS.slice(0, 4).map((topic) => (
                                <Box key={topic.id} sx={{ p: '12px 18px', borderTop: `1px solid ${ft.border}`, cursor: 'pointer', transition: 'background .15s', '&:hover': { bgcolor: 'rgba(0,200,255,0.03)' } }} onClick={() => { setSearchQuery(topic.tag); goTo('feed'); }}>
                                    <Box sx={{ fontSize: '.7rem', color: ft.muted, fontWeight: 600, letterSpacing: '.5px' }}>{topic.category}</Box>
                                    <Box sx={{ fontWeight: 700, fontSize: '.92rem', my: '2px' }}>{topic.tag}</Box>
                                    <Box sx={{ fontSize: '.72rem', color: ft.muted }}>{formatCount(topic.posts)} postări</Box>
                                </Box>
                            ))}
                        </Box>

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

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', px: '4px' }}>
                            {['Termeni', 'Confidențialitate', 'Cookies', 'Accesibilitate'].map((l) => (
                                <Box component="a" key={l} href="#" sx={{ fontSize: '.7rem', color: ft.muted, textDecoration: 'none', transition: 'color .15s', '&:hover': { color: ft.text, textDecoration: 'underline' } }}>{l}</Box>
                            ))}
                            <Box component="span" sx={{ fontSize: '.7rem', color: ft.muted }}>© 2026 FitMoldova</Box>
                        </Box>
                    </Box>

                </Box>
            </Box>
        </>
    );
}