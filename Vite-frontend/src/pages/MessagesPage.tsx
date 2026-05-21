import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import Box from '@mui/material/Box';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import messageApi from '../services/api/messageApi';
import { userApi } from '../services/api/userApi';
import type { CommunityUserDto, FollowingUserDto } from '../services/api/userApi';
import { chatSignalRService } from '../services/chatSignalRService';
import type { MessageInfoDto, ConversationPreviewDto } from '../types/Message';
import { ft } from '../styles/forumStyles';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Ieri';
    if (diffDays < 7) return d.toLocaleDateString('ro-RO', { weekday: 'short' });
    return d.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' });
}

function getInitials(firstName: string, lastName: string): string {
    return (firstName?.[0] ?? '?').toUpperCase() + (lastName?.[0] ?? '').toUpperCase();
}

const AVATAR_COLORS = ['#1a6fff','#e91e8c','#00b894','#9b59b6','#e67e22','#2ecc71','#e74c3c','#3498db'];
const avatarColor = (id: number) => AVATAR_COLORS[Math.abs(id) % AVATAR_COLORS.length];

// ─── UserAvatar ───────────────────────────────────────────────────────────────

interface AvatarProps { url?: string | null; firstName: string; lastName: string; userId: number; size?: number; }
function UserAvatar({ url, firstName, lastName, userId, size = 42 }: AvatarProps) {
    if (url) return (
        <Box component="img" src={url}
             sx={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    );
    return (
        <Box sx={{
            width: size, height: size, borderRadius: '50%', flexShrink: 0,
            bgcolor: avatarColor(userId), display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: size * 0.36, fontWeight: 700, color: '#fff',
        }}>
            {getInitials(firstName, lastName)}
        </Box>
    );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactUser {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
}

// ─── Componenta principală ────────────────────────────────────────────────────

export default function MessagesPage() {
    const { user } = useAuth();
    const navigate  = useNavigate();
    const search    = useSearch({ strict: false }) as Record<string, string | undefined>;
    const targetUserId = search?.userId ? parseInt(search.userId, 10) : null;

    // ── State ──────────────────────────────────────────────────────────────────
    const [conversations,   setConversations]   = useState<ConversationPreviewDto[]>([]);
    const [activeConv,      setActiveConv]      = useState<ConversationPreviewDto | null>(null);
    const [messages,        setMessages]        = useState<MessageInfoDto[]>([]);
    const [inputText,       setInputText]       = useState('');
    const [loading,         setLoading]         = useState(true);
    const [sending,         setSending]         = useState(false);
    const [error,           setError]           = useState<string | null>(null);
    const [searchQuery,     setSearchQuery]     = useState('');
    const [searchResults,   setSearchResults]   = useState<ContactUser[]>([]);
    const [searchFocused,   setSearchFocused]   = useState(false);
    const [allUsers,        setAllUsers]        = useState<CommunityUserDto[]>([]);
    const [following,       setFollowing]       = useState<FollowingUserDto[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef       = useRef<HTMLTextAreaElement>(null);
    const activeConvRef  = useRef<ConversationPreviewDto | null>(null);
    const searchRef      = useRef<HTMLDivElement>(null);
    useEffect(() => { activeConvRef.current = activeConv; }, [activeConv]);

    // ── Scroll ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Închide dropdown când click afară ─────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Căutare users în timp real ─────────────────────────────────────────────
    useEffect(() => {
        if (!searchQuery.trim()) { setSearchResults([]); return; }
        const q = searchQuery.toLowerCase();
        const results = allUsers
            .filter(u =>
                u.id !== user?.id &&
                (u.firstName.toLowerCase().includes(q) ||
                    u.lastName.toLowerCase().includes(q) ||
                    u.username.toLowerCase().includes(q))
            )
            .slice(0, 8)
            .map(u => ({ id: u.id, username: u.username, firstName: u.firstName, lastName: u.lastName, avatar: u.profileImageUrl }));
        setSearchResults(results);
    }, [searchQuery, allUsers, user?.id]);

    // ── Deschide conversație cu un user (din search sau URL) ──────────────────
    const openConversationWithUser = useCallback(async (contactUser: ContactUser) => {
        setSearchQuery('');
        setSearchFocused(false);
        setError(null);

        // Verificăm dacă există deja în lista de conversații
        const existing = conversations.find(c => c.otherUserId === contactUser.id);
        const conv: ConversationPreviewDto = existing ?? {
            otherUserId:    contactUser.id,
            otherUsername:  contactUser.username,
            otherFirstName: contactUser.firstName,
            otherLastName:  contactUser.lastName,
            otherAvatar:    contactUser.avatar ?? null,
            lastMessage:    '',
            lastMessageAt:  new Date().toISOString(),
            unreadCount:    0,
        };

        if (!existing) {
            setConversations(prev => [conv, ...prev]);
        }

        setActiveConv(conv);
        setMessages([]);

        try {
            const msgs = await messageApi.getMessages(contactUser.id);
            setMessages(msgs);
        } catch {
            // Conversație nouă fără mesaje — OK
        }

        await messageApi.markAsRead(contactUser.id).catch(() => {});
        await chatSignalRService.markAsRead(contactUser.id).catch(() => {});
        setConversations(prev =>
            prev.map(c => c.otherUserId === contactUser.id ? { ...c, unreadCount: 0 } : c)
        );

        navigate({ to: '/messages', replace: true });
    }, [conversations, navigate]);

    // ── Selectare conversație din sidebar ─────────────────────────────────────
    const selectConversation = useCallback(async (conv: ConversationPreviewDto) => {
        setActiveConv(conv);
        setMessages([]);
        setError(null);
        try {
            const msgs = await messageApi.getMessages(conv.otherUserId);
            setMessages(msgs);
        } catch {
            setError('Nu s-au putut încărca mesajele.');
        }
        await messageApi.markAsRead(conv.otherUserId).catch(() => {});
        await chatSignalRService.markAsRead(conv.otherUserId).catch(() => {});
        setConversations(prev =>
            prev.map(c => c.otherUserId === conv.otherUserId ? { ...c, unreadCount: 0 } : c)
        );
    }, []);

    // ── Încărcare inițială: conversații + useri + following ──────────────────
    useEffect(() => {
        Promise.all([
            messageApi.getConversations().catch(() => [] as ConversationPreviewDto[]),
            userApi.getCommunity().catch(() => [] as CommunityUserDto[]),
            userApi.getFollowing().catch(() => [] as FollowingUserDto[]),
        ]).then(async ([convs, users, followingList]) => {
            setConversations(convs);
            setAllUsers(users);
            setFollowing(followingList);

            // Dacă vine ?userId din URL — deschidem direct conversația
            if (targetUserId && targetUserId !== user?.id) {
                const targetUser =
                    users.find(u => u.id === targetUserId) ??
                    followingList.find(u => u.id === targetUserId);

                if (targetUser) {
                    const contact: ContactUser = {
                        id:        targetUser.id,
                        username:  targetUser.username,
                        firstName: targetUser.firstName,
                        lastName:  targetUser.lastName,
                        avatar:    targetUser.profileImageUrl,
                    };
                    // Găsim sau creăm conversația
                    const existing = convs.find(c => c.otherUserId === targetUserId);
                    const conv: ConversationPreviewDto = existing ?? {
                        otherUserId:    contact.id,
                        otherUsername:  contact.username,
                        otherFirstName: contact.firstName,
                        otherLastName:  contact.lastName,
                        otherAvatar:    contact.avatar ?? null,
                        lastMessage:    '',
                        lastMessageAt:  new Date().toISOString(),
                        unreadCount:    0,
                    };
                    if (!existing) setConversations(prev => [conv, ...prev]);
                    setActiveConv(conv);
                    const msgs = await messageApi.getMessages(targetUserId).catch(() => [] as MessageInfoDto[]);
                    setMessages(msgs);
                    await messageApi.markAsRead(targetUserId).catch(() => {});
                }
                navigate({ to: '/messages', replace: true });
            }
        }).finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Conversații sugerate (following cu care nu ai vorbit încă) ────────────
    const suggestedFollowing = useMemo(() => {
        const convIds = new Set(conversations.map(c => c.otherUserId));
        return following
            .filter(f => f.id !== user?.id && !convIds.has(f.id))
            .slice(0, 5);
    }, [following, conversations, user?.id]);

    // ── SignalR real-time ──────────────────────────────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem('fitmoldova_token');
        if (!token) return;
        chatSignalRService.start(token);

        const handleNewMessage = (msg: MessageInfoDto) => {
            setMessages(prev => {
                const conv = activeConvRef.current;
                const isActive = conv && (
                    (msg.senderId === user?.id   && msg.receiverId === conv.otherUserId) ||
                    (msg.receiverId === user?.id  && msg.senderId   === conv.otherUserId)
                );
                if (!isActive) return prev;
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });

            setConversations(prev => {
                const otherId = msg.senderId === user?.id ? msg.receiverId : msg.senderId;
                const exists  = prev.some(c => c.otherUserId === otherId);
                const isActiveConv = activeConvRef.current?.otherUserId === otherId;
                const updated = exists
                    ? prev.map(c => c.otherUserId !== otherId ? c : {
                        ...c,
                        lastMessage:   msg.content,
                        lastMessageAt: msg.createdAt,
                        unreadCount: msg.receiverId === user?.id && !isActiveConv ? c.unreadCount + 1 : c.unreadCount,
                    })
                    : prev;
                return [...updated].sort((a, b) =>
                    new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
                );
            });
        };

        chatSignalRService.onReceiveMessage(handleNewMessage);
        return () => { chatSignalRService.offReceiveMessage(handleNewMessage); };
    }, [user?.id]);

    // ── Trimitere mesaj ────────────────────────────────────────────────────────
    const sendMessage = useCallback(async () => {
        if (!activeConv || !inputText.trim() || sending) return;
        const content = inputText.trim();
        setInputText('');
        setSending(true);
        setError(null);

        try {
            await chatSignalRService.sendMessage(activeConv.otherUserId, content);
        } catch {
            try {
                const msg = await messageApi.sendMessage(activeConv.otherUserId, content);
                setMessages(prev => [...prev, msg]);
                setConversations(prev =>
                    prev.map(c => c.otherUserId === activeConv.otherUserId
                        ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt }
                        : c
                    ).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
                );
            } catch {
                setError('Mesajul nu a putut fi trimis. Verifică conexiunea.');
                setInputText(content);
            }
        } finally {
            setSending(false);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [activeConv, inputText, sending]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <Box sx={{
            fontFamily: ft.font, bgcolor: ft.bg, color: ft.text,
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            '&::before': {
                content: '""', position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                backgroundImage: `linear-gradient(rgba(0,200,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.015) 1px,transparent 1px)`,
                backgroundSize: '60px 60px',
            },
        }}>
            <style>{`
        @import url('${ft.fontImport}');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${ft.muted}50;border-radius:4px}
        textarea{resize:none;outline:none;border:none;background:transparent;font-family:${ft.font};color:${ft.text}}
        input{outline:none;border:none;background:transparent;font-family:${ft.font}}
      `}</style>

            <Navbar />

            {/* ── Layout principal ─────────────────────────────────────────────── */}
            <Box sx={{
                position: 'relative', zIndex: 1,
                display: 'flex', height: 'calc(100vh - 64px)', mt: '64px',
                maxWidth: 1100, mx: 'auto', width: '100%',
                border: `1px solid ${ft.border}`, borderRadius: ft.radius,
                overflow: 'hidden', bgcolor: ft.card,
            }}>

                {/* ══ SIDEBAR STÂNGA ═══════════════════════════════════════════════ */}
                <Box sx={{
                    width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column',
                    borderRight: `1px solid ${ft.border}`,
                    '@media (max-width:650px)': { width: '100%', display: activeConv ? 'none' : 'flex' },
                }}>

                    {/* Header + Search ─────────────────────────────────────────────── */}
                    <Box sx={{ p: '16px 14px 12px', borderBottom: `1px solid ${ft.border}` }}>
                        <Box sx={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: ft.text, fontFamily: ft.fontCondensed, mb: '10px' }}>
                            MESAJE
                        </Box>

                        {/* Search bar ───────────────────────────────────────────────── */}
                        <Box ref={searchRef} sx={{ position: 'relative' }}>
                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                bgcolor: ft.bg, borderRadius: '10px',
                                border: `1px solid ${searchFocused ? ft.blue + '80' : ft.border2}`,
                                px: '12px', py: '8px', transition: 'border-color 0.2s',
                            }}>
                                <Box sx={{ color: ft.muted, fontSize: 14, flexShrink: 0 }}>🔍</Box>
                                <Box
                                    component="input"
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    placeholder="Caută un utilizator..."
                                    sx={{ flex: 1, fontSize: 13, color: ft.text, '::placeholder': { color: ft.muted } }}
                                />
                                {searchQuery && (
                                    <Box onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                                         sx={{ color: ft.muted, cursor: 'pointer', fontSize: 16, lineHeight: 1, '&:hover': { color: ft.text } }}>
                                        ×
                                    </Box>
                                )}
                            </Box>

                            {/* Dropdown rezultate ──────────────────────────────────────── */}
                            {searchFocused && searchQuery.trim() && (
                                <Box sx={{
                                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100,
                                    bgcolor: ft.card2, border: `1px solid ${ft.border2}`, borderRadius: '10px',
                                    overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                }}>
                                    {searchResults.length === 0 ? (
                                        <Box sx={{ p: '12px 14px', fontSize: 13, color: ft.muted }}>
                                            Niciun utilizator găsit
                                        </Box>
                                    ) : searchResults.map(u => (
                                        <Box
                                            key={u.id}
                                            onMouseDown={() => openConversationWithUser(u)}
                                            sx={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                px: '12px', py: '9px', cursor: 'pointer',
                                                '&:hover': { bgcolor: ft.bdim },
                                                transition: 'background 0.12s',
                                            }}
                                        >
                                            <UserAvatar url={u.avatar} firstName={u.firstName} lastName={u.lastName} userId={u.id} size={34} />
                                            <Box sx={{ minWidth: 0 }}>
                                                <Box sx={{ fontSize: 13, fontWeight: 600, color: ft.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {u.firstName} {u.lastName}
                                                </Box>
                                                <Box sx={{ fontSize: 11, color: ft.muted }}>@{u.username}</Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* Lista conversații ────────────────────────────────────────────── */}
                    <Box sx={{ flex: 1, overflowY: 'auto' }}>
                        {loading && (
                            <Box sx={{ p: '20px', textAlign: 'center', color: ft.muted, fontSize: 13 }}>Se încarcă...</Box>
                        )}

                        {/* Conversații existente */}
                        {conversations.map(conv => (
                            <Box
                                key={conv.otherUserId}
                                onClick={() => selectConversation(conv)}
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    p: '11px 14px', cursor: 'pointer',
                                    bgcolor: activeConv?.otherUserId === conv.otherUserId ? ft.bdim : 'transparent',
                                    borderLeft: `3px solid ${activeConv?.otherUserId === conv.otherUserId ? ft.blue : 'transparent'}`,
                                    transition: 'all 0.15s', '&:hover': { bgcolor: ft.cdim },
                                }}
                            >
                                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                                    <UserAvatar url={conv.otherAvatar} firstName={conv.otherFirstName} lastName={conv.otherLastName} userId={conv.otherUserId} size={42} />
                                    {conv.unreadCount > 0 && (
                                        <Box sx={{
                                            position: 'absolute', top: -3, right: -3,
                                            bgcolor: ft.blue, color: '#fff', borderRadius: '50%',
                                            width: 17, height: 17, display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontSize: 9, fontWeight: 700,
                                        }}>
                                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                                        </Box>
                                    )}
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '2px' }}>
                                        <Box sx={{ fontSize: 13, fontWeight: conv.unreadCount > 0 ? 700 : 500, color: ft.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                                            {conv.otherFirstName} {conv.otherLastName}
                                        </Box>
                                        <Box sx={{ fontSize: 10, color: ft.muted, flexShrink: 0 }}>{formatTime(conv.lastMessageAt)}</Box>
                                    </Box>
                                    <Box sx={{ fontSize: 12, color: conv.unreadCount > 0 ? ft.cyan : ft.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {conv.lastMessage || 'Conversație nouă'}
                                    </Box>
                                </Box>
                            </Box>
                        ))}

                        {/* Separator + Following sugerat ────────────────────────────── */}
                        {!loading && suggestedFollowing.length > 0 && (
                            <>
                                <Box sx={{ px: '14px', pt: '14px', pb: '6px', fontSize: 10, fontWeight: 700, color: ft.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                                    Urmărești
                                </Box>
                                {suggestedFollowing.map(f => (
                                    <Box
                                        key={f.id}
                                        onClick={() => openConversationWithUser({ id: f.id, username: f.username, firstName: f.firstName, lastName: f.lastName, avatar: f.profileImageUrl })}
                                        sx={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            p: '9px 14px', cursor: 'pointer', opacity: 0.75,
                                            '&:hover': { bgcolor: ft.cdim, opacity: 1 }, transition: 'all 0.15s',
                                        }}
                                    >
                                        <UserAvatar url={f.profileImageUrl} firstName={f.firstName} lastName={f.lastName} userId={f.id} size={36} />
                                        <Box sx={{ minWidth: 0 }}>
                                            <Box sx={{ fontSize: 13, fontWeight: 500, color: ft.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {f.firstName} {f.lastName}
                                            </Box>
                                            <Box sx={{ fontSize: 11, color: ft.muted }}>@{f.username}</Box>
                                        </Box>
                                    </Box>
                                ))}
                            </>
                        )}

                        {/* Gol total */}
                        {!loading && conversations.length === 0 && suggestedFollowing.length === 0 && (
                            <Box sx={{ p: '24px 16px', textAlign: 'center', color: ft.muted, fontSize: 13, lineHeight: 1.9 }}>
                                Nicio conversație.<br />
                                Caută un utilizator mai sus↑
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* ══ ZONA CHAT DREAPTA ════════════════════════════════════════════ */}
                <Box sx={{
                    flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
                    '@media (max-width:650px)': { display: activeConv ? 'flex' : 'none' },
                }}>
                    {!activeConv ? (
                        // Placeholder
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: ft.muted }}>
                            <Box sx={{ fontSize: 52 }}>💬</Box>
                            <Box sx={{ fontSize: 16, fontWeight: 700, color: ft.text }}>Începe o conversație</Box>
                            <Box sx={{ fontSize: 13, textAlign: 'center', lineHeight: 1.9 }}>
                                Caută un utilizator în bara din stânga<br />
                                sau selectează o conversație existentă
                            </Box>
                        </Box>
                    ) : (
                        <>
                            {/* Header chat ──────────────────────────────────────────────── */}
                            <Box sx={{
                                p: '12px 18px', borderBottom: `1px solid ${ft.border}`,
                                display: 'flex', alignItems: 'center', gap: '12px', bgcolor: ft.card2, flexShrink: 0,
                            }}>
                                <Box onClick={() => setActiveConv(null)} sx={{ display: { xs: 'flex', sm: 'none' }, cursor: 'pointer', color: ft.blue, fontSize: 20, mr: 1 }}>←</Box>
                                <UserAvatar url={activeConv.otherAvatar} firstName={activeConv.otherFirstName} lastName={activeConv.otherLastName} userId={activeConv.otherUserId} size={38} />
                                <Box>
                                    <Box sx={{ fontSize: 15, fontWeight: 700, color: ft.text }}>{activeConv.otherFirstName} {activeConv.otherLastName}</Box>
                                    <Box sx={{ fontSize: 12, color: ft.muted }}>@{activeConv.otherUsername}</Box>
                                </Box>
                            </Box>

                            {/* Mesaje ───────────────────────────────────────────────────── */}
                            <Box sx={{ flex: 1, overflowY: 'auto', p: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {messages.length === 0 && (
                                    <Box sx={{ textAlign: 'center', color: ft.muted, fontSize: 13, mt: 6 }}>
                                        Niciun mesaj încă. Fii primul care scrie! 👋
                                    </Box>
                                )}
                                {messages.map((msg, idx) => {
                                    const isMine   = msg.senderId === user?.id;
                                    const showDate = idx === 0 ||
                                        new Date(msg.createdAt).toDateString() !== new Date(messages[idx - 1].createdAt).toDateString();

                                    return (
                                        <Box key={msg.id}>
                                            {showDate && (
                                                <Box sx={{ textAlign: 'center', fontSize: 10, color: ft.muted, my: '10px', position: 'relative',
                                                    '&::before': { content: '""', position: 'absolute', top: '50%', left: 0, right: 0, height: 1, bgcolor: ft.border, zIndex: 0 } }}>
                                                    <Box component="span" sx={{ bgcolor: ft.card, px: 2, position: 'relative', zIndex: 1 }}>
                                                        {new Date(msg.createdAt).toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </Box>
                                                </Box>
                                            )}
                                            <Box sx={{ display: 'flex', flexDirection: isMine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '7px' }}>
                                                {!isMine && (
                                                    <UserAvatar url={activeConv.otherAvatar} firstName={activeConv.otherFirstName} lastName={activeConv.otherLastName} userId={activeConv.otherUserId} size={26} />
                                                )}
                                                <Box sx={{ maxWidth: '68%' }}>
                                                    <Box sx={{
                                                        px: '13px', py: '8px',
                                                        borderRadius: isMine ? '16px 16px 3px 16px' : '16px 16px 16px 3px',
                                                        bgcolor: isMine ? ft.blue : ft.card2,
                                                        color: '#fff', fontSize: 14, lineHeight: 1.55,
                                                        wordBreak: 'break-word',
                                                        boxShadow: isMine ? `0 2px 10px ${ft.blue}35` : `0 1px 4px rgba(0,0,0,0.2)`,
                                                    }}>
                                                        {msg.content}
                                                    </Box>
                                                    <Box sx={{ fontSize: 10, color: ft.muted, mt: '3px', textAlign: isMine ? 'right' : 'left' }}>
                                                        {formatTime(msg.createdAt)}
                                                        {isMine && msg.isRead && <Box component="span" sx={{ ml: '3px', color: ft.cyan }}>✓✓</Box>}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Input ────────────────────────────────────────────────────── */}
                            <Box sx={{ p: '10px 14px', borderTop: `1px solid ${ft.border}`, display: 'flex', alignItems: 'flex-end', gap: '10px', bgcolor: ft.card2, flexShrink: 0 }}>
                                <Box sx={{
                                    flex: 1, bgcolor: ft.bg, borderRadius: '12px',
                                    border: `1px solid ${ft.border2}`, px: '14px', py: '9px',
                                    '&:focus-within': { borderColor: `${ft.blue}70` }, transition: 'border-color 0.2s',
                                }}>
                                    <Box
                                        component="textarea"
                                        ref={inputRef}
                                        value={inputText}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Scrie un mesaj... (Enter = trimite, Shift+Enter = linie nouă)"
                                        rows={1}
                                        sx={{ width: '100%', fontSize: 14, lineHeight: 1.5, maxHeight: 100, overflowY: 'auto', '::placeholder': { color: ft.muted } }}
                                    />
                                </Box>
                                <Box
                                    onClick={sendMessage}
                                    sx={{
                                        width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                                        bgcolor: inputText.trim() && !sending ? ft.blue : `${ft.muted}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: inputText.trim() && !sending ? 'pointer' : 'default',
                                        fontSize: 17, color: '#fff', transition: 'all 0.2s',
                                        '&:hover': inputText.trim() && !sending ? { opacity: 0.85, transform: 'scale(1.08)' } : {},
                                    }}
                                >
                                    {sending ? '⏳' : '➤'}
                                </Box>
                            </Box>

                            {error && (
                                <Box sx={{ px: '14px', py: '7px', bgcolor: `${ft.red}18`, color: ft.red, fontSize: 12, flexShrink: 0 }}>
                                    ⚠ {error}
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
