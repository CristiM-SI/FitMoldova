import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useAuth } from '../context/AuthContext';
import { useForumContext, SUGGESTED_USERS } from '../context/ForumContext';
import { FORUM_CATEGORIES } from '../services/mock/forum';
import type { ForumCategory } from '../services/mock/forum';
import {
  ft, fontImportCSS, keyframesCSS,
  sxPageRoot, sxBody, sxSidebar, sxNavItem, sxNavItemActive,
  sxNavIcon, sxNavIconActive, sxPostBtn, sxMain, sxHeader as sxHeaderBase,
  sxHeaderTitle, sxThread, sxThreadRow, sxThreadAva, sxThreadBody,
  sxThreadMeta, sxAuthor, sxHandle, sxDot, sxTime, sxCategoryTag,
  sxContent, sxHashtag, sxActions, sxAction, sxEmpty, sxEmptyIcon,
  sxEmptyTitle, sxEmptySub, sxEmptyBtn, sxToast, sxTab, sxTabs,
  sxRightSidebar, sxSearchBox, sxSearchIcon, sxSearchInput,
  sxSuggestBox, sxSuggestHeader, sxSuggestUser, sxSuggestAva,
  sxSuggestInfo, sxSuggestName, sxSuggestHandle, sxSuggestBio, sxFollowBtn,
} from '../styles/forumStyles';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (name: string): string =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const formatCount = (n: number): string => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
};

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icons = {
    reply: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>),
    repost: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>),
    heart: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>),
    heartFilled: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>),
    bookmark: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>),
    bookmarkFilled: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>),
    views: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>),
    verified: (<svg width="16" height="16" viewBox="0 0 24 24" fill="#1a6fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /><circle cx="12" cy="12" r="11" fill="none" stroke="#1a6fff" strokeWidth="2" /><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" transform="scale(0.6) translate(8,8)" /></svg>),
    search: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeedPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        threads,
        followedUsers, handleFollow,
        handleLike, handleRepost, handleBookmark,
        heartAnims, toast,
    } = useForumContext();

    const [activeTab, setActiveTab] = useState<'pentru-tine' | 'urmariti'>('urmariti');
    const [searchQuery, setSearchQuery] = useState('');

    const feedThreads = useMemo(() => {
        let result = activeTab === 'urmariti'
            ? threads.filter((t) => followedUsers.has(t.handle))
            : threads;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (t) => t.content.toLowerCase().includes(q) || t.author.toLowerCase().includes(q)
            );
        }
        return result;
    }, [threads, followedUsers, activeTab, searchQuery]);

    const renderContent = (content: string) =>
        content.split(/(#\S+)/g).map((part, i) =>
            part.startsWith('#')
                ? <Box component="span" key={i} sx={sxHashtag}>{part}</Box>
                : <span key={i}>{part}</span>
        );

    const sxFeedHeader = {
        ...sxHeaderBase,
        p: '16px 20px 0',
    };

    return (
        <>
            <style>{fontImportCSS}{keyframesCSS}</style>
            <Navbar />
            <Box sx={sxPageRoot}>
                <Box sx={sxBody}>

                    {/* ── LEFT SIDEBAR ── */}
                    <Box component="aside" sx={sxSidebar}>
                        <Box component="button" sx={sxNavItemActive} className="nav-item">
                            <Box component="span" sx={sxNavIconActive}>🏠</Box>
                            <Box component="span" className="sidebar-text">Feed</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate(ROUTES.FORUM)}>
                            <Box component="span" sx={sxNavIcon}>💬</Box>
                            <Box component="span" className="sidebar-text">Forum</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate(ROUTES.COMMUNITY)}>
                            <Box component="span" sx={sxNavIcon}>👥</Box>
                            <Box component="span" className="sidebar-text">Comunitate</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate(ROUTES.MESSAGES)}>
                            <Box component="span" sx={sxNavIcon}>✉️</Box>
                            <Box component="span" className="sidebar-text">Mesaje</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate(ROUTES.SAVED)}>
                            <Box component="span" sx={sxNavIcon}>🔖</Box>
                            <Box component="span" className="sidebar-text">Salvate</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate(ROUTES.PROFILE)}>
                            <Box component="span" sx={sxNavIcon}>👤</Box>
                            <Box component="span" className="sidebar-text">Profil</Box>
                        </Box>
                        <Box component="button" sx={sxPostBtn} className="sidebar-text" onClick={() => navigate(ROUTES.FORUM)}>
                            Postează
                        </Box>
                    </Box>

                    {/* ── MAIN ── */}
                    <Box component="main" sx={sxMain}>
                        <Box sx={sxFeedHeader}>
                            <Box sx={{ ...sxHeaderTitle, mb: '12px' }}>Feed</Box>
                            <Box sx={sxTabs}>
                                <Box component="button" sx={sxTab(activeTab === 'urmariti')} onClick={() => setActiveTab('urmariti')}>
                                    Urmăriți
                                </Box>
                                <Box component="button" sx={sxTab(activeTab === 'pentru-tine')} onClick={() => setActiveTab('pentru-tine')}>
                                    Pentru tine
                                </Box>
                            </Box>
                        </Box>

                        {feedThreads.length === 0 ? (
                            <Box sx={sxEmpty}>
                                <Box sx={sxEmptyIcon}>
                                    {activeTab === 'urmariti' ? '👥' : '🔍'}
                                </Box>
                                <Box sx={sxEmptyTitle}>
                                    {activeTab === 'urmariti'
                                        ? 'Nu urmărești pe nimeni încă'
                                        : 'Nicio postare găsită'}
                                </Box>
                                <Box sx={sxEmptySub}>
                                    {activeTab === 'urmariti'
                                        ? 'Urmărește oameni din lista de sugestii pentru a le vedea postările aici.'
                                        : 'Încearcă să cauți altceva sau explorează forumul.'}
                                </Box>
                                {activeTab === 'urmariti' && (
                                    <Box component="button" sx={sxEmptyBtn} onClick={() => navigate(ROUTES.FORUM)}>
                                        Explorează Forum
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            feedThreads.map((thread, idx) => (
                                <Box
                                    key={thread.id}
                                    sx={{ ...sxThread, animationDelay: `${idx * 40}ms` }}
                                    onClick={() => navigate(ROUTES.FORUM)}
                                >
                                    <Box sx={sxThreadRow}>
                                        <Box sx={{ ...sxThreadAva, background: thread.color }}>
                                            {thread.avatar}
                                        </Box>
                                        <Box sx={sxThreadBody}>
                                            <Box sx={sxThreadMeta}>
                                                <Box component="span" sx={sxAuthor}>{thread.author}</Box>
                                                {thread.verified && <span>{Icons.verified}</span>}
                                                <Box component="span" sx={sxHandle}>{thread.handle}</Box>
                                                <Box component="span" sx={sxDot}>·</Box>
                                                <Box component="span" sx={sxTime}>{thread.time}</Box>
                                                <Box component="span" sx={sxCategoryTag}>{thread.category}</Box>
                                            </Box>
                                            <Box sx={sxContent}>{renderContent(thread.content)}</Box>
                                            <Box sx={sxActions} onClick={(e) => e.stopPropagation()}>
                                                <Box component="button" sx={sxAction}>
                                                    {Icons.reply} <span>{thread.replies.length}</span>
                                                </Box>
                                                <Box
                                                    component="button"
                                                    sx={{
                                                        ...sxAction,
                                                        color: thread.reposted ? ft.green : ft.muted,
                                                        '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.green },
                                                    }}
                                                    onClick={(e: React.MouseEvent) => handleRepost(thread.id, e)}
                                                >
                                                    {Icons.repost} <span>{formatCount(thread.reposts)}</span>
                                                </Box>
                                                <Box
                                                    component="button"
                                                    sx={{
                                                        ...sxAction,
                                                        color: thread.liked ? ft.red : ft.muted,
                                                        '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.red },
                                                        animation: heartAnims.has(thread.id) ? 'heartPop .35s ease' : 'none',
                                                    }}
                                                    onClick={(e: React.MouseEvent) => handleLike(thread.id, e)}
                                                >
                                                    {thread.liked ? Icons.heartFilled : Icons.heart}
                                                    <span>{formatCount(thread.likes)}</span>
                                                </Box>
                                                <Box component="button" sx={sxAction}>
                                                    {Icons.views} <span>{formatCount(thread.views)}</span>
                                                </Box>
                                                <Box
                                                    component="button"
                                                    sx={{
                                                        ...sxAction,
                                                        color: thread.bookmarked ? ft.cyan : ft.muted,
                                                        '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.cyan },
                                                    }}
                                                    onClick={(e: React.MouseEvent) => handleBookmark(thread.id, e)}
                                                >
                                                    {thread.bookmarked ? Icons.bookmarkFilled : Icons.bookmark}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>

                    {/* ── RIGHT SIDEBAR ── */}
                    <Box component="aside" sx={sxRightSidebar}>
                        <Box sx={sxSearchBox}>
                            <Box component="span" sx={sxSearchIcon}>{Icons.search}</Box>
                            <Box
                                component="input"
                                sx={sxSearchInput}
                                placeholder="Caută în feed..."
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            />
                        </Box>

                        <Box sx={sxSuggestBox}>
                            <Box sx={sxSuggestHeader}>👥 Urmărește oameni</Box>
                            {SUGGESTED_USERS.map((su) => {
                                const isFollowing = followedUsers.has(su.handle);
                                return (
                                    <Box key={su.handle} sx={sxSuggestUser}>
                                        <Box sx={{ ...sxSuggestAva, background: su.color }}>
                                            {getInitials(su.name)}
                                        </Box>
                                        <Box sx={sxSuggestInfo}>
                                            <Box sx={sxSuggestName}>
                                                {su.name}
                                                {su.verified && Icons.verified}
                                            </Box>
                                            <Box sx={sxSuggestHandle}>{su.handle}</Box>
                                            <Box sx={sxSuggestBio}>{su.bio}</Box>
                                        </Box>
                                        <Box
                                            component="button"
                                            sx={sxFollowBtn(isFollowing)}
                                            onClick={() => handleFollow(su)}
                                        >
                                            {isFollowing ? 'Urmăresc' : 'Urmărește'}
                                        </Box>
                                    </Box>
                                );
                            })}
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
