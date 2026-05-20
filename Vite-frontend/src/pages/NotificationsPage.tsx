import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Box from '@mui/material/Box';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useForumContext } from '../context/ForumContext';
import {
    ft, fontImportCSS, keyframesCSS,
    sxPageRoot, sxBody, sxSidebar, sxNavItem, sxNavItemActive,
    sxNavIcon, sxNavIconActive, sxNavBadge, sxPostBtn, sxMain,
    sxHeader, sxHeaderTitle, sxEmpty, sxEmptyIcon, sxEmptyTitle,
    sxEmptySub, sxToast, sxTab, sxTabs,
} from '../styles/forumStyles';
import notificationApi from '../services/api/notificationApi';
import type { NotificationInfoDto } from '../types/Notification';
import { signalRService } from '../services/signalRService';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = 'like' | 'reply' | 'follow' | 'repost' | 'mention' | 'bookmark' | 'club_post';

interface Notification {
    id: number;
    type: NotifType;
    fromName: string;
    fromHandle: string;
    fromAvatar: string;
    fromColor: string;
    content?: string;
    time: string;
    read: boolean;
    postId?: number;
    clubId?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convertește NotificationInfoDto (backend) → Notification (local UI) */
function dtoToNotif(dto: NotificationInfoDto): Notification {
    const createdAt = new Date(dto.createdAt);
    const diffMs    = Date.now() - createdAt.getTime();
    const diffMin   = Math.floor(diffMs / 60_000);
    let time: string;
    if (diffMin < 1)         time = 'acum';
    else if (diffMin < 60)   time = `${diffMin} min`;
    else if (diffMin < 1440) time = `${Math.floor(diffMin / 60)}h`;
    else                     time = `${Math.floor(diffMin / 1440)}z`;

    return {
        id:         dto.id,
        type:       dto.type as NotifType,
        fromName:   dto.fromUserName,
        fromHandle: dto.fromUserHandle,
        fromAvatar: dto.fromUserAvatar,
        fromColor:  dto.fromUserColor,
        content:    dto.content,
        time,
        read:       dto.isRead,
        postId:     dto.postId,
        clubId:     dto.clubId,
    };
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────

const NOTIF_ICONS: Record<NotifType, { icon: string; color: string }> = {
    like:      { icon: '❤️',  color: '#ff4d6d' },
    reply:     { icon: '💬',  color: '#00c8ff' },
    follow:    { icon: '👤',  color: '#00b894' },
    repost:    { icon: '🔁',  color: '#00b894' },
    mention:   { icon: '@',   color: '#1a6fff' },
    bookmark:  { icon: '🔖',  color: '#00c8ff' },
    club_post: { icon: '🏋️', color: '#10b981' },
};

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS = ['Toate', 'Aprecieri', 'Răspunsuri', 'Urmăritori', 'Mențiuni', 'Cluburi'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
    const navigate = useNavigate();
    const { toast } = useForumContext();

    const [notifs, setNotifs]       = useState<Notification[]>([]);
    const [activeTab, setActiveTab] = useState('Toate');
    const [loading, setLoading]     = useState(true);

    // ── Încarcă notificările de la API; fallback la mock dacă backend-ul nu e gata ──
    useEffect(() => {
        let cancelled = false;
        notificationApi.getAll()
            .then((dtos) => {
                if (!cancelled) {
                    setNotifs(dtos.map(dtoToNotif));
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    // ── SignalR — ascultă notificări push în timp real ───────────────────────
    useEffect(() => {
        const token = localStorage.getItem('fitmoldova_token');
        if (!token) return;

        signalRService.start(token);

        const handler = (...args: unknown[]) => {
            // SignalR trimite payload-ul ca prim argument
            const payload = args[0] as { type: string; content: string; postId?: number; clubId?: number };
            const newNotif: Notification = {
                id:         Date.now(),
                type:       payload.type as NotifType,
                fromName:   'Club',
                fromHandle: '',
                fromAvatar: '🏋',
                fromColor:  '#10b981',
                content:    payload.content,
                time:       'acum',
                read:       false,
                postId:     payload.postId,
                clubId:     payload.clubId,
            };
            setNotifs((prev) => [newNotif, ...prev]);
        };

        signalRService.on('ReceiveNotification', handler);
        return () => { signalRService.off('ReceiveNotification', handler); };
    }, []);

    const unreadCount = notifs.filter((n) => !n.read).length;

    const filtered = useMemo(() => {
        if (activeTab === 'Toate') return notifs;
        const map: Record<string, NotifType[]> = {
            'Aprecieri':  ['like'],
            'Răspunsuri': ['reply'],
            'Urmăritori': ['follow'],
            'Mențiuni':   ['mention', 'repost', 'bookmark'],
            'Cluburi':    ['club_post'],
        };
        return notifs.filter((n) => map[activeTab]?.includes(n.type));
    }, [notifs, activeTab]);

    const markAllRead = () => {
        setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
        notificationApi.markAllAsRead().catch(() => {}); // fire-and-forget
    };

    const markRead = (id: number) => {
        setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
        notificationApi.markAsRead(id).catch(() => {}); // fire-and-forget
    };

    const dismiss = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifs((prev) => prev.filter((n) => n.id !== id));
        notificationApi.delete(id).catch(() => {}); // fire-and-forget
    };

    const dismissIcon = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );

    const totalLikes    = notifs.filter((n) => n.type === 'like').length;
    const totalReplies  = notifs.filter((n) => n.type === 'reply').length;
    const totalFollows  = notifs.filter((n) => n.type === 'follow').length;
    const totalMentions = notifs.filter((n) => n.type === 'mention').length;

    return (
        <>
            <style>{fontImportCSS}{keyframesCSS}</style>
            <Navbar />
            <Box sx={sxPageRoot}>
                <Box sx={sxBody}>

                    {/* ── SIDEBAR ── */}
                    <Box component="aside" sx={sxSidebar}>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.FEED })}>
                            <Box component="span" sx={sxNavIcon}>🏠</Box>
                            <Box component="span" className="sidebar-text">Feed</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.FORUM })}>
                            <Box component="span" sx={sxNavIcon}>💬</Box>
                            <Box component="span" className="sidebar-text">Forum</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.COMMUNITY })}>
                            <Box component="span" sx={sxNavIcon}>👥</Box>
                            <Box component="span" className="sidebar-text">Comunitate</Box>
                        </Box>
                        <Box component="button" sx={sxNavItemActive} className="nav-item">
                            <Box component="span" sx={sxNavIconActive}>🔔</Box>
                            <Box component="span" className="sidebar-text">Notificări</Box>
                            {unreadCount > 0 && (
                                <Box component="span" sx={sxNavBadge} className="nav-badge">
                                    {unreadCount}
                                </Box>
                            )}
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.SAVED })}>
                            <Box component="span" sx={sxNavIcon}>🔖</Box>
                            <Box component="span" className="sidebar-text">Salvate</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.PROFILE })}>
                            <Box component="span" sx={sxNavIcon}>👤</Box>
                            <Box component="span" className="sidebar-text">Profil</Box>
                        </Box>
                        <Box component="button" sx={sxPostBtn} className="sidebar-text" onClick={() => navigate({ to: ROUTES.FORUM })}>
                            Postează
                        </Box>
                    </Box>

                    {/* ── MAIN ── */}
                    <Box component="main" sx={sxMain}>

                        {/* Header */}
                        <Box sx={{ ...sxHeader, bgcolor: 'rgba(5,13,26,0.9)' }}>
                            <Box>
                                <Box sx={sxHeaderTitle}>🔔 Notificări</Box>
                                <Box sx={{ fontSize: '.78rem', color: ft.muted, mt: '2px' }}>
                                    {loading
                                        ? 'Se încarcă...'
                                        : unreadCount > 0
                                            ? `${unreadCount} necitite`
                                            : 'Toate citite ✓'}
                                </Box>
                            </Box>
                            {!loading && unreadCount > 0 && (
                                <Box
                                    component="button"
                                    sx={{
                                        background: 'none',
                                        border: `1.5px solid ${ft.border2}`,
                                        borderRadius: 100,
                                        color: ft.cyan,
                                        fontFamily: ft.font,
                                        fontSize: '.78rem',
                                        fontWeight: 600,
                                        p: '6px 16px',
                                        cursor: 'pointer',
                                        transition: 'all .15s',
                                        whiteSpace: 'nowrap',
                                        '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', borderColor: ft.cyan },
                                    }}
                                    onClick={markAllRead}
                                >
                                    Marchează toate ca citite
                                </Box>
                            )}
                        </Box>

                        {/* Filter tabs */}
                        <Box sx={{ ...sxTabs, borderBottom: `1px solid ${ft.border}` }}>
                            {FILTER_TABS.map((tab) => (
                                <Box
                                    component="button"
                                    key={tab}
                                    sx={{ ...sxTab(activeTab === tab), p: '12px 18px', fontSize: '.8rem' }}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </Box>
                            ))}
                        </Box>

                        {/* Loading spinner */}
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: '48px' }}>
                                <Box sx={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    border: `3px solid rgba(26,111,255,0.18)`,
                                    borderTopColor: ft.blue,
                                    animation: 'notifSpin 0.7s linear infinite',
                                }} />
                                <style>{`@keyframes notifSpin { to { transform: rotate(360deg); } }`}</style>
                            </Box>
                        )}

                        {/* Notifications list */}
                        {!loading && (filtered.length === 0 ? (
                            <Box sx={sxEmpty}>
                                <Box sx={sxEmptyIcon}>🔔</Box>
                                <Box sx={sxEmptyTitle}>Nicio notificare</Box>
                                <Box sx={sxEmptySub}>
                                    {activeTab === 'Toate'
                                        ? 'Vei primi notificări când cineva îți apreciază sau răspunde la postări.'
                                        : `Nicio notificare în categoria „${activeTab}".`}
                                </Box>
                            </Box>
                        ) : (
                            filtered.map((notif, idx) => {
                                const meta   = NOTIF_ICONS[notif.type];
                                const isText = notif.type === 'mention';
                                return (
                                    <Box
                                        key={notif.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '14px',
                                            p: '16px 20px',
                                            borderBottom: `1px solid ${ft.border}`,
                                            cursor: 'pointer',
                                            transition: 'background .15s',
                                            animation: 'forumFadeIn .3s ease both',
                                            animationDelay: `${idx * 40}ms`,
                                            position: 'relative',
                                            bgcolor: notif.read ? 'transparent' : 'rgba(26,111,255,0.04)',
                                            '&:hover': { bgcolor: notif.read ? 'rgba(0,200,255,0.025)' : 'rgba(26,111,255,0.07)' },
                                            '&:hover .notif-dismiss': { opacity: 1 },
                                        }}
                                        onClick={() => {
                                            markRead(notif.id);
                                            if (notif.type === 'club_post' && notif.postId) {
                                                navigate({ to: ROUTES.FORUM, search: { postId: String(notif.postId) } });
                                            } else {
                                                navigate({ to: ROUTES.FORUM });
                                            }
                                        }}
                                    >
                                        {/* Unread indicator bar */}
                                        {!notif.read && (
                                            <Box sx={{
                                                position: 'absolute', left: 0, top: 0, bottom: 0,
                                                width: 3, bgcolor: ft.blue, borderRadius: '0 2px 2px 0',
                                            }} />
                                        )}

                                        {/* Avatar + type icon */}
                                        <Box sx={{ position: 'relative', flexShrink: 0 }}>
                                            <Box sx={{
                                                width: 44, height: 44, borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 900, fontSize: '.85rem', color: '#fff',
                                                bgcolor: notif.fromColor,
                                            }}>
                                                {notif.fromAvatar}
                                            </Box>
                                            <Box sx={{
                                                position: 'absolute', bottom: -2, right: -4,
                                                width: 20, height: 20, borderRadius: '50%',
                                                bgcolor: isText ? ft.blue : ft.bg,
                                                border: `2px solid ${ft.bg}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: isText ? '.58rem' : '.8rem',
                                                fontWeight: isText ? 900 : 400,
                                                color: isText ? '#fff' : undefined,
                                                lineHeight: 1,
                                            }}>
                                                {isText ? '@' : meta.icon}
                                            </Box>
                                        </Box>

                                        {/* Content */}
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ fontSize: '.88rem', lineHeight: 1.55, color: ft.contentColor, mb: '4px' }}>
                                                <strong style={{ color: '#fff', fontWeight: 700 }}>{notif.fromName}</strong>{' '}
                                                {notif.content}
                                            </Box>
                                            <Box sx={{ fontSize: '.74rem', color: ft.muted }}>{notif.time} în urmă</Box>
                                        </Box>

                                        {/* Dismiss button */}
                                        <Box
                                            component="button"
                                            className="notif-dismiss"
                                            sx={{
                                                background: 'none', border: 'none', color: ft.muted, cursor: 'pointer',
                                                p: '4px', borderRadius: '50%', opacity: 0, transition: 'all .15s',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                '&:hover': { color: ft.red, bgcolor: 'rgba(255,77,109,0.1)' },
                                            }}
                                            title="\u015eterge notificarea"
                                            onClick={(e: React.MouseEvent) => dismiss(notif.id, e)}
                                        >
                                            {dismissIcon}
                                        </Box>
                                    </Box>
                                );
                            })
                        ))}

                    </Box>

                    {/* \u2500\u2500 RIGHT PANEL \u2500\u2500 */}
                    <Box component="aside" sx={{
                        width: 300, flexShrink: 0, position: 'sticky', top: 72,
                        height: 'calc(100vh - 72px)', overflowY: 'auto', p: '20px 16px',
                        display: 'flex', flexDirection: 'column', gap: '16px',
                        '@media (max-width:1100px)': { display: 'none' },
                    }}>
                        <Box sx={{ bgcolor: ft.card, border: `1px solid ${ft.border}`, borderRadius: ft.radius, p: '18px' }}>
                            <Box sx={{ fontFamily: ft.fontCondensed, fontWeight: 800, fontSize: '1.05rem', mb: '14px' }}>
                                \ud83d\udcca Activitatea ta
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {[
                                    { val: totalLikes,    label: 'Aprecieri',      color: '#ff4d6d' },
                                    { val: totalReplies,  label: 'R\u0103spunsuri',     color: '#00c8ff' },
                                    { val: totalFollows,  label: 'Urm\u0103ritori noi', color: '#00b894' },
                                    { val: totalMentions, label: 'Men\u021biuni',        color: '#1a6fff' },
                                ].map((s) => (
                                    <Box key={s.label} sx={{
                                        bgcolor: ft.card2, border: `1px solid ${ft.border2}`,
                                        borderRadius: '12px', p: '12px', textAlign: 'center',
                                    }}>
                                        <Box sx={{ fontFamily: ft.fontCondensed, fontSize: '1.5rem', fontWeight: 900, color: s.color }}>
                                            {s.val}
                                        </Box>
                                        <Box sx={{ fontSize: '.72rem', color: ft.muted, mt: '2px' }}>{s.label}</Box>
                                    </Box>
                                ))}
                            </Box>
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
