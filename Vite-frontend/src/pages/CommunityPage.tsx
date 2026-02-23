import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useDashboardData } from '../context/useDashboardData';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import {
    SPORTS, SPORT_CHIPS, INITIAL_CHALLENGES, MEMBERS,
} from '../services/mock/community';
import type {
    Sport, FeedTab, Post, Challenge, ToastState,
} from '../services/mock/community';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const getInitials = (name: string): string =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

interface CircleProgressProps { pct: number; uid: string; }
function CircleProgress({ pct, uid }: CircleProgressProps) {
    const r = 28;
    const circ = 2 * Math.PI * r;
    return (
        <div style={{ position: 'relative', width: 70, height: 70, flexShrink: 0 }}>
            <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle
                    cx="35" cy="35" r={r} fill="none"
                    stroke={`url(#g-${uid})`} strokeWidth="6"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - pct / 100)}
                    strokeLinecap="round"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
                <defs>
                    <linearGradient id={`g-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#1a6fff" />
                        <stop offset="100%" stopColor="#00c8ff" />
                    </linearGradient>
                </defs>
            </svg>
            <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 900, color: 'var(--cyan)',
            }}>
                {pct}%
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,900&family=Barlow:wght@300;400;500;600;700&display=swap');

  .fm *, .fm *::before, .fm *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .fm {
    --bg:       #050d1a;
    --card:     #0a1628;
    --card2:    #0d1f3a;
    --blue:     #1a6fff;
    --cyan:     #00c8ff;
    --cdim:     rgba(0,200,255,0.10);
    --bdim:     rgba(26,111,255,0.12);
    --text:     #e8f0fe;
    --muted:    #5a7aa0;
    --border:   rgba(0,200,255,0.12);
    --radius:   14px;
    font-family: 'Barlow', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .fm::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,200,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index: 0;
  }

  /* ── TOPNAV ── */
  .fm-topnav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 64px;
    background: rgba(5,13,26,0.95);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .fm-logo { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 1.45rem; letter-spacing: 1px; color: #fff; cursor: pointer; }
  .fm-logo span { color: var(--cyan); }
  .fm-topnav-links { display: flex; gap: 28px; list-style: none; }
  .fm-topnav-links a {
    color: var(--muted); text-decoration: none; font-size: .8rem;
    font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
    transition: color .2s; cursor: pointer;
  }
  .fm-topnav-links a:hover { color: #fff; }
  .fm-topnav-links a.active { color: var(--cyan); }
  .fm-topnav-actions { display: flex; gap: 10px; }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 20px; border-radius: 8px;
    font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
    font-size: .85rem; letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer; transition: all .2s; border: none;
  }
  .btn-outline { border: 1.5px solid var(--cyan); color: var(--cyan); background: transparent; }
  .btn-outline:hover { background: var(--cdim); }
  .btn-solid { background: var(--blue); color: #fff; }
  .btn-solid:hover { background: #2a7fff; box-shadow: 0 0 24px rgba(26,111,255,.5); }

  /* ── LAYOUT ── */
  .fm-body {
    position: relative; z-index: 1; flex: 1;
    display: flex; max-width: 1340px; margin: 0 auto;
    width: 100%; padding: 28px; gap: 24px;
  }

  /* ── LEFT SIDEBAR ── */
  .fm-leftnav { width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; }
  .leftnav-section-title {
    font-size: .68rem; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--muted);
    padding: 4px 12px 6px;
  }
  .nav-divider { height: 1px; background: var(--border); margin: 6px 0; }

  /* profile chip in sidebar */
  .profile-chip {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 14px; background: var(--card2);
    border-radius: 10px; border: 1px solid var(--border);
    margin-bottom: 6px; cursor: pointer; transition: border-color .2s;
  }
  .profile-chip:hover { border-color: rgba(0,200,255,.25); }
  .profile-chip-ava {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: .85rem; color: #fff; flex-shrink: 0;
  }
  .profile-chip-name { font-weight: 700; font-size: .88rem; }
  .profile-chip-tag  { font-size: .72rem; color: var(--muted); margin-top: 1px; }

  /* nav items */
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px; border: 1px solid transparent;
    background: transparent; color: var(--muted);
    font-family: 'Barlow', sans-serif; font-size: .88rem; font-weight: 600;
    cursor: pointer; transition: all .2s; width: 100%; text-align: left;
  }
  .nav-item:hover:not(.nav-item--disabled)    { background: var(--cdim); color: #fff; }
  .nav-item.nav-item--active                  { background: var(--bdim); color: var(--cyan); border-color: rgba(26,111,255,.2); }
  .nav-item--disabled                         { opacity: .45; cursor: not-allowed; }
  .nav-item__icon                             { font-size: 1.1rem; width: 22px; text-align: center; flex-shrink: 0; }
  .nav-item__badge {
    margin-left: auto; border-radius: 100px;
    padding: 2px 8px; font-size: .62rem; font-weight: 700; letter-spacing: .5px; text-transform: uppercase;
  }
  .nav-item__badge--count { background: var(--cdim); color: var(--cyan); }
  .nav-item__badge--soon  { background: rgba(255,145,0,.12); color: #ff9100; }

  /* ── CENTER ── */
  .fm-center { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 18px; }

  /* ── CARD ── */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; transition: border-color .2s; }
  .card:hover { border-color: rgba(0,200,255,.2); }
  .card-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: .95rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    color: #fff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  }

  /* ── CREATE POST ── */
  .create-row { display: flex; gap: 12px; }
  .user-ava {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: .9rem;
    color: #fff; flex-shrink: 0;
  }
  .create-body { flex: 1; }
  .create-textarea {
    width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
    padding: 12px 16px; color: var(--text); font-family: 'Barlow', sans-serif;
    font-size: .88rem; resize: none; min-height: 76px; outline: none; transition: border-color .2s;
  }
  .create-textarea:focus { border-color: rgba(0,200,255,.4); }
  .create-textarea::placeholder { color: var(--muted); }
  .create-actions { display: flex; gap: 8px; margin-top: 10px; align-items: center; flex-wrap: wrap; }
  .select-sport {
    background: var(--bg); border: 1px solid var(--border); color: var(--muted);
    border-radius: 7px; padding: 6px 10px; font-size: .78rem; outline: none; cursor: pointer;
    transition: border-color .2s; font-family: 'Barlow', sans-serif;
  }
  .select-sport:focus { border-color: rgba(0,200,255,.4); color: var(--text); }
  .media-btn {
    background: var(--bg); border: 1px solid var(--border); color: var(--muted);
    border-radius: 7px; padding: 6px 13px; font-size: .78rem; font-weight: 600;
    cursor: pointer; transition: all .2s;
  }
  .media-btn:hover { border-color: var(--cyan); color: var(--cyan); }

  /* ── SPORT CHIPS ── */
  .chips { display: flex; flex-wrap: wrap; gap: 7px; }
  .chip {
    padding: 5px 12px; border-radius: 100px; border: 1px solid var(--border);
    background: transparent; color: var(--muted); font-size: .74rem; font-weight: 600;
    cursor: pointer; transition: all .2s; white-space: nowrap;
  }
  .chip--active { background: var(--cyan); color: var(--bg); border-color: var(--cyan); }
  .chip:not(.chip--active):hover { border-color: var(--cyan); color: var(--cyan); }

  /* ── FEED ── */
  .feed { display: flex; flex-direction: column; gap: 14px; }

  /* empty state */
  .empty { text-align: center; padding: 64px 24px; color: var(--muted); }
  .empty__icon { font-size: 2.8rem; margin-bottom: 14px; opacity: .5; }
  .empty__title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .empty__sub { font-size: .85rem; line-height: 1.65; }

  /* post card */
  .post {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; transition: border-color .2s, transform .2s;
    animation: fadeUp .3s ease both;
  }
  .post:hover { border-color: rgba(0,200,255,.2); transform: translateY(-2px); }
  .post__header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .post__ava {
    width: 42px; height: 42px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: .9rem; color: #fff; flex-shrink: 0;
  }
  .post__author { font-weight: 700; font-size: .9rem; }
  .post__time   { font-size: .72rem; color: var(--muted); margin-top: 1px; }
  .post__badge  {
    margin-left: auto; font-size: .7rem;
    background: var(--cdim); color: var(--cyan);
    border: 1px solid rgba(0,200,255,.2);
    padding: 3px 10px; border-radius: 100px; font-weight: 600;
  }
  .post__tag {
    display: inline-block; background: var(--bdim); color: var(--blue);
    border-radius: 6px; padding: 2px 9px; font-size: .72rem; font-weight: 600;
    margin-bottom: 10px;
  }
  .post__content { font-size: .88rem; line-height: 1.65; color: #c8d8f0; margin-bottom: 14px; }
  .post__actions { display: flex; gap: 4px; border-top: 1px solid var(--border); padding-top: 12px; }
  .post-btn {
    display: flex; align-items: center; gap: 5px;
    background: transparent; border: none; color: var(--muted);
    font-family: 'Barlow', sans-serif; font-size: .79rem; font-weight: 600;
    padding: 5px 11px; border-radius: 7px; cursor: pointer; transition: all .2s;
  }
  .post-btn:hover          { background: var(--cdim); color: var(--cyan); }
  .post-btn--liked         { color: #ff4d6d; }
  .post-btn--liked:hover   { background: rgba(255,77,109,.1); }

  /* ── CHALLENGES ── */
  .sec-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.5rem; font-weight: 900; letter-spacing: -.5px; margin-bottom: 4px; }
  .sec-sub   { font-size: .84rem; color: var(--muted); margin-bottom: 18px; }

  .challenge {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; display: grid; grid-template-columns: 1fr 80px; gap: 16px; align-items: center;
    transition: border-color .2s, transform .2s; animation: fadeUp .3s ease both;
  }
  .challenge:hover { border-color: rgba(0,200,255,.25); transform: translateY(-2px); box-shadow: 0 0 28px rgba(0,200,255,.08); }
  .ch__emoji { font-size: 1.6rem; margin-bottom: 6px; }
  .ch__title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.15rem; font-weight: 700; margin-bottom: 5px; }
  .ch__desc  { font-size: .81rem; color: var(--muted); line-height: 1.55; margin-bottom: 12px; }
  .ch__meta  { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 12px; }
  .ch__pill  { display: flex; align-items: center; gap: 5px; font-size: .74rem; font-weight: 600; color: var(--muted); }
  .ch__dot   { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .ch__join  { width: 100%; padding: 9px; border-radius: 8px; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: .85rem; letter-spacing: 1px; cursor: pointer; transition: all .2s; border: none; }
  .ch__join--default { background: var(--blue); color: #fff; }
  .ch__join--default:hover { background: #2a7fff; box-shadow: 0 0 18px rgba(26,111,255,.5); }
  .ch__join--joined  { background: var(--cdim); color: var(--cyan); border: 1px solid rgba(0,200,255,.3) !important; }

  /* ── MEMBERS ── */
  .member-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(178px, 1fr)); gap: 14px; }
  .member-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; text-align: center; cursor: pointer; transition: border-color .2s, transform .2s;
  }
  .member-card:hover { border-color: rgba(0,200,255,.3); transform: translateY(-2px); }
  .m__ava   { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 900; color: #fff; margin: 0 auto 10px; }
  .m__name  { font-weight: 700; font-size: .9rem; margin-bottom: 3px; }
  .m__sub   { color: var(--muted); font-size: .73rem; margin-bottom: 8px; }
  .m__rank  { background: var(--cdim); color: var(--cyan); border-radius: 6px; padding: 3px 0; font-size: .72rem; font-weight: 700; margin-bottom: 8px; }
  .m__pts   { font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 900; color: var(--cyan); }
  .m__pts span { font-size: .68rem; color: var(--muted); }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 28px; right: 28px; z-index: 300;
    background: var(--card); border: 1px solid rgba(0,200,255,.3);
    border-radius: 12px; padding: 13px 18px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,.5); font-size: .86rem;
    transform: translateY(80px); opacity: 0;
    transition: all .4s cubic-bezier(.34, 1.56, .64, 1);
    pointer-events: none;
  }
  .toast--show { transform: translateY(0); opacity: 1; }

  .fm ::-webkit-scrollbar { width: 5px; }
  .fm ::-webkit-scrollbar-thumb { background: rgba(0,200,255,.2); border-radius: 100px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  @keyframes pulse  { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(.8); } }
  .pulse { animation: pulse 1.5s infinite; }
`;

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CommunityPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const [tab, setTab]               = useState<FeedTab>('feed');
    const [filter, setFilter]         = useState<Sport | 'all'>('all');
    const [posts, setPosts]           = useState<Post[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
    const [postInput, setPostInput]   = useState<string>('');
    const [postSport, setPostSport]   = useState<Sport>('Fotbal');
    const [toast, setToast]           = useState<ToastState>({ icon: '', msg: '', visible: false });

    // Dashboard sync — adaugă/scoate provocări în dashboard când user-ul e logat
    const { addProvocare, removeProvocare } = useDashboardData();
    const { completeChallenge } = useProgress();

    const showToast = useCallback((icon: string, msg: string): void => {
        setToast({ icon, msg, visible: true });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    }, []);

    const handlePublish = useCallback((): void => {
        if (!postInput.trim()) { showToast('⚠️', 'Scrie ceva înainte de a publica!'); return; }
        const newPost: Post = {
            id:       Date.now(),
            author:   'Alexandru Mihai',
            color:    '#1a6fff',
            sport:    postSport,
            time:     'acum câteva secunde',
            content:  postInput.trim(),
            likes:    0,
            comments: 0,
            liked:    false,
        };
        setPosts((prev) => [newPost, ...prev]);
        setPostInput('');
        showToast('✅', 'Postare publicată!');
    }, [postInput, postSport, showToast]);

    const handleLike = useCallback((id: number): void => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
            ),
        );
    }, []);

    const handleJoin = useCallback((id: number): void => {
        setChallenges((prev) =>
            prev.map((c) => {
                if (c.id !== id) return c;
                const joining = !c.joined;
                showToast(joining ? '🏆' : '👋', joining ? 'Te-ai alăturat provocării!' : 'Ai ieșit din provocare.');

                // Sincronizare cu Dashboard-ul
                if (isAuthenticated) {
                    if (joining) {
                        // Convertim Challenge → Provocare și adăugăm în dashboard
                        const difficulty = c.days <= 7 ? 'Ușor' : c.days <= 30 ? 'Mediu' : 'Greu';
                        addProvocare({
                            id: 10000 + c.id, // ID unic (offset pentru a evita coliziuni cu mock)
                            name: c.title,
                            description: c.desc,
                            participants: c.participants + 1,
                            duration: `${c.days} zile`,
                            difficulty: difficulty as 'Ușor' | 'Mediu' | 'Greu',
                            progress: 0,
                        });
                        completeChallenge();
                    } else {
                        // Scoatem din dashboard
                        removeProvocare(10000 + c.id);
                    }
                }

                return { ...c, joined: joining, participants: joining ? c.participants + 1 : c.participants - 1 };
            }),
        );
    }, [showToast, isAuthenticated, addProvocare, removeProvocare, completeChallenge]);

    const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.sport === filter);

    // Left nav items — internal tabs + route-based items
    const NAV_ITEMS = [
        { id: 'feed',       icon: '📰', label: 'Feed',      badge: null,                   action: () => setTab('feed'),       isTab: true  },
        { id: 'challenges', icon: '🏆', label: 'Provocări', badge: { text: '15', type: 'count' as const }, action: () => setTab('challenges'), isTab: true  },
        { id: 'members',    icon: '👥', label: 'Membri',    badge: null,                   action: () => setTab('members'),    isTab: true  },
        { divider: true },
        { id: 'clubs',      icon: '🏟️', label: 'Cluburi',   badge: { text: 'În curând', type: 'soon' as const },  action: () => navigate(ROUTES.CLUBS),  isTab: false },
        { id: 'forum',      icon: '💬', label: 'Forum',     badge: { text: 'În curând', type: 'soon' as const },  action: () => navigate(ROUTES.FORUM),  isTab: false },
    ] as const;

    const isNavActive = (item: (typeof NAV_ITEMS)[number]): boolean => {
        if (!('id' in item)) return false;
        if (item.isTab) return tab === item.id;
        return location.pathname === (item.id === 'clubs' ? ROUTES.CLUBS : ROUTES.FORUM);
    };

    return (
        <>
            <style>{CSS}</style>
            <Navbar/>
            <div className="fm">


                {/* ── TOP NAV ── */}


                {/* ── BODY ── */}
                <div className="fm-body">

                    {/* ── LEFT NAV ── */}
                    <aside className="fm-leftnav">
                        {/* Profile chip */}
                        <div className="profile-chip" onClick={() => navigate(ROUTES.PROFILE)}>
                            <div className="profile-chip-ava">AM</div>
                            <div>
                                <div className="profile-chip-name">Alexandru Mihai</div>
                                <div className="profile-chip-tag">@alex.mihai</div>
                            </div>
                        </div>

                        <div className="leftnav-section-title">Comunitate</div>

                        {NAV_ITEMS.map((item, i) => {
                            if ('divider' in item) return <div key={i} className="nav-divider" />;

                            const active = isNavActive(item);

                            return (
                                <button
                                    key={item.id}
                                    className={[
                                        'nav-item',
                                        active ? 'nav-item--active' : '',
                                    ].join(' ')}
                                    onClick={item.action}
                                >
                                    <span className="nav-item__icon">{item.icon}</span>
                                    {item.label}
                                    {item.badge && (
                                        <span className={`nav-item__badge nav-item__badge--${item.badge.type}`}>
                      {item.badge.text}
                    </span>
                                    )}
                                </button>
                            );
                        })}
                    </aside>

                    {/* ── CENTER CONTENT ── */}
                    <div className="fm-center">

                        {/* ════ FEED ════ */}
                        {tab === 'feed' && (
                            <>
                                {/* Create Post */}
                                <div className="card">
                                    <div className="create-row">
                                        <div className="user-ava">AM</div>
                                        <div className="create-body">
                      <textarea
                          className="create-textarea"
                          placeholder="Distribuie antrenamentul tău, un sfat sau o realizare…"
                          value={postInput}
                          onChange={(e) => setPostInput(e.target.value)}
                      />
                                            <div className="create-actions">
                                                <select
                                                    className="select-sport"
                                                    value={postSport}
                                                    onChange={(e) => setPostSport(e.target.value as Sport)}
                                                >
                                                    {SPORTS.map((s) => <option key={s}>{s}</option>)}
                                                </select>
                                                <button className="media-btn" onClick={() => setPostInput((v) => v + ' 📸')}>📸 Foto</button>
                                                <button className="media-btn" onClick={() => setPostInput((v) => v + ' 💪')}>💪 Workout</button>
                                                <button
                                                    className="btn btn-solid"
                                                    style={{ marginLeft: 'auto', padding: '7px 18px' }}
                                                    onClick={handlePublish}
                                                >
                                                    Publică
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sport filter */}
                                <div className="card" style={{ padding: '14px 18px' }}>
                                    <div className="chips">
                                        {SPORT_CHIPS.map((c) => (
                                            <button
                                                key={c.value}
                                                className={`chip${filter === c.value ? ' chip--active' : ''}`}
                                                onClick={() => setFilter(c.value)}
                                            >
                                                {c.emoji} {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Posts */}
                                <div className="feed">
                                    {filteredPosts.length === 0 ? (
                                        <div className="empty">
                                            <div className="empty__icon">📭</div>
                                            <div className="empty__title">Nicio postare încă</div>
                                            <div className="empty__sub">
                                                Fii primul care distribuie ceva cu comunitatea!<br />
                                                Scrie mai sus și apasă Publică.
                                            </div>
                                        </div>
                                    ) : (
                                        filteredPosts.map((p) => (
                                            <div className="post" key={p.id}>
                                                <div className="post__header">
                                                    <div className="post__ava" style={{ background: p.color }}>
                                                        {getInitials(p.author)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div className="post__author">{p.author}</div>
                                                        <div className="post__time">{p.time}</div>
                                                    </div>
                                                    <span className="post__badge">{p.sport}</span>
                                                </div>
                                                <div className="post__tag">#{p.sport}</div>
                                                <div className="post__content">{p.content}</div>
                                                <div className="post__actions">
                                                    <button
                                                        className={`post-btn${p.liked ? ' post-btn--liked' : ''}`}
                                                        onClick={() => handleLike(p.id)}
                                                    >
                                                        {p.liked ? '❤️' : '🤍'} {p.likes}
                                                    </button>
                                                    <button className="post-btn">💬 {p.comments}</button>
                                                    <button className="post-btn">🔗 Distribuie</button>
                                                    <button className="post-btn" style={{ marginLeft: 'auto' }}>🔖 Salvează</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        {/* ════ PROVOCĂRI ════ */}
                        {tab === 'challenges' && (
                            <>
                                <div>
                                    <div className="sec-title">Provocări Active 🔥</div>
                                    <div className="sec-sub">Alătură-te și câștigă puncte în clasament</div>
                                </div>
                                <div className="feed">
                                    {challenges.map((c) => (
                                        <div className="challenge" key={c.id}>
                                            <div>
                                                <div className="ch__emoji">{c.sport}</div>
                                                <div className="ch__title">{c.title}</div>
                                                <div className="ch__desc">{c.desc}</div>
                                                <div className="ch__meta">
                                                    <div className="ch__pill">
                                                        <div className="ch__dot" style={{ background: '#00e676' }} />
                                                        {c.participants.toLocaleString()} participanți
                                                    </div>
                                                    <div className="ch__pill">
                                                        <div className="ch__dot" style={{ background: '#ff9100' }} />
                                                        {c.days} zile rămase
                                                    </div>
                                                </div>
                                                <button
                                                    className={`ch__join ${c.joined ? 'ch__join--joined' : 'ch__join--default'}`}
                                                    onClick={() => handleJoin(c.id)}
                                                >
                                                    {c.joined ? '✓ Înrolat' : 'Alătură-te'}
                                                </button>
                                            </div>
                                            <CircleProgress pct={c.progress} uid={String(c.id)} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* ════ MEMBRI ════ */}
                        {tab === 'members' && (
                            <>
                                <div>
                                    <div className="sec-title">Membri Comunitate 👥</div>
                                    <div className="sec-sub">Sportivi activi din Moldova</div>
                                </div>
                                <div className="member-grid">
                                    {MEMBERS.map((m) => (
                                        <div className="member-card" key={m.name}>
                                            <div className="m__ava" style={{ background: m.color, boxShadow: `0 0 14px ${m.color}44` }}>
                                                {getInitials(m.name)}
                                            </div>
                                            <div className="m__name">{m.name}</div>
                                            <div className="m__sub">📍 {m.city} · {m.sport}</div>
                                            <div className="m__rank">{m.rank}</div>
                                            <div className="m__pts">{m.points.toLocaleString()} <span>pts</span></div>
                                            <button
                                                className="btn btn-outline"
                                                style={{ width: '100%', justifyContent: 'center', marginTop: 10, fontSize: '.73rem', padding: '6px' }}
                                                onClick={() => showToast('👤', 'Profil în curând!')}
                                            >
                                                Urmărește
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                    </div>
                </div>

                {/* ── TOAST ── */}
                <div className={`toast${toast.visible ? ' toast--show' : ''}`}>
                    <span style={{ fontSize: '1.2rem' }}>{toast.icon}</span>
                    <span>{toast.msg}</span>
                </div>

            </div>
        </>
    );
}
