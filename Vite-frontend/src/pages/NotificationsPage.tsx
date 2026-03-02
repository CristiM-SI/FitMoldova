import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useAuth } from '../context/AuthContext';
import { useForumContext } from '../context/ForumContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = 'like' | 'reply' | 'follow' | 'repost' | 'mention' | 'bookmark';

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
}

// ─── Mock notifications ───────────────────────────────────────────────────────

const INITIAL_NOTIFS: Notification[] = [
    {
        id: 1, type: 'like',
        fromName: 'Ion Ceban', fromHandle: '@ion_fitness', fromAvatar: 'IC', fromColor: '#1a6fff',
        content: 'a apreciat postarea ta despre maratonul din septembrie.',
        time: '2 min', read: false,
    },
    {
        id: 2, type: 'follow',
        fromName: 'Maria Lungu', fromHandle: '@maria_runs', fromAvatar: 'ML', fromColor: '#e91e8c',
        content: 'a început să te urmărească.',
        time: '15 min', read: false,
    },
    {
        id: 3, type: 'reply',
        fromName: 'Pavel Rotaru', fromHandle: '@pavel_rotaru', fromAvatar: 'PR', fromColor: '#00b894',
        content: 'a răspuns la postarea ta: "Complet de acord! Antrenamentul de dimineață e 🔥"',
        time: '1h', read: false,
    },
    {
        id: 4, type: 'repost',
        fromName: 'FitMoldova', fromHandle: '@fitmoldova', fromAvatar: 'FM', fromColor: '#9b59b6',
        content: 'a repostat postarea ta despre nutriție.',
        time: '2h', read: false,
    },
    {
        id: 5, type: 'mention',
        fromName: 'Ana Popescu', fromHandle: '@ana_fit', fromAvatar: 'AP', fromColor: '#e67e22',
        content: 'te-a menționat într-o postare: "Mulțumesc @user pentru sfaturile despre recuperare!"',
        time: '3h', read: true,
    },
    {
        id: 6, type: 'like',
        fromName: 'Dmitri Vasiliev', fromHandle: '@dmitri_runs', fromAvatar: 'DV', fromColor: '#2ecc71',
        content: 'și alți 12 au apreciat postarea ta despre #LegDay.',
        time: '5h', read: true,
    },
    {
        id: 7, type: 'bookmark',
        fromName: 'Cristina Moga', fromHandle: '@cristina_fit', fromAvatar: 'CM', fromColor: '#e74c3c',
        content: 'a salvat postarea ta despre planul de antrenament.',
        time: '1z', read: true,
    },
    {
        id: 8, type: 'follow',
        fromName: 'Radu Nistor', fromHandle: '@radu_athlete', fromAvatar: 'RN', fromColor: '#3498db',
        content: 'a început să te urmărească.',
        time: '1z', read: true,
    },
    {
        id: 9, type: 'reply',
        fromName: 'Ion Ceban', fromHandle: '@ion_fitness', fromAvatar: 'IC', fromColor: '#1a6fff',
        content: 'a răspuns la comentariul tău: "Super plan! Ai inclus și exerciții pentru mobilitate?"',
        time: '2z', read: true,
    },
];

// ─── Icon helpers ─────────────────────────────────────────────────────────────

const NOTIF_ICONS: Record<NotifType, { icon: string; color: string }> = {
    like:     { icon: '❤️', color: '#ff4d6d' },
    reply:    { icon: '💬', color: '#00c8ff' },
    follow:   { icon: '👤', color: '#00b894' },
    repost:   { icon: '🔁', color: '#00b894' },
    mention:  { icon: '@',  color: '#1a6fff' },
    bookmark: { icon: '🔖', color: '#00c8ff' },
};

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');

  .nt *, .nt *::before, .nt *::after { box-sizing:border-box; margin:0; padding:0; }
  .nt {
    --bg:#050d1a; --card:#0a1628; --card2:#0d1f3a;
    --blue:#1a6fff; --cyan:#00c8ff;
    --text:#e8f0fe; --muted:#5a7aa0;
    --border:rgba(0,200,255,0.08); --border2:rgba(0,200,255,0.14);
    --radius:16px; --red:#ff4d6d; --green:#00b894;
    font-family:'Barlow',sans-serif; background:var(--bg); color:var(--text);
    min-height:100vh; display:flex; flex-direction:column;
  }
  .nt::before {
    content:''; position:fixed; inset:0;
    background-image:linear-gradient(rgba(0,200,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,0.02) 1px,transparent 1px);
    background-size:60px 60px; pointer-events:none; z-index:0;
  }

  .nt-body { position:relative; z-index:1; flex:1; display:flex; max-width:1200px; margin:0 auto; width:100%; }

  /* ── SIDEBAR ── */
  .nt-sidebar {
    width:270px; flex-shrink:0; position:sticky; top:72px;
    height:calc(100vh - 72px); overflow-y:auto; padding:20px 16px;
    border-right:1px solid var(--border); display:flex; flex-direction:column; gap:4px;
  }
  .nt-nav-item {
    display:flex; align-items:center; gap:14px; padding:12px 16px;
    border-radius:100px; background:transparent; border:none;
    color:var(--text); font-family:'Barlow',sans-serif; font-size:.95rem; font-weight:600;
    cursor:pointer; transition:all .15s; width:100%; text-align:left;
  }
  .nt-nav-item:hover { background:rgba(0,200,255,0.06); }
  .nt-nav-item--active { font-weight:800; color:#fff; }
  .nt-nav-icon { width:24px; display:flex; align-items:center; justify-content:center; color:var(--muted); }
  .nt-nav-item--active .nt-nav-icon { color:var(--cyan); }
  .nt-nav-badge {
    margin-left:auto; background:var(--blue); color:#fff;
    border-radius:100px; padding:2px 8px; font-size:.68rem; font-weight:700;
  }
  .nt-post-btn {
    margin-top:16px; width:100%; padding:14px; border-radius:100px; border:none;
    background:linear-gradient(135deg,var(--blue),#0099ff); color:#fff;
    font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:1rem;
    letter-spacing:1px; text-transform:uppercase; cursor:pointer; transition:all .2s;
    box-shadow:0 4px 20px rgba(26,111,255,.3);
  }
  .nt-post-btn:hover { background:linear-gradient(135deg,#2a7fff,#00aaff); transform:translateY(-1px); }

  /* ── MAIN ── */
  .nt-main { flex:1; min-width:0; border-right:1px solid var(--border); }

  .nt-header {
    position:sticky; top:72px; z-index:10;
    background:rgba(5,13,26,0.9); backdrop-filter:blur(16px);
    border-bottom:1px solid var(--border); padding:16px 20px;
    display:flex; align-items:center; justify-content:space-between;
  }
  .nt-header-left { }
  .nt-header-title { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:1.25rem; letter-spacing:.5px; }
  .nt-header-sub { font-size:.78rem; color:var(--muted); margin-top:2px; }
  .nt-mark-all-btn {
    background:none; border:1.5px solid var(--border2); border-radius:100px;
    color:var(--cyan); font-family:'Barlow',sans-serif; font-size:.78rem; font-weight:600;
    padding:6px 16px; cursor:pointer; transition:all .15s; white-space:nowrap;
  }
  .nt-mark-all-btn:hover { background:rgba(0,200,255,0.06); border-color:var(--cyan); }

  /* ── FILTER TABS ── */
  .nt-tabs {
    display:flex; overflow-x:auto; scrollbar-width:none;
    border-bottom:1px solid var(--border);
  }
  .nt-tabs::-webkit-scrollbar { display:none; }
  .nt-tab {
    flex:1; min-width:max-content; padding:12px 18px;
    background:none; border:none; border-bottom:2px solid transparent;
    color:var(--muted); font-family:'Barlow',sans-serif;
    font-size:.8rem; font-weight:600; cursor:pointer; transition:all .15s; white-space:nowrap;
  }
  .nt-tab:hover { color:var(--text); }
  .nt-tab--active { color:#fff; font-weight:700; border-bottom-color:var(--cyan); }

  /* ── NOTIFICATION ITEM ── */
  .nt-item {
    display:flex; align-items:flex-start; gap:14px;
    padding:16px 20px; border-bottom:1px solid var(--border);
    cursor:pointer; transition:background .15s;
    animation:ntFadeIn .3s ease both; position:relative;
  }
  .nt-item:hover { background:rgba(0,200,255,0.025); }
  .nt-item--unread { background:rgba(26,111,255,0.04); }
  .nt-item--unread:hover { background:rgba(26,111,255,0.07); }

  .nt-unread-bar {
    position:absolute; left:0; top:0; bottom:0;
    width:3px; background:var(--blue); border-radius:0 2px 2px 0;
  }

  .nt-ava-wrap { position:relative; flex-shrink:0; }
  .nt-ava {
    width:44px; height:44px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-weight:900; font-size:.85rem; color:#fff;
  }
  .nt-type-badge {
    position:absolute; bottom:-2px; right:-4px;
    width:20px; height:20px; border-radius:50%;
    background:var(--bg); border:2px solid var(--bg);
    display:flex; align-items:center; justify-content:center;
    font-size:.7rem; line-height:1;
  }
  .nt-type-badge--text {
    font-weight:900; font-size:.58rem; color:#fff;
    background:var(--blue);
  }

  .nt-body-text { flex:1; min-width:0; }
  .nt-text {
    font-size:.88rem; line-height:1.55; color:#c8daf0; margin-bottom:4px;
  }
  .nt-text strong { color:#fff; font-weight:700; }
  .nt-time { font-size:.74rem; color:var(--muted); }

  .nt-dismiss {
    background:none; border:none; color:var(--muted); cursor:pointer;
    padding:4px; border-radius:50%; opacity:0; transition:all .15s;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .nt-item:hover .nt-dismiss { opacity:1; }
  .nt-dismiss:hover { color:var(--red); background:rgba(255,77,109,0.1); }

  /* ── EMPTY ── */
  .nt-empty {
    display:flex; flex-direction:column; align-items:center;
    justify-content:center; padding:80px 32px; text-align:center;
  }
  .nt-empty-icon { font-size:3rem; opacity:.4; margin-bottom:16px; }
  .nt-empty-title { font-family:'Barlow Condensed',sans-serif; font-size:1.3rem; font-weight:800; color:#fff; margin-bottom:8px; }
  .nt-empty-sub { font-size:.88rem; color:var(--muted); line-height:1.6; }

  /* ── RIGHT PANEL ── */
  .nt-right {
    width:300px; flex-shrink:0; position:sticky; top:72px;
    height:calc(100vh - 72px); overflow-y:auto; padding:20px 16px;
    display:flex; flex-direction:column; gap:16px;
  }
  .nt-stats-box {
    background:var(--card); border:1px solid var(--border);
    border-radius:var(--radius); padding:18px;
  }
  .nt-stats-title { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:1.05rem; margin-bottom:14px; }
  .nt-stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .nt-stat-card {
    background:var(--card2); border:1px solid var(--border2);
    border-radius:12px; padding:12px; text-align:center;
  }
  .nt-stat-val { font-family:'Barlow Condensed',sans-serif; font-size:1.5rem; font-weight:900; color:#fff; }
  .nt-stat-label { font-size:.72rem; color:var(--muted); margin-top:2px; }

  /* ── TOAST ── */
  .nt-toast {
    position:fixed; bottom:28px; left:50%; z-index:300;
    background:var(--blue); border-radius:8px; padding:12px 20px;
    font-size:.86rem; font-weight:600; color:#fff;
    box-shadow:0 8px 32px rgba(0,0,0,.5);
    transform:translate(-50%, 80px); opacity:0;
    transition:all .4s cubic-bezier(.34,1.56,.64,1); pointer-events:none;
  }
  .nt-toast--show { transform:translate(-50%, 0); opacity:1; }

  @keyframes ntFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
  .nt ::-webkit-scrollbar { width:4px; }
  .nt ::-webkit-scrollbar-thumb { background:rgba(0,200,255,.15); border-radius:100px; }

  @media (max-width:1100px) { .nt-right { display:none; } }
  @media (max-width:850px) {
    .nt-sidebar { width:72px; padding:16px 8px; }
    .nt-nav-item span:not(.nt-nav-icon), .nt-nav-badge, .nt-post-btn { display:none; }
    .nt-nav-item { justify-content:center; padding:14px; }
  }
  @media (max-width:600px) { .nt-sidebar { display:none; } .nt-main { border-right:none; } }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const FILTER_TABS = ['Toate', 'Aprecieri', 'Răspunsuri', 'Urmăritori', 'Mențiuni'];

export default function NotificationsPage() {
    const navigate = useNavigate();
    const { toast } = useForumContext();

    const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
    const [activeTab, setActiveTab] = useState('Toate');

    const unreadCount = notifs.filter((n) => !n.read).length;

    const filtered = useMemo(() => {
        if (activeTab === 'Toate') return notifs;
        const map: Record<string, NotifType[]> = {
            'Aprecieri':  ['like'],
            'Răspunsuri': ['reply'],
            'Urmăritori': ['follow'],
            'Mențiuni':   ['mention', 'repost', 'bookmark'],
        };
        return notifs.filter((n) => map[activeTab]?.includes(n.type));
    }, [notifs, activeTab]);

    const markAllRead = () => {
        setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const markRead = (id: number) => {
        setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    };

    const dismiss = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifs((prev) => prev.filter((n) => n.id !== id));
    };

    const dismissIcon = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );

    // Stats
    const totalLikes    = notifs.filter((n) => n.type === 'like').length;
    const totalReplies  = notifs.filter((n) => n.type === 'reply').length;
    const totalFollows  = notifs.filter((n) => n.type === 'follow').length;
    const totalMentions = notifs.filter((n) => n.type === 'mention').length;

    return (
        <>
            <style>{CSS}</style>
            <Navbar />
            <div className="nt">
                <div className="nt-body">

                    {/* ── SIDEBAR ── */}
                    <aside className="nt-sidebar">
                        <button className="nt-nav-item" onClick={() => navigate(ROUTES.FEED)}>
                            <span className="nt-nav-icon">🏠</span>
                            <span>Feed</span>
                        </button>
                        <button className="nt-nav-item" onClick={() => navigate(ROUTES.FORUM)}>
                            <span className="nt-nav-icon">💬</span>
                            <span>Forum</span>
                        </button>
                        <button className="nt-nav-item" onClick={() => navigate(ROUTES.COMMUNITY)}>
                            <span className="nt-nav-icon">👥</span>
                            <span>Comunitate</span>
                        </button>
                        <button className="nt-nav-item nt-nav-item--active">
                            <span className="nt-nav-icon">🔔</span>
                            <span>Notificări</span>
                            {unreadCount > 0 && <span className="nt-nav-badge">{unreadCount}</span>}
                        </button>
                        <button className="nt-nav-item" onClick={() => navigate(ROUTES.SAVED)}>
                            <span className="nt-nav-icon">🔖</span>
                            <span>Salvate</span>
                        </button>
                        <button className="nt-nav-item" onClick={() => navigate(ROUTES.PROFILE)}>
                            <span className="nt-nav-icon">👤</span>
                            <span>Profil</span>
                        </button>
                        <button className="nt-post-btn" onClick={() => navigate(ROUTES.FORUM)}>
                            Postează
                        </button>
                    </aside>

                    {/* ── MAIN ── */}
                    <main className="nt-main">
                        <div className="nt-header">
                            <div className="nt-header-left">
                                <div className="nt-header-title">🔔 Notificări</div>
                                <div className="nt-header-sub">
                                    {unreadCount > 0
                                        ? `${unreadCount} necitite`
                                        : 'Toate citite ✓'}
                                </div>
                            </div>
                            {unreadCount > 0 && (
                                <button className="nt-mark-all-btn" onClick={markAllRead}>
                                    Marchează toate ca citite
                                </button>
                            )}
                        </div>

                        {/* Filter tabs */}
                        <div className="nt-tabs">
                            {FILTER_TABS.map((tab) => (
                                <button
                                    key={tab}
                                    className={`nt-tab${activeTab === tab ? ' nt-tab--active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Notifications list */}
                        {filtered.length === 0 ? (
                            <div className="nt-empty">
                                <div className="nt-empty-icon">🔔</div>
                                <div className="nt-empty-title">Nicio notificare</div>
                                <div className="nt-empty-sub">
                                    {activeTab === 'Toate'
                                        ? 'Vei primi notificări când cineva îți apreciază sau răspunde la postări.'
                                        : `Nicio notificare în categoria „${activeTab}".`}
                                </div>
                            </div>
                        ) : (
                            filtered.map((notif, idx) => {
                                const meta = NOTIF_ICONS[notif.type];
                                const isText = notif.type === 'mention';
                                return (
                                    <div
                                        key={notif.id}
                                        className={`nt-item${notif.read ? '' : ' nt-item--unread'}`}
                                        style={{ animationDelay: `${idx * 40}ms` }}
                                        onClick={() => { markRead(notif.id); navigate(ROUTES.FORUM); }}
                                    >
                                        {!notif.read && <div className="nt-unread-bar" />}

                                        <div className="nt-ava-wrap">
                                            <div className="nt-ava" style={{ background: notif.fromColor }}>
                                                {notif.fromAvatar}
                                            </div>
                                            <div
                                                className={`nt-type-badge${isText ? ' nt-type-badge--text' : ''}`}
                                                style={isText ? undefined : { fontSize: '.8rem' }}
                                            >
                                                {isText ? '@' : meta.icon}
                                            </div>
                                        </div>

                                        <div className="nt-body-text">
                                            <div className="nt-text">
                                                <strong>{notif.fromName}</strong>{' '}
                                                {notif.content}
                                            </div>
                                            <div className="nt-time">{notif.time} în urmă</div>
                                        </div>

                                        <button
                                            className="nt-dismiss"
                                            title="Șterge notificarea"
                                            onClick={(e) => dismiss(notif.id, e)}
                                        >
                                            {dismissIcon}
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </main>

                    {/* ── RIGHT PANEL ── */}
                    <aside className="nt-right">
                        <div className="nt-stats-box">
                            <div className="nt-stats-title">📊 Activitatea ta</div>
                            <div className="nt-stats-grid">
                                <div className="nt-stat-card">
                                    <div className="nt-stat-val" style={{ color: '#ff4d6d' }}>{totalLikes}</div>
                                    <div className="nt-stat-label">Aprecieri</div>
                                </div>
                                <div className="nt-stat-card">
                                    <div className="nt-stat-val" style={{ color: '#00c8ff' }}>{totalReplies}</div>
                                    <div className="nt-stat-label">Răspunsuri</div>
                                </div>
                                <div className="nt-stat-card">
                                    <div className="nt-stat-val" style={{ color: '#00b894' }}>{totalFollows}</div>
                                    <div className="nt-stat-label">Urmăritori noi</div>
                                </div>
                                <div className="nt-stat-card">
                                    <div className="nt-stat-val" style={{ color: '#1a6fff' }}>{totalMentions}</div>
                                    <div className="nt-stat-label">Mențiuni</div>
                                </div>
                            </div>
                        </div>
                    </aside>

                </div>

                <div className={`nt-toast${toast.visible ? ' nt-toast--show' : ''}`}>
                    {toast.msg}
                </div>
            </div>
        </>
    );
}
