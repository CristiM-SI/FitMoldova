import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Box from '@mui/material/Box';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useForumContext } from '../context/ForumContext';
import {
  ft, fontImportCSS, keyframesCSS,
  sxPageRoot, sxBody, sxSidebar, sxNavItem, sxNavItemActive,
  sxNavIcon, sxNavIconActive, sxPostBtn, sxMain, sxHeader,
  sxHeaderTitle, sxThread, sxThreadRow, sxThreadAva, sxThreadBody,
  sxThreadMeta, sxAuthor, sxHandle, sxDot, sxTime, sxCategoryTag,
  sxContent, sxActions, sxAction, sxEmpty, sxEmptyIcon,
  sxEmptyTitle, sxEmptySub, sxEmptyBtn, sxToast, sxFilterBar, sxFilterChip,
} from '../styles/forumStyles';

// ─── Helpers ─────────────────────────────────────────────────────────────────

import { formatCount, Icons, renderContent } from '../utils/forumHelpers';

// ─── Component ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Toate', 'Antrenament', 'Nutriție', 'Recuperare', 'Competiții', 'Echipament'];

export default function SavedPage() {
    const navigate = useNavigate();
    const { threads, handleLike, handleBookmark, heartAnims, toast } = useForumContext();
    const [filter, setFilter] = useState('Toate');

    const savedThreads = useMemo(() => {
        const saved = threads.filter((t) => t.bookmarked);
        if (filter === 'Toate') return saved;
        return saved.filter((t) => t.category === filter);
    }, [threads, filter]);


    return (
        <>
            <style>{fontImportCSS}{keyframesCSS}</style>
            <Navbar />
            <Box sx={sxPageRoot}>
                <Box sx={sxBody}>

                    {/* ── LEFT SIDEBAR ── */}
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
                        <Box component="button" sx={sxNavItem} className="nav-item" onClick={() => navigate({ to: ROUTES.MESSAGES })}>
                            <Box component="span" sx={sxNavIcon}>✉️</Box>
                            <Box component="span" className="sidebar-text">Mesaje</Box>
                        </Box>
                        <Box component="button" sx={sxNavItemActive} className="nav-item">
                            <Box component="span" sx={sxNavIconActive}>🔖</Box>
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
                                <Box component="button" sx={sxEmptyBtn} onClick={() => navigate({ to: ROUTES.FORUM })}>
                                    Explorează Forum
                                </Box>
                            </Box>
                        ) : (
                            savedThreads.map((thread, idx) => (
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
