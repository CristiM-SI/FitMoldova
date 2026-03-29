import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Box from '@mui/material/Box';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useForumContext, SUGGESTED_USERS } from '../context/ForumContext';
import {
  ft, fontImportCSS, keyframesCSS,
  sxPageRoot, sxBody, sxSidebar, sxNavItem, sxNavItemActive,
  sxNavIcon, sxNavIconActive, sxPostBtn, sxMain, sxHeader as sxHeaderBase,
  sxHeaderTitle, sxThread, sxThreadRow, sxThreadAva, sxThreadBody,
  sxThreadMeta, sxAuthor, sxHandle, sxDot, sxTime, sxCategoryTag,
  sxContent, sxActions, sxAction, sxEmpty, sxEmptyIcon,
  sxEmptyTitle, sxEmptySub, sxEmptyBtn, sxToast, sxTab, sxTabs,
  sxRightSidebar, sxSearchBox, sxSearchIcon, sxSearchInput,
  sxSuggestBox, sxSuggestHeader, sxSuggestUser, sxSuggestAva,
  sxSuggestInfo, sxSuggestName, sxSuggestHandle, sxSuggestBio, sxFollowBtn,
} from '../styles/forumStyles';

import { formatCount, getInitials, Icons, renderContent } from '../utils/forumHelpers';

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeedPage() {
    const navigate = useNavigate();
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
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.FORUM })}>
                            <Box component="span" sx={sxNavIcon}>💬</Box>
                            <Box component="span" className="sidebar-text">Forum</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.COMMUNITY })}>
                            <Box component="span" sx={sxNavIcon}>👥</Box>
                            <Box component="span" className="sidebar-text">Comunitate</Box>
                        </Box>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.MESSAGES })}>
                            <Box component="span" sx={sxNavIcon}>✉️</Box>
                            <Box component="span" className="sidebar-text">Mesaje</Box>
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
                                    <Box component="button" sx={sxEmptyBtn} onClick={() => navigate({ to: ROUTES.FORUM })}>
                                        Explorează Forum
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            feedThreads.map((thread, idx) => (
                                <Box
                                    key={thread.id}
                                    sx={{ ...sxThread, animationDelay: `${idx * 40}ms` }}
                                    onClick={() => navigate({ to: ROUTES.FORUM })}
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
