import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useAuth } from '../context/AuthContext';
import { useForumContext, SUGGESTED_USERS } from '../context/ForumContext';
import { FORUM_CATEGORIES } from '../services/mock/forum';
import type { ForumCategory } from '../services/mock/forum';

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
    users: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>),
    compose: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
};

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,900&family=Barlow:wght@300;400;500;600;700&display=swap');

  .fd *, .fd *::before, .fd *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .fd {
    --bg:       #050d1a;
    --card:     #0a1628;
    --card2:    #0d1f3a;
    --blue:     #1a6fff;
    --cyan:     #00c8ff;
    --cdim:     rgba(0,200,255,0.10);
    --bdim:     rgba(26,111,255,0.12);
    --text:     #e8f0fe;
    --muted:    #5a7aa0;
    --border:   rgba(0,200,255,0.08);
    --border2:  rgba(0,200,255,0.14);
    --radius:   16px;
    --red:      #ff4d6d;
    --green:    #00b894;
    font-family: 'Barlow', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .fd::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,200,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index: 0;
  }

  .fd-body {
    position: relative; z-index: 1; flex: 1;
    display: flex; max-width: 1200px; margin: 0 auto;
    width: 100%;
  }

  /* ── SIDEBAR ── */
  .fd-sidebar {
    width: 270px; flex-shrink: 0;
    position: sticky; top: 72px; height: calc(100vh - 72px);
    overflow-y: auto; padding: 20px 16px;
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 4px;
  }
  .fd-nav-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 16px; border-radius: 100px;
    background: transparent; border: none;
    color: var(--text); font-family: 'Barlow', sans-serif;
    font-size: .95rem; font-weight: 600;
    cursor: pointer; transition: all .15s; width: 100%; text-align: left;
  }
  .fd-nav-item:hover { background: rgba(0,200,255,0.06); }
  .fd-nav-item--active { font-weight: 800; color: #fff; }
  .fd-nav-icon { width: 24px; display: flex; align-items: center; justify-content: center; color: var(--muted); }
  .fd-nav-item--active .fd-nav-icon { color: var(--cyan); }
  .fd-nav-badge {
    margin-left: auto; background: var(--blue); color: #fff;
    border-radius: 100px; padding: 2px 8px; font-size: .68rem; font-weight: 700;
  }
  .fd-post-btn {
    margin-top: 16px; width: 100%; padding: 14px;
    border-radius: 100px; border: none;
    background: linear-gradient(135deg, var(--blue), #0099ff);
    color: #fff; font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: 1rem; letter-spacing: 1px;
    text-transform: uppercase; cursor: pointer;
    transition: all .2s; box-shadow: 0 4px 20px rgba(26,111,255,.3);
  }
  .fd-post-btn:hover { background: linear-gradient(135deg, #2a7fff, #00aaff); transform: translateY(-1px); }

  /* ── MAIN ── */
  .fd-main {
    flex: 1; min-width: 0;
    border-right: 1px solid var(--border);
  }
  .fd-header {
    position: sticky; top: 72px; z-index: 10;
    background: rgba(5,13,26,0.85); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 16px 20px 0;
  }
  .fd-header-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800; font-size: 1.25rem; letter-spacing: .5px;
    margin-bottom: 12px;
  }
  .fd-tabs {
    display: flex; overflow-x: auto; scrollbar-width: none;
  }
  .fd-tabs::-webkit-scrollbar { display: none; }
  .fd-tab {
    flex: 1; min-width: max-content; padding: 14px 20px;
    background: none; border: none; border-bottom: 2px solid transparent;
    color: var(--muted); font-family: 'Barlow', sans-serif;
    font-size: .82rem; font-weight: 600; letter-spacing: .5px;
    cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .fd-tab:hover { color: var(--text); }
  .fd-tab--active { color: #fff; font-weight: 700; border-bottom-color: var(--cyan); }

  /* ── THREAD ── */
  .fd-thread {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    transition: background .15s; cursor: pointer;
    animation: fdFadeIn .3s ease both;
  }
  .fd-thread:hover { background: rgba(0,200,255,0.02); }
  .fd-thread-row { display: flex; gap: 12px; }
  .fd-thread-ava {
    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: .85rem; color: #fff;
  }
  .fd-thread-body { flex: 1; min-width: 0; }
  .fd-thread-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }
  .fd-author { font-weight: 700; font-size: .92rem; color: #fff; }
  .fd-handle { color: var(--muted); font-size: .82rem; }
  .fd-dot { color: var(--muted); font-size: .72rem; }
  .fd-time { color: var(--muted); font-size: .82rem; }
  .fd-tag {
    margin-left: auto; background: var(--bdim); color: var(--blue);
    border-radius: 100px; padding: 2px 10px; font-size: .68rem; font-weight: 700;
  }
  .fd-content {
    font-size: .93rem; line-height: 1.6; color: #c8daf0;
    white-space: pre-wrap; word-break: break-word; margin-bottom: 12px;
  }
  .fd-hashtag { color: var(--cyan); font-weight: 600; }
  .fd-actions { display: flex; justify-content: space-between; margin-top: 2px; max-width: 420px; }
  .fd-action {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; color: var(--muted);
    font-size: .78rem; font-weight: 600; padding: 6px 10px;
    border-radius: 100px; cursor: pointer; transition: all .15s;
  }
  .fd-action:hover { background: rgba(0,200,255,0.06); }
  .fd-action--like:hover { color: var(--red); }
  .fd-action--liked { color: var(--red); }
  .fd-action--bookmark:hover { color: var(--cyan); }
  .fd-action--bookmarked { color: var(--cyan); }
  .fd-action--repost:hover, .fd-action--reposted { color: var(--green); }
  .fd-heart-pop { animation: fdHeartPop .35s ease; }

  /* ── EMPTY STATE ── */
  .fd-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px 32px; text-align: center;
  }
  .fd-empty-icon { font-size: 3rem; margin-bottom: 16px; opacity: .5; }
  .fd-empty-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.3rem; font-weight: 800; color: #fff; margin-bottom: 8px;
  }
  .fd-empty-sub { font-size: .88rem; color: var(--muted); line-height: 1.6; max-width: 320px; }
  .fd-empty-btn {
    margin-top: 20px; padding: 10px 28px; border-radius: 100px;
    border: none; background: var(--blue); color: #fff;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: .9rem; letter-spacing: .5px;
    cursor: pointer; transition: all .15s;
  }
  .fd-empty-btn:hover { background: #2a7fff; transform: translateY(-1px); }

  /* ── RIGHT SIDEBAR ── */
  .fd-right {
    width: 320px; flex-shrink: 0;
    position: sticky; top: 72px; height: calc(100vh - 72px);
    overflow-y: auto; padding: 20px 16px;
    display: flex; flex-direction: column; gap: 20px;
  }
  .fd-search { position: relative; }
  .fd-search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--muted); display: flex; pointer-events: none;
  }
  .fd-search-input {
    width: 100%; padding: 12px 14px 12px 42px;
    background: var(--card2); border: 1px solid var(--border);
    border-radius: 100px; color: var(--text);
    font-family: 'Barlow', sans-serif; font-size: .88rem;
    outline: none; transition: all .15s;
  }
  .fd-search-input:focus { border-color: var(--cyan); background: var(--bg); }
  .fd-search-input::placeholder { color: var(--muted); }
  .fd-suggest-box {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .fd-suggest-header {
    padding: 16px 18px;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800; font-size: 1.1rem; letter-spacing: .5px;
  }
  .fd-suggest-user {
    padding: 12px 18px; border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
    cursor: pointer; transition: background .15s;
  }
  .fd-suggest-user:hover { background: rgba(0,200,255,0.03); }
  .fd-suggest-ava {
    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: .8rem; color: #fff;
  }
  .fd-suggest-info { flex: 1; min-width: 0; }
  .fd-suggest-name { display: flex; align-items: center; gap: 4px; font-weight: 700; font-size: .88rem; }
  .fd-suggest-handle { font-size: .76rem; color: var(--muted); }
  .fd-suggest-bio { font-size: .76rem; color: var(--muted); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .fd-follow-btn {
    padding: 6px 16px; border-radius: 100px;
    border: 1.5px solid var(--text); background: var(--text); color: var(--bg);
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: .78rem; cursor: pointer; transition: all .15s;
  }
  .fd-follow-btn:hover { background: #cde0ff; border-color: #cde0ff; }
  .fd-follow-btn--following { background: transparent; color: var(--text); border-color: rgba(0,200,255,0.3); }
  .fd-follow-btn--following:hover { border-color: var(--red); color: var(--red); }

  /* ── TOAST ── */
  .fd-toast {
    position: fixed; bottom: 28px; left: 50%; z-index: 300;
    background: var(--blue); border-radius: 8px; padding: 12px 20px;
    font-size: .86rem; font-weight: 600; color: #fff;
    box-shadow: 0 8px 32px rgba(0,0,0,.5);
    transform: translate(-50%, 80px); opacity: 0;
    transition: all .4s cubic-bezier(.34, 1.56, .64, 1);
    pointer-events: none;
  }
  .fd-toast--show { transform: translate(-50%, 0); opacity: 1; }

  /* ── ANIMATIONS ── */
  @keyframes fdFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  @keyframes fdHeartPop { 0% { transform: scale(1); } 30% { transform: scale(1.3); } 60% { transform: scale(0.95); } 100% { transform: scale(1); } }

  .fd ::-webkit-scrollbar { width: 4px; }
  .fd ::-webkit-scrollbar-thumb { background: rgba(0,200,255,.15); border-radius: 100px; }

  @media (max-width: 1100px) { .fd-right { display: none; } }
  @media (max-width: 850px) {
    .fd-sidebar { width: 72px; padding: 16px 8px; }
    .fd-nav-item span:not(.fd-nav-icon), .fd-nav-badge, .fd-post-btn { display: none; }
    .fd-nav-item { justify-content: center; padding: 14px; }
  }
  @media (max-width: 600px) { .fd-sidebar { display: none; } .fd-main { border-right: none; } }
`;

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
    const replyInputRef = useRef<HTMLInputElement>(null);

    const userAvatar = user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : 'U';

    // Postări de la urmăriți
    const followedHandles = useMemo(() => Array.from(followedUsers), [followedUsers]);

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
                ? <span key={i} className="fd-hashtag">{part}</span>
                : <span key={i}>{part}</span>
        );

    return (
        <>
            <style>{CSS}</style>
            <Navbar />
            <div className="fd">
                <div className="fd-body">

                    {/* ── LEFT SIDEBAR ── */}
                    <aside className="fd-sidebar">
                        <button className="fd-nav-item fd-nav-item--active">
                            <span className="fd-nav-icon">🏠</span>
                            <span>Feed</span>
                        </button>
                        <button className="fd-nav-item" onClick={() => navigate(ROUTES.FORUM)}>
                            <span className="fd-nav-icon">💬</span>
                            <span>Forum</span>
                        </button>
                        <button className="fd-nav-item" onClick={() => navigate(ROUTES.COMMUNITY)}>
                            <span className="fd-nav-icon">👥</span>
                            <span>Comunitate</span>
                        </button>
                        <button className="fd-nav-item" onClick={() => navigate(ROUTES.MESSAGES)}>
                            <span className="fd-nav-icon">✉️</span>
                            <span>Mesaje</span>
                        </button>
                        <button className="fd-nav-item" onClick={() => navigate(ROUTES.SAVED)}>
                            <span className="fd-nav-icon">🔖</span>
                            <span>Salvate</span>
                        </button>
                        <button className="fd-nav-item" onClick={() => navigate(ROUTES.PROFILE)}>
                            <span className="fd-nav-icon">👤</span>
                            <span>Profil</span>
                        </button>
                        <button className="fd-post-btn" onClick={() => navigate(ROUTES.FORUM)}>
                            Postează
                        </button>
                    </aside>

                    {/* ── MAIN ── */}
                    <main className="fd-main">
                        <div className="fd-header">
                            <div className="fd-header-title">Feed</div>
                            <div className="fd-tabs">
                                <button
                                    className={`fd-tab${activeTab === 'urmariti' ? ' fd-tab--active' : ''}`}
                                    onClick={() => setActiveTab('urmariti')}
                                >
                                    Urmăriți
                                </button>
                                <button
                                    className={`fd-tab${activeTab === 'pentru-tine' ? ' fd-tab--active' : ''}`}
                                    onClick={() => setActiveTab('pentru-tine')}
                                >
                                    Pentru tine
                                </button>
                            </div>
                        </div>

                        {feedThreads.length === 0 ? (
                            <div className="fd-empty">
                                <div className="fd-empty-icon">
                                    {activeTab === 'urmariti' ? '👥' : '🔍'}
                                </div>
                                <div className="fd-empty-title">
                                    {activeTab === 'urmariti'
                                        ? 'Nu urmărești pe nimeni încă'
                                        : 'Nicio postare găsită'}
                                </div>
                                <div className="fd-empty-sub">
                                    {activeTab === 'urmariti'
                                        ? 'Urmărește oameni din lista de sugestii pentru a le vedea postările aici.'
                                        : 'Încearcă să cauți altceva sau explorează forumul.'}
                                </div>
                                {activeTab === 'urmariti' && (
                                    <button className="fd-empty-btn" onClick={() => navigate(ROUTES.FORUM)}>
                                        Explorează Forum
                                    </button>
                                )}
                            </div>
                        ) : (
                            feedThreads.map((thread, idx) => (
                                <div
                                    key={thread.id}
                                    className="fd-thread"
                                    style={{ animationDelay: `${idx * 40}ms` }}
                                    onClick={() => navigate(ROUTES.FORUM)}
                                >
                                    <div className="fd-thread-row">
                                        <div className="fd-thread-ava" style={{ background: thread.color }}>
                                            {thread.avatar}
                                        </div>
                                        <div className="fd-thread-body">
                                            <div className="fd-thread-meta">
                                                <span className="fd-author">{thread.author}</span>
                                                {thread.verified && <span>{Icons.verified}</span>}
                                                <span className="fd-handle">{thread.handle}</span>
                                                <span className="fd-dot">·</span>
                                                <span className="fd-time">{thread.time}</span>
                                                <span className="fd-tag">{thread.category}</span>
                                            </div>
                                            <div className="fd-content">
                                                {renderContent(thread.content)}
                                            </div>
                                            <div className="fd-actions" onClick={(e) => e.stopPropagation()}>
                                                <button className="fd-action">
                                                    {Icons.reply} <span>{thread.replies.length}</span>
                                                </button>
                                                <button
                                                    className={`fd-action${thread.reposted ? ' fd-action--reposted' : ''}`}
                                                    onClick={(e) => handleRepost(thread.id, e)}
                                                >
                                                    {Icons.repost} <span>{formatCount(thread.reposts)}</span>
                                                </button>
                                                <button
                                                    className={`fd-action fd-action--like${thread.liked ? ' fd-action--liked' : ''} ${heartAnims.has(thread.id) ? 'fd-heart-pop' : ''}`}
                                                    onClick={(e) => handleLike(thread.id, e)}
                                                >
                                                    {thread.liked ? Icons.heartFilled : Icons.heart}
                                                    <span>{formatCount(thread.likes)}</span>
                                                </button>
                                                <button className="fd-action">
                                                    {Icons.views} <span>{formatCount(thread.views)}</span>
                                                </button>
                                                <button
                                                    className={`fd-action fd-action--bookmark${thread.bookmarked ? ' fd-action--bookmarked' : ''}`}
                                                    onClick={(e) => handleBookmark(thread.id, e)}
                                                >
                                                    {thread.bookmarked ? Icons.bookmarkFilled : Icons.bookmark}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </main>

                    {/* ── RIGHT SIDEBAR ── */}
                    <aside className="fd-right">
                        <div className="fd-search">
                            <span className="fd-search-icon">{Icons.search}</span>
                            <input
                                className="fd-search-input"
                                placeholder="Caută în feed..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="fd-suggest-box">
                            <div className="fd-suggest-header">👥 Urmărește oameni</div>
                            {SUGGESTED_USERS.map((su) => {
                                const isFollowing = followedUsers.has(su.handle);
                                return (
                                    <div key={su.handle} className="fd-suggest-user">
                                        <div className="fd-suggest-ava" style={{ background: su.color }}>
                                            {getInitials(su.name)}
                                        </div>
                                        <div className="fd-suggest-info">
                                            <div className="fd-suggest-name">
                                                {su.name}
                                                {su.verified && Icons.verified}
                                            </div>
                                            <div className="fd-suggest-handle">{su.handle}</div>
                                            <div className="fd-suggest-bio">{su.bio}</div>
                                        </div>
                                        <button
                                            className={`fd-follow-btn${isFollowing ? ' fd-follow-btn--following' : ''}`}
                                            onClick={() => handleFollow(su)}
                                        >
                                            {isFollowing ? 'Urmăresc' : 'Urmărește'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </aside>

                </div>

                <div className={`fd-toast${toast.visible ? ' fd-toast--show' : ''}`}>
                    {toast.msg}
                </div>
            </div>
        </>
    );
}
