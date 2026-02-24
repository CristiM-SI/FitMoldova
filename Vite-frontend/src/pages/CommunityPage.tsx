import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const TABS: { id: FeedTab; label: string }[] = [
    { id: 'feed',       label: '📰 Feed' },
    { id: 'challenges', label: '🏆 Provocări' },
    { id: 'members',    label: '👥 Membri' },
];

export default function CommunityPage() {
    const navigate = useNavigate();
    const location = useLocation();
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
    const [clubSearch, setClubSearch]         = useState('');
    const [clubCat, setClubCat]               = useState('Toate');

    // Dashboard sync
    const { addProvocare, removeProvocare, cluburiJoined, cluburiDisponibile, addClub, removeClub } = useDashboardData();
    const { completeChallenge, completeJoinClub } = useProgress();

    const showToast = useCallback((icon: string, msg: string): void => {
        setToast({ icon, msg, visible: true });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    }, []);

    const handlePublish = useCallback((): void => {
        if (!isAuthenticated) { navigate(ROUTES.LOGIN, { state: { from: location } }); return; }
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
    }, [postInput, postSport, showToast, userName]);

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

    const handleJoinClub = useCallback((club: Parameters<typeof addClub>[0]): void => {
        addClub(club);
        completeJoinClub();
        showToast('🏟️', `Te-ai alăturat clubului ${club.name}!`);
    }, [addClub, completeJoinClub, showToast]);

    const handleLeaveClub = useCallback((id: number): void => {
        removeClub(id);
        showToast('👋', 'Ai ieșit din club.');
    }, [removeClub, showToast]);

    const filteredClubs = useMemo(() => {
        const q = clubSearch.toLowerCase();
        return cluburiDisponibile.filter((c) => {
            const matchSearch = c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
            const matchCat = clubCat === 'Toate' || c.category === clubCat;
            return matchSearch && matchCat;
        });
    }, [cluburiDisponibile, clubSearch, clubCat]);

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
                                        onClick={() => navigate(ROUTES.LOGIN, { state: { from: location } })}
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

                    </div>
                </div>
            </div>

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
