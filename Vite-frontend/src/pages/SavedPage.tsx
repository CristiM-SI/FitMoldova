import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useAuth } from '../context/AuthContext';
import { useForumContext } from '../context/ForumContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
    bookmarkFilled: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>),
    bookmark: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>),
    views: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>),
    verified: (<svg width="16" height="16" viewBox="0 0 24 24" fill="#1a6fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /><circle cx="12" cy="12" r="11" fill="none" stroke="#1a6fff" strokeWidth="2" /><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" transform="scale(0.6) translate(8,8)" /></svg>),
    trash: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>),
};

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');

  .sv *, .sv *::before, .sv *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .sv {
    --bg:#050d1a; --card:#0a1628; --card2:#0d1f3a;
    --blue:#1a6fff; --cyan:#00c8ff;
    --text:#e8f0fe; --muted:#5a7aa0;
    --border:rgba(0,200,255,0.08); --border2:rgba(0,200,255,0.14);
    --radius:16px; --red:#ff4d6d; --green:#00b894;
    font-family:'Barlow',sans-serif; background:var(--bg); color:var(--text);
    min-height:100vh; display:flex; flex-direction:column;
  }
  .sv::before {
    content:''; position:fixed; inset:0;
    background-image:linear-gradient(rgba(0,200,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.02) 1px,transparent 1px);
    background-size:60px 60px; pointer-events:none; z-index:0;
  }

  .sv-body { position:relative; z-index:1; flex:1; display:flex; max-width:1200px; margin:0 auto; width:100%; }

  .sv-sidebar {
    width:270px; flex-shrink:0; position:sticky; top:72px;
    height:calc(100vh - 72px); overflow-y:auto; padding:20px 16px;
    border-right:1px solid var(--border); display:flex; flex-direction:column; gap:4px;
  }
  .sv-nav-item {
    display:flex; align-items:center; gap:14px; padding:12px 16px;
    border-radius:100px; background:transparent; border:none;
    color:var(--text); font-family:'Barlow',sans-serif; font-size:.95rem; font-weight:600;
    cursor:pointer; transition:all .15s; width:100%; text-align:left;
  }
  .sv-nav-item:hover { background:rgba(0,200,255,0.06); }
  .sv-nav-item--active { font-weight:800; color:#fff; }
  .sv-nav-icon { width:24px; display:flex; align-items:center; justify-content:center; color:var(--muted); }
  .sv-nav-item--active .sv-nav-icon { color:var(--cyan); }
  .sv-post-btn {
    margin-top:16px; width:100%; padding:14px; border-radius:100px; border:none;
    background:linear-gradient(135deg,var(--blue),#0099ff); color:#fff;
    font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:1rem;
    letter-spacing:1px; text-transform:uppercase; cursor:pointer; transition:all .2s;
    box-shadow:0 4px 20px rgba(26,111,255,.3);
  }
  .sv-post-btn:hover { background:linear-gradient(135deg,#2a7fff,#00aaff); transform:translateY(-1px); }

  .sv-main { flex:1; min-width:0; border-right:1px solid var(--border); }
  .sv-header {
    position:sticky; top:72px; z-index:10;
    background:rgba(5,13,26,0.85); backdrop-filter:blur(16px);
    border-bottom:1px solid var(--border); padding:16px 20px;
    display:flex; align-items:center; justify-content:space-between;
  }
  .sv-header-left { }
  .sv-header-title { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:1.25rem; letter-spacing:.5px; }
  .sv-header-count { font-size:.8rem; color:var(--muted); margin-top:2px; }

  .sv-filter-bar {
    display:flex; gap:8px; padding:12px 20px; border-bottom:1px solid var(--border);
    overflow-x:auto; scrollbar-width:none;
  }
  .sv-filter-bar::-webkit-scrollbar { display:none; }
  .sv-filter-chip {
    padding:6px 16px; border-radius:100px; border:1.5px solid var(--border2);
    background:transparent; color:var(--muted); font-family:'Barlow',sans-serif;
    font-size:.78rem; font-weight:600; cursor:pointer; transition:all .15s; white-space:nowrap;
  }
  .sv-filter-chip:hover { border-color:var(--cyan); color:var(--text); }
  .sv-filter-chip--active { border-color:var(--cyan); color:var(--cyan); background:rgba(0,200,255,0.06); }

  .sv-thread {
    padding:16px 20px; border-bottom:1px solid var(--border);
    transition:background .15s; cursor:pointer;
    animation:svFadeIn .3s ease both;
  }
  .sv-thread:hover { background:rgba(0,200,255,0.02); }
  .sv-thread-row { display:flex; gap:12px; }
  .sv-thread-ava {
    width:44px; height:44px; border-radius:50%; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-weight:900; font-size:.85rem; color:#fff;
  }
  .sv-thread-body { flex:1; min-width:0; }
  .sv-thread-meta { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:4px; }
  .sv-author { font-weight:700; font-size:.92rem; color:#fff; }
  .sv-handle { color:var(--muted); font-size:.82rem; }
  .sv-dot { color:var(--muted); font-size:.72rem; }
  .sv-time { color:var(--muted); font-size:.82rem; }
  .sv-tag {
    margin-left:auto; background:rgba(26,111,255,0.12); color:var(--blue);
    border-radius:100px; padding:2px 10px; font-size:.68rem; font-weight:700;
  }
  .sv-content {
    font-size:.93rem; line-height:1.6; color:#c8daf0;
    white-space:pre-wrap; word-break:break-word; margin-bottom:12px;
  }
  .sv-hashtag { color:var(--cyan); font-weight:600; }
  .sv-actions { display:flex; justify-content:space-between; margin-top:2px; max-width:420px; }
  .sv-action {
    display:flex; align-items:center; gap:6px;
    background:none; border:none; color:var(--muted);
    font-size:.78rem; font-weight:600; padding:6px 10px;
    border-radius:100px; cursor:pointer; transition:all .15s;
  }
  .sv-action:hover { background:rgba(0,200,255,0.06); }
  .sv-action--like:hover { color:var(--red); }
  .sv-action--liked { color:var(--red); }
  .sv-action--bookmarked { color:var(--cyan); }
  .sv-action--remove:hover { color:var(--red); }

  .sv-empty {
    display:flex; flex-direction:column; align-items:center;
    justify-content:center; padding:80px 32px; text-align:center;
  }
  .sv-empty-icon { font-size:3rem; margin-bottom:16px; opacity:.5; }
  .sv-empty-title { font-family:'Barlow Condensed',sans-serif; font-size:1.3rem; font-weight:800; color:#fff; margin-bottom:8px; }
  .sv-empty-sub { font-size:.88rem; color:var(--muted); line-height:1.6; max-width:320px; }
  .sv-empty-btn {
    margin-top:20px; padding:10px 28px; border-radius:100px;
    border:none; background:var(--blue); color:#fff;
    font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:.9rem;
    letter-spacing:.5px; cursor:pointer; transition:all .15s;
  }
  .sv-empty-btn:hover { background:#2a7fff; transform:translateY(-1px); }

  .sv-toast {
    position:fixed; bottom:28px; left:50%; z-index:300;
    background:var(--blue); border-radius:8px; padding:12px 20px;
    font-size:.86rem; font-weight:600; color:#fff;
    box-shadow:0 8px 32px rgba(0,0,0,.5);
    transform:translate(-50%, 80px); opacity:0;
    transition:all .4s cubic-bezier(.34,1.56,.64,1); pointer-events:none;
  }
  .sv-toast--show { transform:translate(-50%, 0); opacity:1; }

  @keyframes svFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  .sv ::-webkit-scrollbar { width:4px; }
  .sv ::-webkit-scrollbar-thumb { background:rgba(0,200,255,.15); border-radius:100px; }
  @media (max-width:850px) {
    .sv-sidebar { width:72px; padding:16px 8px; }
    .sv-nav-item span:not(.sv-nav-icon), .sv-post-btn { display:none; }
    .sv-nav-item { justify-content:center; padding:14px; }
  }
  @media (max-width:600px) { .sv-sidebar { display:none; } .sv-main { border-right:none; } }
`;

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
                ? <span key={i} className="sv-hashtag">{part}</span>
                : <span key={i}>{part}</span>
        );

    return (
        <>
            <style>{CSS}</style>
            <Navbar />
            <div className="sv">
                <div className="sv-body">

                    {/* ── LEFT SIDEBAR ── */}
                    <aside className="sv-sidebar">
                        <button className="sv-nav-item" onClick={() => navigate(ROUTES.FEED)}>
                            <span className="sv-nav-icon">🏠</span>
                            <span>Feed</span>
                        </button>
                        <button className="sv-nav-item" onClick={() => navigate(ROUTES.FORUM)}>
                            <span className="sv-nav-icon">💬</span>
                            <span>Forum</span>
                        </button>
                        <button className="sv-nav-item" onClick={() => navigate(ROUTES.COMMUNITY)}>
                            <span className="sv-nav-icon">👥</span>
                            <span>Comunitate</span>
                        </button>
                        <button className="sv-nav-item" onClick={() => navigate(ROUTES.MESSAGES)}>
                            <span className="sv-nav-icon">✉️</span>
                            <span>Mesaje</span>
                        </button>
                        <button className="sv-nav-item sv-nav-item--active">
                            <span className="sv-nav-icon">🔖</span>
                            <span>Salvate</span>
                        </button>
                        <button className="sv-nav-item" onClick={() => navigate(ROUTES.PROFILE)}>
                            <span className="sv-nav-icon">👤</span>
                            <span>Profil</span>
                        </button>
                        <button className="sv-post-btn" onClick={() => navigate(ROUTES.FORUM)}>
                            Postează
                        </button>
                    </aside>

                    {/* ── MAIN ── */}
                    <main className="sv-main">
                        <div className="sv-header">
                            <div className="sv-header-left">
                                <div className="sv-header-title">🔖 Salvate</div>
                                <div className="sv-header-count">
                                    {savedThreads.length} {savedThreads.length === 1 ? 'postare salvată' : 'postări salvate'}
                                </div>
                            </div>
                        </div>

                        {/* Filter chips */}
                        <div className="sv-filter-bar">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    className={`sv-filter-chip${filter === cat ? ' sv-filter-chip--active' : ''}`}
                                    onClick={() => setFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {savedThreads.length === 0 ? (
                            <div className="sv-empty">
                                <div className="sv-empty-icon">🔖</div>
                                <div className="sv-empty-title">
                                    {filter === 'Toate' ? 'Nicio postare salvată' : `Nimic în categoria "${filter}"`}
                                </div>
                                <div className="sv-empty-sub">
                                    {filter === 'Toate'
                                        ? 'Apasă iconița bookmark pe orice postare din forum pentru a o salva aici.'
                                        : 'Nu ai postări salvate din această categorie.'}
                                </div>
                                <button className="sv-empty-btn" onClick={() => navigate(ROUTES.FORUM)}>
                                    Explorează Forum
                                </button>
                            </div>
                        ) : (
                            savedThreads.map((thread, idx) => (
                                <div
                                    key={thread.id}
                                    className="sv-thread"
                                    style={{ animationDelay: `${idx * 40}ms` }}
                                    onClick={() => navigate(ROUTES.FORUM)}
                                >
                                    <div className="sv-thread-row">
                                        <div className="sv-thread-ava" style={{ background: thread.color }}>
                                            {thread.avatar}
                                        </div>
                                        <div className="sv-thread-body">
                                            <div className="sv-thread-meta">
                                                <span className="sv-author">{thread.author}</span>
                                                {thread.verified && <span>{Icons.verified}</span>}
                                                <span className="sv-handle">{thread.handle}</span>
                                                <span className="sv-dot">·</span>
                                                <span className="sv-time">{thread.time}</span>
                                                <span className="sv-tag">{thread.category}</span>
                                            </div>
                                            <div className="sv-content">{renderContent(thread.content)}</div>
                                            <div className="sv-actions" onClick={(e) => e.stopPropagation()}>
                                                <button className="sv-action">
                                                    {Icons.reply} <span>{thread.replies.length}</span>
                                                </button>
                                                <button
                                                    className={`sv-action sv-action--like${thread.liked ? ' sv-action--liked' : ''} ${heartAnims.has(thread.id) ? 'sv-heart-pop' : ''}`}
                                                    onClick={(e) => handleLike(thread.id, e)}
                                                >
                                                    {thread.liked ? Icons.heartFilled : Icons.heart}
                                                    <span>{formatCount(thread.likes)}</span>
                                                </button>
                                                <button className="sv-action">
                                                    {Icons.views} <span>{formatCount(thread.views)}</span>
                                                </button>
                                                <button
                                                    className="sv-action sv-action--bookmarked sv-action--remove"
                                                    onClick={(e) => handleBookmark(thread.id, e)}
                                                    title="Elimină din salvate"
                                                >
                                                    {Icons.bookmarkFilled}
                                                    <span style={{ fontSize: '.72rem' }}>Elimină</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </main>

                </div>

                <div className={`sv-toast${toast.visible ? ' sv-toast--show' : ''}`}>
                    {toast.msg}
                </div>
            </div>
        </>
    );
}
