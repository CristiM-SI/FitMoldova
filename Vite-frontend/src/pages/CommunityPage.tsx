import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useDashboardData } from '../context/useDashboardData';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import {
    SPORTS, SPORT_CHIPS, INITIAL_CHALLENGES, MEMBERS, MEMBER_POSTS,
} from '../services/mock/community';
import type {
    Sport, FeedTab, Post, Challenge, ToastState, Member,
} from '../services/mock/community';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const getInitials = (name: string): string =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

const CSS = `
.fm { min-height: 100vh; background: #060d1a; color: #e8f0fe; padding-top: 70px; }
.fm-body { display: flex; gap: 1.5rem; max-width: 1200px; margin: 0 auto; padding: 2rem 1.25rem; align-items: flex-start; }
.fm-leftnav { width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 4px; position: sticky; top: 90px; }
.fm-center { flex: 1; display: flex; flex-direction: column; gap: 1rem; min-width: 0; }
.profile-chip { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; background: rgba(26,127,255,0.08); border: 1px solid rgba(26,127,255,0.15); cursor: pointer; margin-bottom: 8px; transition: background 0.2s; }
.profile-chip:hover { background: rgba(26,127,255,0.14); }
.profile-chip-ava { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#1a7fff,#00c8a0); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.9rem; color: #fff; flex-shrink: 0; }
.profile-chip-name { font-size: 0.82rem; font-weight: 700; color: #e8f0fe; }
.profile-chip-tag { font-size: 0.72rem; color: #7a8baa; }
.leftnav-section-title { font-size: 0.7rem; font-weight: 700; color: #7a8baa; text-transform: uppercase; letter-spacing: 0.08em; padding: 8px 12px 4px; }
.nav-divider { height: 1px; background: rgba(26,127,255,0.1); margin: 6px 0; }
.nav-item { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 12px; border: none; background: transparent; color: #7a8baa; font-size: 0.84rem; font-weight: 600; border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.15s; }
.nav-item:hover { background: rgba(26,127,255,0.08); color: #c8d8f0; }
.nav-item--active { background: rgba(26,127,255,0.15); color: #1a7fff; }
.nav-item__icon { font-size: 1rem; width: 20px; text-align: center; }
.nav-item__badge { margin-left: auto; font-size: 0.65rem; font-weight: 700; padding: 2px 7px; border-radius: 20px; }
.nav-item__badge--new { background: #1a7fff; color: #fff; }
.nav-item__badge--hot { background: #ff4d6d; color: #fff; }
.card { background: #0d1526; border: 1px solid rgba(26,127,255,0.15); border-radius: 10px; padding: 1.25rem; }
.create-row { display: flex; gap: 12px; align-items: flex-start; }
.user-ava { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg,#1a7fff,#00c8a0); display: flex; align-items: center; justify-content: center; font-weight: 900; color: #fff; font-size: 0.95rem; flex-shrink: 0; }
.create-body { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.create-textarea { width: 100%; min-height: 80px; background: rgba(26,127,255,0.06); border: 1px solid rgba(26,127,255,0.18); border-radius: 8px; color: #e8f0fe; font-size: 0.875rem; padding: 10px 12px; resize: vertical; font-family: inherit; outline: none; }
.create-textarea:focus { border-color: rgba(26,127,255,0.45); }
.create-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.select-sport { background: rgba(26,127,255,0.08); border: 1px solid rgba(26,127,255,0.2); color: #c8d8f0; font-size: 0.78rem; padding: 5px 10px; border-radius: 7px; cursor: pointer; outline: none; }
.media-btn { background: rgba(26,127,255,0.08); border: 1px solid rgba(26,127,255,0.18); color: #7a8baa; font-size: 0.78rem; font-weight: 600; padding: 5px 11px; border-radius: 7px; cursor: pointer; transition: all 0.15s; }
.media-btn:hover { background: rgba(26,127,255,0.15); color: #c8d8f0; }
.btn-solid { background: #1a7fff; color: #fff; border: none; border-radius: 7px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.btn-solid:hover { background: #1260cc; }
.db-section-card { background: #0d1526; border: 1px solid rgba(26,127,255,0.15); border-radius: 10px; padding: 1.75rem; }
.db-section-title { font-size: 1rem; font-weight: 800; color: #fff; margin: 0 0 1.25rem; }
.db-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1rem; color: #fff; flex-shrink: 0; }
.ov-section { }
.ov-section-desc { font-size: 0.82rem; color: #7a8baa; margin: -0.75rem 0 1rem; }
.ov-list { display: flex; flex-direction: column; gap: 12px; }
.ov-item { display: flex; align-items: center; gap: 14px; padding: 14px; background: rgba(26,127,255,0.04); border: 1px solid rgba(26,127,255,0.1); border-radius: 10px; transition: border-color 0.2s; }
.ov-item:hover { border-color: rgba(26,127,255,0.25); }
.ov-item-icon { font-size: 1.8rem; flex-shrink: 0; }
.ov-item-info { flex: 1; min-width: 0; }
.ov-item-name { font-size: 0.9rem; font-weight: 700; color: #e8f0fe; }
.ov-item-meta { display: flex; gap: 10px; font-size: 0.75rem; color: #7a8baa; margin-top: 4px; flex-wrap: wrap; }
.ov-tag { background: rgba(26,127,255,0.15); color: #1a7fff; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
.ov-progress-bar { height: 5px; background: rgba(26,127,255,0.12); border-radius: 99px; margin-top: 8px; overflow: hidden; }
.ov-progress-fill { height: 100%; background: linear-gradient(90deg,#1a7fff,#00c8a0); border-radius: 99px; transition: width 0.4s; }
.ov-empty { display: flex; flex-direction: column; align-items: center; padding: 2.5rem 1rem; gap: 8px; }
.ov-empty-icon { font-size: 2.5rem; }
.ov-empty-text { font-size: 0.95rem; font-weight: 700; color: #c8d8f0; margin: 0; }
.ov-empty-hint { font-size: 0.82rem; color: #7a8baa; margin: 0; text-align: center; }
.ov-btn-join { background: rgba(26,127,255,0.15); color: #1a7fff; border: 1px solid rgba(26,127,255,0.3); font-size: 0.8rem; font-weight: 700; padding: 7px 14px; border-radius: 7px; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.15s; }
.ov-btn-join:hover { background: rgba(26,127,255,0.25); }
.ov-btn-leave { background: rgba(255,77,109,0.1); color: #ff4d6d; border: 1px solid rgba(255,77,109,0.25); font-size: 0.8rem; font-weight: 700; padding: 7px 14px; border-radius: 7px; cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.15s; }
.ov-btn-leave:hover { background: rgba(255,77,109,0.18); }
.ov-back-wrap { display: flex; justify-content: flex-start; padding: 0.5rem 0 1rem; }
.ov-btn-back { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: #7a8baa; text-decoration: none; padding: 8px 14px; border-radius: 8px; background: rgba(26,127,255,0.06); border: 1px solid rgba(26,127,255,0.12); transition: all 0.15s; }
.ov-btn-back:hover { color: #1a7fff; border-color: rgba(26,127,255,0.3); }
.mp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(4px); }
.mp-panel { position: relative; background: #0d1526; border: 1px solid rgba(26,127,255,0.25); border-radius: 16px; padding: 2rem; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.6); }
.mp-close { position: absolute; top: 14px; right: 14px; background: rgba(26,127,255,0.1); border: 1px solid rgba(26,127,255,0.2); color: #7a8baa; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.mp-close:hover { background: rgba(255,77,109,0.15); color: #ff4d6d; border-color: rgba(255,77,109,0.3); }
.mp-header { display: flex; align-items: center; gap: 16px; margin-bottom: 1.25rem; }
.mp-avatar { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; color: #fff; flex-shrink: 0; }
.mp-header-info { flex: 1; }
.mp-name { font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 6px; }
.mp-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; font-size: 0.78rem; color: #7a8baa; margin-bottom: 6px; }
.mp-points { font-size: 1rem; font-weight: 700; color: #1a7fff; }
.mp-bio { font-size: 0.84rem; color: #a0b4cc; line-height: 1.65; margin: 0 0 1.5rem; padding: 0.9rem 1rem; background: rgba(26,127,255,0.05); border-radius: 8px; border-left: 3px solid rgba(26,127,255,0.3); }
.mp-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 1.5rem; }
.mp-stat { background: rgba(26,127,255,0.07); border: 1px solid rgba(26,127,255,0.12); border-radius: 10px; padding: 12px 8px; text-align: center; }
.mp-stat-val { font-size: 1.3rem; font-weight: 800; color: #e8f0fe; }
.mp-stat-lbl { font-size: 0.68rem; color: #7a8baa; margin-top: 3px; font-weight: 600; }
.mp-section-title { font-size: 0.82rem; font-weight: 700; color: #7a8baa; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px; }
.mp-achievements { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.5rem; }
.mp-achievement { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: rgba(26,127,255,0.05); border: 1px solid rgba(26,127,255,0.1); border-radius: 8px; }
.mp-achievement-icon { font-size: 1.4rem; flex-shrink: 0; }
.mp-achievement-info { flex: 1; }
.mp-achievement-title { font-size: 0.84rem; font-weight: 700; color: #e8f0fe; }
.mp-achievement-date { font-size: 0.72rem; color: #7a8baa; margin-top: 2px; }
.mp-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid rgba(26,127,255,0.1); }
.mp-joined { font-size: 0.78rem; color: #7a8baa; }
`;

export default function CommunityPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const userName = user ? `${user.firstName} ${user.lastName}` : 'Oaspete';
    const userAvatar = user?.avatar ?? '?';
    const userTag = user ? `@${user.email.split('@')[0]}` : '';

    const [tab, setTab]               = useState<FeedTab>('feed');
    const [filter, setFilter]         = useState<Sport | 'all'>('all');
    const [posts, setPosts]           = useState<Post[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
    const [postInput, setPostInput]   = useState<string>('');
    const [postSport, setPostSport]   = useState<Sport>('Fotbal');
    const [toast, setToast]           = useState<ToastState>({ icon: '', msg: '', visible: false });
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [following, setFollowing]           = useState<Set<string>>(new Set());

    // Dashboard sync
    const { addProvocare, removeProvocare } = useDashboardData();
    const { completeChallenge } = useProgress();

    const showToast = useCallback((icon: string, msg: string): void => {
        setToast({ icon, msg, visible: true });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    }, []);

    const NAV_ITEMS = [
        { id: 'feed'       as FeedTab, icon: '📰', label: 'Feed',      action: () => setTab('feed') },
        { id: 'challenges' as FeedTab, icon: '🏆', label: 'Provocări', action: () => setTab('challenges'), badge: { type: 'hot', text: 'Live' } },
        { id: 'members'    as FeedTab, icon: '👥', label: 'Membri',    action: () => setTab('members') },
        { divider: true } as const,
        { id: 'forum'  as FeedTab, icon: '💬', label: 'Forum',   action: () => navigate(ROUTES.FORUM) },
        { id: 'clubs'  as FeedTab, icon: '🏟️', label: 'Cluburi', action: () => navigate(ROUTES.CLUBS) },
    ];

    const isNavActive = (item: { id: FeedTab }) => tab === item.id;

    const handlePublish = useCallback((): void => {
        if (!isAuthenticated) { navigate(ROUTES.LOGIN, { state: { from: { pathname: ROUTES.COMMUNITY } } }); return; }
        if (!postInput.trim()) { showToast('⚠️', 'Scrie ceva înainte de a publica!'); return; }
        const newPost: Post = {
            id:       Date.now(),
            author:   userName,
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
    }, [postInput, postSport, showToast, userName, isAuthenticated, navigate]);

    const handleLike = useCallback((id: number): void => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
            ),
        );
    }, []);

    const handleJoin = useCallback((id: number): void => {
        if (!isAuthenticated) { navigate(ROUTES.LOGIN, { state: { from: { pathname: ROUTES.COMMUNITY } } }); return; }
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
    }, [showToast, isAuthenticated, navigate, addProvocare, removeProvocare, completeChallenge]);

    const handleFollow = useCallback((member: Member): void => {
        const isFollowing = following.has(member.name);
        setFollowing((prev) => {
            const next = new Set(prev);
            if (isFollowing) next.delete(member.name);
            else next.add(member.name);
            return next;
        });
        if (isFollowing) {
            setPosts((prev) => prev.filter((p) => p.author !== member.name));
            showToast('👋', `Ai încetat să urmărești pe ${member.name}`);
        } else {
            const newPosts = MEMBER_POSTS.filter((p) => p.author === member.name);
            setPosts((prev) => [...prev, ...newPosts]);
            showToast('👤', `Urmărești acum pe ${member.name}!`);
        }
    }, [following, showToast]);

    const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.sport === filter);

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
                            <div className="profile-chip-ava">{userAvatar}</div>
                            <div>
                                <div className="profile-chip-name">{userName}</div>
                                <div className="profile-chip-tag">{userTag}</div>
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
                                {isAuthenticated ? (
                                    <div className="card">
                                        <div className="create-row">
                                            <div className="user-ava">{userAvatar}</div>
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
                                ) : (
                                    <div className="ov-empty">
                                        <div className="ov-empty-icon">✍️</div>
                                        <p className="ov-empty-text">Autentifică-te pentru a publica postări</p>
                                        <button
                                            className="ov-btn-join"
                                            style={{ marginTop: '1rem' }}
                                            onClick={() => navigate(ROUTES.LOGIN, { state: { from: { pathname: ROUTES.COMMUNITY } } })}
                                        >
                                            → Autentifică-te
                                        </button>
                                    </div>
                                )}

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
                                                style={{ background: m.color, boxShadow: `0 0 12px ${m.color}55`, flexShrink: 0, cursor: 'pointer' }}
                                                onClick={() => setSelectedMember(m)}
                                            >
                                                {getInitials(m.name)}
                                            </div>
                                            <div className="ov-item-info" style={{ cursor: 'pointer' }} onClick={() => setSelectedMember(m)}>
                                                <div className="ov-item-name">{m.name}</div>
                                                <div className="ov-item-meta">
                                                    <span className="ov-tag">{m.rank}</span>
                                                    <span>📍 {m.city}</span>
                                                    <span>{m.sport}</span>
                                                    <span style={{ color: '#1a7fff', fontWeight: 700 }}>{m.points.toLocaleString()} pts</span>
                                                </div>
                                            </div>
                                            <button
                                                className={following.has(m.name) ? 'ov-btn-leave' : 'ov-btn-join'}
                                                onClick={() => handleFollow(m)}
                                            >
                                                {following.has(m.name) ? 'Urmărești ✓' : 'Urmărește'}
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

                    </div>
                </div>
            </div>

            {/* Member profile overlay */}
            {selectedMember && (
                <div className="mp-overlay" onClick={() => setSelectedMember(null)}>
                    <div className="mp-panel" onClick={(e) => e.stopPropagation()}>
                        <button className="mp-close" onClick={() => setSelectedMember(null)}>✕</button>

                        {/* Header */}
                        <div className="mp-header">
                            <div className="mp-avatar" style={{ background: selectedMember.color, boxShadow: `0 0 24px ${selectedMember.color}66` }}>
                                {getInitials(selectedMember.name)}
                            </div>
                            <div className="mp-header-info">
                                <div className="mp-name">{selectedMember.name}</div>
                                <div className="mp-meta">
                                    <span className="ov-tag">{selectedMember.rank}</span>
                                    <span>📍 {selectedMember.city}</span>
                                    <span>{selectedMember.sport}</span>
                                </div>
                                <div className="mp-points">{selectedMember.points.toLocaleString()} pts</div>
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="mp-bio">{selectedMember.bio}</p>

                        {/* Stats */}
                        <div className="mp-stats">
                            <div className="mp-stat">
                                <div className="mp-stat-val">{selectedMember.activities}</div>
                                <div className="mp-stat-lbl">Activități</div>
                            </div>
                            <div className="mp-stat">
                                <div className="mp-stat-val">{selectedMember.daysActive}</div>
                                <div className="mp-stat-lbl">Zile Active</div>
                            </div>
                            <div className="mp-stat">
                                <div className="mp-stat-val">{selectedMember.challenges}</div>
                                <div className="mp-stat-lbl">Provocări</div>
                            </div>
                            <div className="mp-stat">
                                <div className="mp-stat-val">{selectedMember.achievements.length}</div>
                                <div className="mp-stat-lbl">Realizări</div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="mp-section-title">🏅 Realizări</div>
                        <div className="mp-achievements">
                            {selectedMember.achievements.map((a, i) => (
                                <div className="mp-achievement" key={i}>
                                    <span className="mp-achievement-icon">{a.icon}</span>
                                    <div className="mp-achievement-info">
                                        <div className="mp-achievement-title">{a.title}</div>
                                        <div className="mp-achievement-date">{a.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Member since + follow */}
                        <div className="mp-footer">
                            <span className="mp-joined">Membru din {selectedMember.joinedDate}</span>
                            <button
                                className={following.has(selectedMember.name) ? 'ov-btn-leave' : 'ov-btn-join'}
                                onClick={() => handleFollow(selectedMember)}
                            >
                                {following.has(selectedMember.name) ? 'Urmărești ✓' : 'Urmărește'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

        </>
    );
}
