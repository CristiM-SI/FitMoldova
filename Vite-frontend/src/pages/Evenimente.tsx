import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/paths';
import { MOCK_EVENIMENTE } from '../services/mock/evenimente';
import type { Eveniment } from '../services/mock/evenimente';
import './Dashboard.css';
import './DashboardOverlays.css';
import './Evenimente.css';

type ViewType = 'all' | 'mine';
const CATEGORIES = ['Toate', 'Maraton', 'Ciclism', 'Yoga', 'Fitness', 'Trail', 'Înot', 'Social'] as const;

const MONTHS_RO = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie',
];

const WEEKDAYS_RO = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];

const parseDate = (iso: string) => {
    const d = new Date(iso);
    return {
        day: d.getDate(),
        month: MONTHS_RO[d.getMonth()],
        monthShort: MONTHS_RO[d.getMonth()].substring(0, 3).toUpperCase(),
        weekday: WEEKDAYS_RO[d.getDay()],
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
    };
};

const capacityPct = (cur: number, max: number) => Math.round((cur / max) * 100);
const capacityClass = (pct: number) => {
    if (pct < 50) return 'ev-capacity-fill--low';
    if (pct < 80) return 'ev-capacity-fill--mid';
    return 'ev-capacity-fill--high';
};

const EvenimenteDashboard: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [inscrise, setInscrise] = useState<Eveniment[]>([]);
    const [disponibile, setDisponibile] = useState<Eveniment[]>(MOCK_EVENIMENTE);
    const [view, setView] = useState<ViewType>('all');
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState<string>('Toate');
    const [detail, setDetail] = useState<Eveniment | null>(null);

    const handleLogout = (): void => {
        logout();
        navigate(ROUTES.HOME);
    };

    const register = (ev: Eveniment) => {
        if (!isAuthenticated) { navigate(ROUTES.LOGIN, { state: { from: location } }); return; }
        setInscrise((prev) => [...prev, ev]);
        setDisponibile((prev) => prev.filter((e) => e.id !== ev.id));
        setDetail(null);
    };

    const cancel = (id: number) => {
        const ev = inscrise.find((e) => e.id === id);
        setInscrise((prev) => prev.filter((e) => e.id !== id));
        if (ev) {
            const orig = MOCK_EVENIMENTE.find((e) => e.name === ev.name);
            if (orig) setDisponibile((prev) => [...prev, orig]);
        }
        setDetail(null);
    };

    const isRegistered = (id: number) => inscrise.some((e) => e.id === id);

    const list = view === 'mine' ? inscrise : disponibile;

    const filtered = useMemo(() => {
        return list
            .filter((e) => {
                const matchSearch =
                    e.name.toLowerCase().includes(search.toLowerCase()) ||
                    e.city.toLowerCase().includes(search.toLowerCase()) ||
                    e.organizer.toLowerCase().includes(search.toLowerCase());
                const matchCat = filterCat === 'Toate' || e.category === filterCat;
                return matchSearch && matchCat;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [list, search, filterCat]);

    // Group by month for timeline
    const grouped = useMemo(() => {
        const map = new Map<string, Eveniment[]>();
        filtered.forEach((ev) => {
            const d = parseDate(ev.date);
            const key = `${d.year}-${d.monthIndex}`;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(ev);
        });
        return map;
    }, [filtered]);

    const totalParticipants = [...inscrise, ...disponibile].reduce((s, e) => s + e.participants, 0);

    return (
        <div className="db-page">
            <div className="db-grid" aria-hidden="true" />

            {/* Sidebar */}
            <aside className="db-sidebar">
                <Link to={ROUTES.HOME} className="db-logo">
                    <span className="db-logo-white">FIT</span>
                    <span className="db-logo-blue">MOLDOVA</span>
                </Link>
                <nav className="db-nav">
                    <Link to={ROUTES.DASHBOARD} className="db-nav-item">
                        <span className="db-nav-icon">📊</span> Dashboard
                    </Link>
                    <Link to={ROUTES.ACTIVITIES} className="db-nav-item">
                        <span className="db-nav-icon">🏃</span> Activități
                    </Link>
                    <Link to={ROUTES.CHALLENGES} className="db-nav-item">
                        <span className="db-nav-icon">🏆</span> Provocări
                    </Link>
                    <Link to={ROUTES.CLUBS} className="db-nav-item">
                        <span className="db-nav-icon">👥</span> Cluburi
                    </Link>
                    <Link to={ROUTES.COMMUNITY} className="db-nav-item">
                        <span className="db-nav-icon">🌍</span> Comunitate
                    </Link>
                    <Link to={ROUTES.EVENTS} className="db-nav-item db-nav-item--active">
                        <span className="db-nav-icon">📅</span> Evenimente
                    </Link>
                    <Link to={ROUTES.PROFILE} className="db-nav-item">
                        <span className="db-nav-icon">👤</span> Profil
                    </Link>
                </nav>
                {isAuthenticated ? (
                    <button className="db-logout-btn" onClick={handleLogout}>
                        <span>↩</span> Deconectare
                    </button>
                ) : (
                    <button className="db-logout-btn" onClick={() => navigate(ROUTES.LOGIN)}>
                        <span>→</span> Autentifică-te
                    </button>
                )}
            </aside>

            {/* Main */}
            <main className="db-main">
                <div className="db-topbar">
                    <div>
                        <h1 className="db-title">📅 Evenimente</h1>
                        <p className="db-subtitle">
                            Descoperă și participă la evenimente sportive din Moldova
                        </p>
                    </div>
                    {isAuthenticated && user && (
                        <div className="db-user-chip">
                            <div className="db-avatar">{user.avatar}</div>
                            <div className="db-user-info">
                                <div className="db-user-name">{user.firstName} {user.lastName}</div>
                                <div className="db-user-email">{user.email}</div>
                            </div>
                        </div>
                    )}
                    {!isAuthenticated && (
                        <button className="db-logout-btn" onClick={() => navigate(ROUTES.LOGIN)}>
                            <span>→</span> Autentifică-te
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div className="db-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    <div className="db-stat-card">
                        <div className="db-stat-label">Înscris la</div>
                        <div className="db-stat-value">{inscrise.length}</div>
                        <div className="db-stat-hint">evenimente viitoare</div>
                    </div>
                    <div className="db-stat-card">
                        <div className="db-stat-label">Disponibile</div>
                        <div className="db-stat-value">{disponibile.length}</div>
                        <div className="db-stat-hint">evenimente de explorat</div>
                    </div>
                    <div className="db-stat-card">
                        <div className="db-stat-label">Comunitate</div>
                        <div className="db-stat-value">{totalParticipants.toLocaleString()}</div>
                        <div className="db-stat-hint">participanți înscriși</div>
                    </div>
                </div>

                {/* View bar */}
                <div className="ev-view-bar">
                    <div className="ev-view-toggle">
                        <button
                            className={`ev-view-btn ${view === 'all' ? 'ev-view-btn--active' : ''}`}
                            onClick={() => setView('all')}
                        >
                            📋 Toate ({disponibile.length})
                        </button>
                        <button
                            className={`ev-view-btn ${view === 'mine' ? 'ev-view-btn--active' : ''}`}
                            onClick={() => setView('mine')}
                        >
                            ⭐ Înscrise ({inscrise.length})
                        </button>
                    </div>
                    <div className="ev-search-wrap">
                        <span className="ev-search-icon">🔍</span>
                        <input
                            className="ev-search"
                            type="text"
                            placeholder="Caută evenimente..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category filters */}
                <div className="ev-filters">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`ev-filter ${filterCat === cat ? 'ev-filter--active' : ''}`}
                            onClick={() => setFilterCat(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Timeline or empty */}
                {filtered.length === 0 ? (
                    <div className="ev-empty">
                        <div className="ev-empty-icon">{view === 'mine' ? '⭐' : '🔍'}</div>
                        <h3 className="ev-empty-title">
                            {view === 'mine' ? 'Nu ești înscris la niciun eveniment' : 'Niciun eveniment găsit'}
                        </h3>
                        <p className="ev-empty-text">
                            {view === 'mine'
                                ? 'Explorează evenimentele disponibile și înscrie-te!'
                                : 'Încearcă să schimbi filtrul sau termenul de căutare.'}
                        </p>
                    </div>
                ) : (
                    <div className="ev-timeline">
                        {Array.from(grouped.entries()).map(([key, events]) => {
                            const d = parseDate(events[0].date);
                            return (
                                <div key={key}>
                                    <div className="ev-month-label">
                                        <span>{d.monthShort}</span>
                                        <h3>{d.month} {d.year}</h3>
                                    </div>

                                    {events.map((ev) => {
                                        const pd = parseDate(ev.date);
                                        const pct = capacityPct(ev.participants, ev.maxParticipants);
                                        const joined = isRegistered(ev.id);

                                        return (
                                            <div
                                                key={ev.id}
                                                className={`ev-card ev-cat--${ev.category} ${joined ? 'ev-card--joined' : ''}`}
                                                onClick={() => setDetail(ev)}
                                            >
                                                {/* Date badge */}
                                                <div className="ev-date-badge">
                                                    <div className="ev-date-day">{pd.day}</div>
                                                    <div className="ev-date-month">{pd.monthShort}</div>
                                                    <div className="ev-date-weekday">{pd.weekday}</div>
                                                </div>

                                                {/* Body */}
                                                <div className="ev-card-body">
                                                    <div className="ev-card-top">
                                                        <h3 className="ev-card-name">
                                                            {ev.icon} {ev.name}
                                                        </h3>
                                                        <span className={`ev-card-price ${ev.price === 'Gratuit' ? 'ev-card-price--free' : 'ev-card-price--paid'}`}>
                              {ev.price}
                            </span>
                                                    </div>

                                                    <div className="ev-card-info">
                                                        <span>🕐 {ev.time}</span>
                                                        <span>📍 {ev.location}, {ev.city}</span>
                                                        <span>🏷 {ev.category}</span>
                                                    </div>

                                                    <div className="ev-capacity">
                                                        <div className="ev-capacity-bar">
                                                            <div
                                                                className={`ev-capacity-fill ${capacityClass(pct)}`}
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="ev-capacity-text">
                              {ev.participants}/{ev.maxParticipants} locuri ocupate ({pct}%)
                            </span>
                                                    </div>

                                                    <div className="ev-tags">
                                                        {ev.tags.map((tag) => (
                                                            <span key={tag} className="ev-tag">{tag}</span>
                                                        ))}
                                                    </div>

                                                    <div className="ev-card-footer">
                                                        <span className="ev-organizer">Organizat de {ev.organizer}</span>
                                                        {joined ? (
                                                            <button
                                                                className="ev-btn-cancel"
                                                                onClick={(e) => { e.stopPropagation(); cancel(ev.id); }}
                                                            >
                                                                Anulează
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="ev-btn-register"
                                                                onClick={(e) => { e.stopPropagation(); register(ev); }}
                                                            >
                                                                Înscrie-te
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Detail overlay */}
                {detail && (() => {
                    const pd = parseDate(detail.date);
                    const pct = capacityPct(detail.participants, detail.maxParticipants);
                    const joined = isRegistered(detail.id);

                    return (
                        <div className="ev-detail-overlay" onClick={() => setDetail(null)}>
                            <div className="ev-detail-panel" onClick={(e) => e.stopPropagation()}>
                                <div className="ev-detail-header">
                                    <button className="ev-detail-close" onClick={() => setDetail(null)}>✕</button>
                                    <div className="ev-detail-date-row">
                                        <div className="ev-detail-date-box">
                                            <div className="ev-date-day">{pd.day}</div>
                                            <div className="ev-date-month">{pd.monthShort}</div>
                                        </div>
                                        <div>
                                            <h2 className="ev-detail-name">{detail.icon} {detail.name}</h2>
                                            <div style={{ color: '#7a8baa', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                                                {pd.weekday}, {pd.day} {pd.month} {pd.year} la {detail.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="ev-detail-body">
                                    <p className="ev-detail-desc">{detail.description}</p>

                                    <div className="ev-detail-grid">
                                        <div className="ev-detail-stat">
                                            <div className="ev-detail-stat-label">Locație</div>
                                            <div className="ev-detail-stat-value">📍 {detail.location}, {detail.city}</div>
                                        </div>
                                        <div className="ev-detail-stat">
                                            <div className="ev-detail-stat-label">Categorie</div>
                                            <div className="ev-detail-stat-value">{detail.category}</div>
                                        </div>
                                        <div className="ev-detail-stat">
                                            <div className="ev-detail-stat-label">Dificultate</div>
                                            <div className="ev-detail-stat-value">{detail.difficulty}</div>
                                        </div>
                                        <div className="ev-detail-stat">
                                            <div className="ev-detail-stat-label">Preț</div>
                                            <div className="ev-detail-stat-value">{detail.price}</div>
                                        </div>
                                        <div className="ev-detail-stat">
                                            <div className="ev-detail-stat-label">Organizator</div>
                                            <div className="ev-detail-stat-value">{detail.organizer}</div>
                                        </div>
                                        <div className="ev-detail-stat">
                                            <div className="ev-detail-stat-label">Capacitate</div>
                                            <div className="ev-detail-stat-value">{detail.participants}/{detail.maxParticipants} ({pct}%)</div>
                                        </div>
                                    </div>

                                    <div className="ev-detail-tags">
                                        {detail.tags.map((tag) => (
                                            <span key={tag} className="ev-tag">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="ev-detail-actions">
                                        {joined ? (
                                            <button className="ev-btn-cancel" onClick={() => cancel(detail.id)}>
                                                Anulează Înscrierea
                                            </button>
                                        ) : (
                                            <button className="ev-btn-register" onClick={() => register(detail)}>
                                                Înscrie-te la Eveniment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* Back */}
                <div className="ov-back-wrap">
                    <Link to={ROUTES.DASHBOARD} className="ov-btn-back">
                        ← Înapoi la Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default EvenimenteDashboard;
