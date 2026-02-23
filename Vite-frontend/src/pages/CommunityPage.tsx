import { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/paths';
import './Dashboard.css';
import './DashboardOverlays.css';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type Sport =
    | 'Fotbal' | 'Trântă' | 'Lupte' | 'Box' | 'Judo'
    | 'Baschet' | 'Rugby' | 'Caiac-Canoe' | 'Haltere' | 'Volei'
    | 'Atletism' | 'Tenis de Masă' | 'Ciclism' | 'Înot' | 'Handbal';

type FeedTab = 'feed' | 'challenges' | 'members';

interface Post {
    id:       number;
    author:   string;
    color:    string;
    sport:    Sport;
    time:     string;
    content:  string;
    likes:    number;
    comments: number;
    liked:    boolean;
}

interface Challenge {
    id:           number;
    sport:        string;
    title:        string;
    desc:         string;
    participants: number;
    days:         number;
    progress:     number;
    joined:       boolean;
}

interface Member {
    name:   string;
    city:   string;
    sport:  Sport;
    points: number;
    rank:   string;
    color:  string;
}

interface ToastState {
    icon:    string;
    msg:     string;
    visible: boolean;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const SPORTS: Sport[] = [
    'Fotbal', 'Trântă', 'Lupte', 'Box', 'Judo',
    'Baschet', 'Rugby', 'Caiac-Canoe', 'Haltere', 'Volei',
    'Atletism', 'Tenis de Masă', 'Ciclism', 'Înot', 'Handbal',
];

const SPORT_CHIPS: { emoji: string; label: string; value: Sport | 'all' }[] = [
    { emoji: '',    label: 'Toate',         value: 'all' },
    { emoji: '⚽',  label: 'Fotbal',        value: 'Fotbal' },
    { emoji: '🥊',  label: 'Box',           value: 'Box' },
    { emoji: '🏃',  label: 'Atletism',      value: 'Atletism' },
    { emoji: '🚴',  label: 'Ciclism',       value: 'Ciclism' },
    { emoji: '🏊',  label: 'Înot',          value: 'Înot' },
    { emoji: '🏋️',  label: 'Haltere',       value: 'Haltere' },
    { emoji: '🏀',  label: 'Baschet',       value: 'Baschet' },
    { emoji: '🏐',  label: 'Volei',         value: 'Volei' },
    { emoji: '🥋',  label: 'Judo',          value: 'Judo' },
    { emoji: '🏉',  label: 'Rugby',         value: 'Rugby' },
];

const INITIAL_CHALLENGES: Challenge[] = [
    { id: 1,  sport: '⚽',  title: '30 Zile Fotbal Daily',    desc: 'Practică dribling, pase sau șuturi zilnic 30 de zile.',          participants: 1540, days: 8,  progress: 73, joined: false },
    { id: 2,  sport: '🥊',  title: '100 Box Rounds',          desc: 'Completează 100 de runde de box în 2 săptămâni.',                participants: 380,  days: 6,  progress: 45, joined: false },
    { id: 3,  sport: '🏃',  title: '30 Zile Alergare',        desc: 'Aleargă cel puțin 5km zilnic timp de 30 de zile.',               participants: 1240, days: 12, progress: 68, joined: true  },
    { id: 4,  sport: '🥋',  title: 'Judo Ippone Quest',       desc: 'Reușește 20 de ippone-uri în meciuri sau randori în 30 de zile.', participants: 290,  days: 14, progress: 58, joined: false },
    { id: 5,  sport: '🚴',  title: 'Ciclism 200km Moldova',   desc: 'Pedalează 200km pe orice traseu din Moldova în 3 săptămâni.',    participants: 540,  days: 15, progress: 55, joined: false },
    { id: 6,  sport: '🏊',  title: 'Open Water Swim 5km',     desc: 'Înot 5km total în piscine publice în 14 zile.',                  participants: 210,  days: 9,  progress: 38, joined: false },
    { id: 7,  sport: '🏋️',  title: 'Halter Maxim – PR Nou',   desc: 'Bate-ți recordul personal la orice ridicare în 30 de zile.',     participants: 330,  days: 20, progress: 20, joined: false },
    { id: 8,  sport: '🏀',  title: '1000 Aruncări Baschet',   desc: 'Aruncă 1000 de mingi la coș în 30 de zile.',                    participants: 820,  days: 18, progress: 40, joined: false },
    { id: 9,  sport: '🤼',  title: 'Trântă 100 Prize',        desc: 'Câștigă 100 de lupte la antrenament în 2 luni.',                 participants: 210,  days: 45, progress: 35, joined: false },
    { id: 10, sport: '🏉',  title: 'Rugby Fitness Challenge', desc: 'Sprint, tackling bags – 3 sesiuni/săptămână, 6 săptămâni.',     participants: 310,  days: 25, progress: 50, joined: false },
    { id: 11, sport: '🏐',  title: 'Volei 1000 Pase',         desc: 'Exersează 1000 pase cu partener sau la perete în 2 săptămâni.', participants: 440,  days: 10, progress: 62, joined: false },
    { id: 12, sport: '🏓',  title: 'Ping Pong 500 Schimburi', desc: 'Joacă 500 de schimburi consecutive fără greșeală.',              participants: 160,  days: 7,  progress: 45, joined: false },
    { id: 13, sport: '🤾',  title: 'Handbal 50 Goluri',       desc: 'Marchează 50 de goluri la antrenamente în 30 de zile.',          participants: 270,  days: 22, progress: 48, joined: false },
    { id: 14, sport: '🛶',  title: 'Caiac 100km pe Nistru',   desc: 'Pedalează 100km pe apă în orice combinație în 4 săptămâni.',     participants: 95,   days: 21, progress: 30, joined: false },
    { id: 15, sport: '🤼‍♂️', title: 'Lupte Greco-Romane',     desc: 'Completează 50 sesiuni de lupte greco-romane în 3 luni.',       participants: 180,  days: 60, progress: 20, joined: false },
];

const MEMBERS: Member[] = [
    { name: 'Ion Popescu',    city: 'Chișinău', sport: 'Box',           points: 2340, rank: 'Campion',     color: '#1a6fff' },
    { name: 'Maria Lazăr',    city: 'Bălți',    sport: 'Atletism',      points: 1980, rank: 'Expert',      color: '#00b4d8' },
    { name: 'Dumitru Rusu',   city: 'Chișinău', sport: 'Judo',          points: 3100, rank: 'Maestru',     color: '#7209b7' },
    { name: 'Alina Vrabie',   city: 'Orhei',    sport: 'Înot',          points: 1750, rank: 'Avansat',     color: '#f72585' },
    { name: 'Sergiu Ciobanu', city: 'Chișinău', sport: 'Haltere',       points: 2200, rank: 'Campion',     color: '#06d6a0' },
    { name: 'Vasile Moraru',  city: 'Tiraspol', sport: 'Volei',         points: 1400, rank: 'Intermediar', color: '#ff9100' },
    { name: 'Elena Bălan',    city: 'Ungheni',  sport: 'Handbal',       points: 1650, rank: 'Avansat',     color: '#ff4d6d' },
    { name: 'Andrei Grama',   city: 'Chișinău', sport: 'Rugby',         points: 2800, rank: 'Maestru',     color: '#4361ee' },
    { name: 'Tudor Cojocaru', city: 'Chișinău', sport: 'Ciclism',       points: 1500, rank: 'Avansat',     color: '#f4a261' },
    { name: 'Cristina Popa',  city: 'Orhei',    sport: 'Tenis de Masă', points: 1200, rank: 'Intermediar', color: '#e63946' },
    { name: 'Radu Morari',    city: 'Ungheni',  sport: 'Lupte',         points: 980,  rank: 'Intermediar', color: '#6a0572' },
    { name: 'Mihai Botnaru',  city: 'Chișinău', sport: 'Rugby',         points: 1860, rank: 'Avansat',     color: '#2dc653' },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const getInitials = (name: string): string =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

const TABS: { id: FeedTab; label: string }[] = [
    { id: 'feed',       label: '📰 Feed' },
    { id: 'challenges', label: '🏆 Provocări' },
    { id: 'members',    label: '👥 Membri' },
];

export default function CommunityPage() {
    const navigate   = useNavigate();
    const location   = useLocation();
    const { user, isAuthenticated, logout } = useAuth();

    const [tab,        setTab]        = useState<FeedTab>('feed');
    const [filter,     setFilter]     = useState<Sport | 'all'>('all');
    const [posts,      setPosts]      = useState<Post[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
    const [postInput,  setPostInput]  = useState('');
    const [postSport,  setPostSport]  = useState<Sport>('Fotbal');
    const [toast,      setToast]      = useState<ToastState>({ icon: '', msg: '', visible: false });

    const handleLogout = (): void => { logout(); navigate(ROUTES.HOME); };

    const showToast = useCallback((icon: string, msg: string): void => {
        setToast({ icon, msg, visible: true });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    }, []);

    const handlePublish = useCallback((): void => {
        if (!isAuthenticated) { navigate(ROUTES.LOGIN, { state: { from: location } }); return; }
        if (!postInput.trim()) { showToast('⚠️', 'Scrie ceva înainte de a publica!'); return; }
        const newPost: Post = {
            id:       Date.now(),
            author:   `${user?.firstName} ${user?.lastName}`,
            color:    '#1a7fff',
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
    }, [isAuthenticated, postInput, postSport, user, navigate, location, showToast]);

    const handleLike = useCallback((id: number): void => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
            ),
        );
    }, []);

    const handleJoin = useCallback((id: number): void => {
        if (!isAuthenticated) { navigate(ROUTES.LOGIN, { state: { from: location } }); return; }
        setChallenges((prev) =>
            prev.map((c) => {
                if (c.id !== id) return c;
                const joining = !c.joined;
                showToast(joining ? '🏆' : '👋', joining ? 'Te-ai alăturat provocării!' : 'Ai ieșit din provocare.');
                return { ...c, joined: joining, participants: joining ? c.participants + 1 : c.participants - 1 };
            }),
        );
    }, [isAuthenticated, navigate, location, showToast]);

    const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.sport === filter);

    return (
        <div className="db-page">
            <div className="db-grid" aria-hidden="true" />

            {/* ── SIDEBAR ── */}
            <aside className="db-sidebar">
                <Link to={ROUTES.HOME} className="db-logo">
                    <span className="db-logo-white">FIT</span>
                    <span className="db-logo-blue">MOLDOVA</span>
                </Link>

                <nav className="db-nav">
                    <Link to={ROUTES.DASHBOARD}  className="db-nav-item"><span className="db-nav-icon">📊</span> Dashboard</Link>
                    <Link to={ROUTES.ACTIVITIES} className="db-nav-item"><span className="db-nav-icon">🏃</span> Activități</Link>
                    <Link to={ROUTES.CHALLENGES} className="db-nav-item"><span className="db-nav-icon">🏆</span> Provocări</Link>
                    <Link to={ROUTES.CLUBS}      className="db-nav-item"><span className="db-nav-icon">👥</span> Cluburi</Link>
                    <Link to={ROUTES.COMMUNITY}  className="db-nav-item db-nav-item--active"><span className="db-nav-icon">🌍</span> Comunitate</Link>
                    <Link to={ROUTES.EVENTS}     className="db-nav-item"><span className="db-nav-icon">📅</span> Evenimente</Link>
                    <Link to={ROUTES.PROFILE}    className="db-nav-item"><span className="db-nav-icon">👤</span> Profil</Link>
                </nav>

                {isAuthenticated ? (
                    <button className="db-logout-btn" onClick={handleLogout}>
                        <span>↩</span> Deconectare
                    </button>
                ) : (
                    <button
                        className="db-logout-btn"
                        style={{ color: '#1a7fff', borderColor: 'rgba(26, 127, 255, 0.3)' }}
                        onClick={() => navigate(ROUTES.LOGIN, { state: { from: location } })}
                    >
                        <span>→</span> Autentifică-te
                    </button>
                )}
            </aside>

            {/* ── MAIN ── */}
            <main className="db-main">

                {/* Topbar */}
                <div className="db-topbar">
                    <div>
                        <h1 className="db-title">🌍 Comunitate</h1>
                        <p className="db-subtitle">Feed, provocări și membri din Moldova</p>
                    </div>
                    {isAuthenticated && user ? (
                        <div className="db-user-chip">
                            <div className="db-avatar">{user.avatar}</div>
                            <div className="db-user-info">
                                <div className="db-user-name">{user.firstName} {user.lastName}</div>
                                <div className="db-user-email">{user.email}</div>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="ov-btn-join"
                            onClick={() => navigate(ROUTES.LOGIN, { state: { from: location } })}
                        >
                            → Autentifică-te
                        </button>
                    )}
                </div>

                {/* Tab bar */}
                <div className="db-section-card" style={{ padding: '0.5rem 0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {TABS.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                style={{
                                    padding: '0.6rem 1.2rem', borderRadius: 6, cursor: 'pointer',
                                    background: tab === id ? 'rgba(26, 127, 255, 0.12)' : 'transparent',
                                    border: tab === id ? '1px solid rgba(26, 127, 255, 0.3)' : '1px solid transparent',
                                    color: tab === id ? '#1a7fff' : '#7a8baa',
                                    fontSize: '0.875rem', fontWeight: 700, transition: 'all 0.15s',
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ══ FEED ══ */}
                {tab === 'feed' && (
                    <>
                        {/* Create post */}
                        <div className="db-section-card ov-section">
                            <h3 className="db-section-title">Publică ceva</h3>
                            {isAuthenticated ? (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <div className="db-avatar">{user?.avatar}</div>
                                    <div style={{ flex: 1 }}>
                                        <textarea
                                            style={{
                                                width: '100%', background: '#0a0f1e',
                                                border: '1px solid rgba(26, 127, 255, 0.15)',
                                                borderRadius: 8, padding: '12px 16px', color: '#e8f0fe',
                                                fontFamily: 'inherit', fontSize: '0.88rem',
                                                resize: 'none', minHeight: 76, outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                            placeholder="Distribuie antrenamentul tău, un sfat sau o realizare…"
                                            value={postInput}
                                            onChange={(e) => setPostInput(e.target.value)}
                                        />
                                        <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                            <select
                                                style={{
                                                    background: '#0a0f1e', border: '1px solid rgba(26, 127, 255, 0.15)',
                                                    color: '#7a8baa', borderRadius: 7, padding: '6px 10px',
                                                    fontSize: '0.78rem', outline: 'none', cursor: 'pointer',
                                                }}
                                                value={postSport}
                                                onChange={(e) => setPostSport(e.target.value as Sport)}
                                            >
                                                {SPORTS.map((s) => <option key={s}>{s}</option>)}
                                            </select>
                                            <button className="ov-btn-add" onClick={handlePublish}>Publică</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="ov-empty">
                                    <div className="ov-empty-icon">✍️</div>
                                    <p className="ov-empty-text">Autentifică-te pentru a publica postări</p>
                                    <button
                                        className="ov-btn-join"
                                        style={{ marginTop: '1rem' }}
                                        onClick={() => navigate(ROUTES.LOGIN, { state: { from: location } })}
                                    >
                                        → Autentifică-te
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sport filter */}
                        <div className="db-section-card ov-section" style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                                {SPORT_CHIPS.map((c) => (
                                    <button
                                        key={c.value}
                                        onClick={() => setFilter(c.value)}
                                        style={{
                                            padding: '5px 12px', borderRadius: 100, cursor: 'pointer',
                                            border: `1px solid ${filter === c.value ? '#1a7fff' : 'rgba(26, 127, 255, 0.15)'}`,
                                            background: filter === c.value ? '#1a7fff' : 'transparent',
                                            color: filter === c.value ? '#fff' : '#7a8baa',
                                            fontSize: '0.74rem', fontWeight: 600, whiteSpace: 'nowrap',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        {c.emoji} {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Posts */}
                        <div className="db-section-card ov-section">
                            {filteredPosts.length === 0 ? (
                                <div className="ov-empty">
                                    <div className="ov-empty-icon">📭</div>
                                    <p className="ov-empty-text">Nicio postare încă</p>
                                    <p className="ov-empty-hint">Fii primul care distribuie ceva cu comunitatea!</p>
                                </div>
                            ) : (
                                <div className="ov-list">
                                    {filteredPosts.map((p) => (
                                        <div className="ov-item" key={p.id} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                                <div className="db-avatar" style={{ background: p.color }}>{getInitials(p.author)}</div>
                                                <div style={{ flex: 1 }}>
                                                    <div className="ov-item-name">{p.author}</div>
                                                    <div style={{ fontSize: '0.72rem', color: '#7a8baa' }}>{p.time}</div>
                                                </div>
                                                <span className="ov-tag">{p.sport}</span>
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: '#c8d8f0', lineHeight: 1.65, marginBottom: 12 }}>
                                                {p.content}
                                            </div>
                                            <div style={{ display: 'flex', gap: 4, borderTop: '1px solid rgba(26, 127, 255, 0.1)', paddingTop: 10 }}>
                                                <button
                                                    onClick={() => handleLike(p.id)}
                                                    style={{ background: 'transparent', border: 'none', color: p.liked ? '#ff4d6d' : '#7a8baa', cursor: 'pointer', fontSize: '0.79rem', fontWeight: 600, padding: '4px 8px', borderRadius: 6 }}
                                                >
                                                    {p.liked ? '❤️' : '🤍'} {p.likes}
                                                </button>
                                                <button style={{ background: 'transparent', border: 'none', color: '#7a8baa', cursor: 'pointer', fontSize: '0.79rem', fontWeight: 600, padding: '4px 8px', borderRadius: 6 }}>
                                                    💬 {p.comments}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ══ PROVOCĂRI ══ */}
                {tab === 'challenges' && (
                    <div className="db-section-card ov-section">
                        <h3 className="db-section-title">Provocări Active 🔥</h3>
                        <p className="ov-section-desc">Alătură-te și câștigă puncte în clasament</p>
                        <div className="ov-list">
                            {challenges.map((c) => (
                                <div className="ov-item" key={c.id}>
                                    <div className="ov-item-icon">{c.sport}</div>
                                    <div className="ov-item-info">
                                        <div className="ov-item-name">{c.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#7a8baa', margin: '0.2rem 0 0.4rem' }}>{c.desc}</div>
                                        <div className="ov-item-meta">
                                            <span>👥 {c.participants.toLocaleString()} participanți</span>
                                            <span>⏱ {c.days} zile rămase</span>
                                        </div>
                                        <div className="ov-progress-bar">
                                            <div className="ov-progress-fill" style={{ width: `${c.progress}%` }} />
                                        </div>
                                    </div>
                                    <button
                                        className={c.joined ? 'ov-btn-leave' : 'ov-btn-join'}
                                        onClick={() => handleJoin(c.id)}
                                    >
                                        {c.joined ? 'Părăsește' : 'Alătură-te'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══ MEMBRI ══ */}
                {tab === 'members' && (
                    <div className="db-section-card ov-section">
                        <h3 className="db-section-title">Membri Comunitate 👥</h3>
                        <p className="ov-section-desc">Sportivi activi din Moldova</p>
                        <div className="ov-list">
                            {MEMBERS.map((m) => (
                                <div className="ov-item" key={m.name}>
                                    <div
                                        className="db-avatar"
                                        style={{ background: m.color, boxShadow: `0 0 12px ${m.color}55`, flexShrink: 0 }}
                                    >
                                        {getInitials(m.name)}
                                    </div>
                                    <div className="ov-item-info">
                                        <div className="ov-item-name">{m.name}</div>
                                        <div className="ov-item-meta">
                                            <span className="ov-tag">{m.rank}</span>
                                            <span>📍 {m.city}</span>
                                            <span>{m.sport}</span>
                                            <span style={{ color: '#1a7fff', fontWeight: 700 }}>{m.points.toLocaleString()} pts</span>
                                        </div>
                                    </div>
                                    <button className="ov-btn-join" onClick={() => showToast('👤', 'Profil în curând!')}>
                                        Urmărește
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back */}
                <div className="ov-back-wrap">
                    {isAuthenticated ? (
                        <Link to={ROUTES.DASHBOARD} className="ov-btn-back">← Înapoi la Dashboard</Link>
                    ) : (
                        <Link to={ROUTES.HOME} className="ov-btn-back">← Înapoi Acasă</Link>
                    )}
                </div>

            </main>

            {/* Toast */}
            <div style={{
                position: 'fixed', bottom: 28, right: 28, zIndex: 300,
                background: '#0d1526', border: '1px solid rgba(26, 127, 255, 0.3)',
                borderRadius: 12, padding: '13px 18px',
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)', fontSize: '0.86rem',
                transform: toast.visible ? 'translateY(0)' : 'translateY(80px)',
                opacity: toast.visible ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                pointerEvents: 'none',
            }}>
                <span style={{ fontSize: '1.2rem' }}>{toast.icon}</span>
                <span style={{ color: '#e8f0fe' }}>{toast.msg}</span>
            </div>

        </div>
    );
}
