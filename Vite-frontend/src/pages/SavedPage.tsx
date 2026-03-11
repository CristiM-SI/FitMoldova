import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useAuth } from '../context/AuthContext';
import { useForumContext } from '../context/ForumContext';
import {
  ft, fontImportCSS, keyframesCSS,
  sxPageRoot, sxBody, sxSidebar, sxNavItem, sxNavItemActive,
  sxNavIcon, sxNavIconActive, sxPostBtn, sxMain, sxHeader,
  sxHeaderTitle, sxThread, sxThreadRow, sxThreadAva, sxThreadBody,
  sxThreadMeta, sxAuthor, sxHandle, sxDot, sxTime, sxCategoryTag,
  sxContent, sxHashtag, sxActions, sxAction, sxEmpty, sxEmptyIcon,
  sxEmptyTitle, sxEmptySub, sxEmptyBtn, sxToast, sxFilterBar, sxFilterChip,
} from '../styles/forumStyles';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCount = (n: number): string => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
};

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icons = {
    reply: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>),
    heart: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>),
    heartFilled: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>),
    bookmarkFilled: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>),
    views: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>),
    verified: (<svg width="16" height="16" viewBox="0 0 24 24" fill="#1a6fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /><circle cx="12" cy="12" r="11" fill="none" stroke="#1a6fff" strokeWidth="2" /><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" transform="scale(0.6) translate(8,8)" /></svg>),
};

// ─── Component ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Toate', 'Antrenament', 'Nutriție', 'Recuperare', 'Competiții', 'Echipament'];

export default function SavedPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { threads, handleLike, handleBookmark, heartAnims, toast } = useForumContext();
    const [filter, setFilter] = useState('Toate');

    const savedThreads = useMemo(() => {
        const saved = threads.filter((t) => t.bookmarked);
        if (filter === 'Toate') return saved;
        return saved.filter((t) => t.category === filter);
    }, [threads, filter]);

    const renderContent = (content: string) =>
        content.split(/(#\S+)/g).map((part, i) =>
            part.startsWith('#')
                ? <Box component="span" key={i} sx={sxHashtag}>{part}</Box>
                : <span key={i}>{part}</span>
        );

    return (
        <>
            <style>{fontImportCSS}{keyframesCSS}</style>
            <Navbar />
            <Box sx={sxPageRoot}>
                <Box sx={sxBody}>

                    {/* ── LEFT SIDEBAR ── */}
                    <Box component="aside" sx={sxSidebar}>
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate(ROUTES.FEED)}>
                            <Box component="span" sx={sxNavIcon}>🏠</Box>
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
                        <Box component="button" sx={sxNavItemActive} className="nav-item">
                            <Box component="span" sx={sxNavIconActive}>🔖</Box>
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
                        <Box sx={sxHeader}>
                            <Box>
                                <Box sx={sxHeaderTitle}>🔖 Salvate</Box>
                                <Box sx={{ fontSize: '.8rem', color: ft.muted, mt: '2px' }}>
                                    {savedThreads.length} {savedThreads.length === 1 ? 'postare salvată' : 'postări salvate'}
                                </Box>
                            </Box>
                        </Box>

                        {/* Filter chips */}
                        <Box sx={sxFilterBar}>
                            {CATEGORIES.map((cat) => (
                                <Box
                                    component="button"
                                    key={cat}
                                    sx={sxFilterChip(filter === cat)}
                                    onClick={() => setFilter(cat)}
                                >
                                    {cat}
                                </Box>
                            ))}
                        </Box>

                        {savedThreads.length === 0 ? (
                            <Box sx={sxEmpty}>
                                <Box sx={sxEmptyIcon}>🔖</Box>
                                <Box sx={sxEmptyTitle}>
                                    {filter === 'Toate' ? 'Nicio postare salvată' : `Nimic în categoria "${filter}"`}
                                </Box>
                                <Box sx={sxEmptySub}>
                                    {filter === 'Toate'
                                        ? 'Apasă iconița bookmark pe orice postare din forum pentru a o salva aici.'
                                        : 'Nu ai postări salvate din această categorie.'}
                                </Box>
                                <Box component="button" sx={sxEmptyBtn} onClick={() => navigate(ROUTES.FORUM)}>
                                    Explorează Forum
                                </Box>
                            </Box>
                        ) : (
                            savedThreads.map((thread, idx) => (
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
                                                        color: ft.cyan,
                                                        '&:hover': { bgcolor: 'rgba(0,200,255,0.06)', color: ft.red },
                                                    }}
                                                    onClick={(e: React.MouseEvent) => handleBookmark(thread.id, e)}
                                                    title="Elimină din salvate"
                                                >
                                                    {Icons.bookmarkFilled}
                                                    <span style={{ fontSize: '.72rem' }}>Elimină</span>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>

                </Box>

                <Box sx={sxToast(toast.visible)}>
                    {toast.msg}
                </Box>
            </Box>
        </>
    );
}
