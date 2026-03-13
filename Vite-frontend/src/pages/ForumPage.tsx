import { useState, useCallback, useMemo, useRef } from 'react';
import { message } from 'antd';
import { useNavigate } from '@tanstack/react-router';
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
  sxEmptyTitle, sxEmptySub, sxTab, sxTabs,
  sxRightSidebar, sxSearchBox, sxSearchIcon, sxSearchInput,
  sxSuggestBox, sxSuggestHeader, sxSuggestUser, sxSuggestAva,
  sxSuggestInfo, sxSuggestName, sxSuggestHandle, sxSuggestBio, sxFollowBtn,
} from '../styles/forumStyles';

import { formatCount, getInitials, Icons, renderContent } from '../utils/forumHelpers';

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function ForumPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const composeRef = useRef<HTMLTextAreaElement>(null);

    const [activeCategory, setActiveCategory] = useState<ForumCategory>('Toate');
    const [threads, setThreads] = useState<ForumThread[]>(INITIAL_THREADS);
    const [expandedThread, setExpandedThread] = useState<number | null>(null);
    const [composeText, setComposeText] = useState('');
    const [composeCategory, setComposeCategory] = useState<ForumCategory>('Antrenament');
    const [replyText, setReplyText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
    const [heartAnims, setHeartAnims] = useState<Set<number>>(new Set());

    const userAvatar = user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : 'FM';
    const userName = user ? `${user.firstName} ${user.lastName}` : 'FitMoldova User';
    const userHandle = user ? `@${user.username}` : '@user';

    const showToast = useCallback((msg: string) => {
        message.info(msg);
    }, []);

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
                        }} onClick={() => navigate({ to: ROUTES.COMMUNITY })}>
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
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.COMMUNITY })}>
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
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.PROFILE })}>
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
                                        sx={{
                                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                            color: ft.text, fontFamily: ft.font, fontSize: '.92rem',
                                            resize: 'none', minHeight: 40, p: '8px 0',
                                            fieldSizing: 'content', overflow: 'hidden',
                                            '&::placeholder': { color: ft.muted },
                                        }}
                                        placeholder="Scrie un răspuns..."
                                        value={replyText}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
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
                                                fieldSizing: 'content', overflow: 'hidden',
                                                '&::placeholder': { color: ft.muted },
                                            }}
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

            </Box>
        </>
    );
}
