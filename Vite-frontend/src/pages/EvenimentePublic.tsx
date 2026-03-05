import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EventMap from '../components/EventMap';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../context/useDashboardData';
import { MOCK_EVENIMENTE } from '../services/mock/evenimente';
import type { Eveniment } from '../services/mock/evenimente';
import { ROUTES } from '../routes/paths';
import '../styles/EvenimentePublic.css';

const CATEGORIES = ['Toate', 'Maraton', 'Ciclism', 'Yoga', 'Fitness', 'Trail', 'Înot', 'Social'] as const;
const DIFFICULTIES = ['Toate', 'Ușor', 'Mediu', 'Avansat'] as const;
const PRICES = ['Toate', 'Gratuit', 'Cu taxă'] as const;

const CATEGORY_ICONS: Record<string, string> = {
    Toate: '📅', Maraton: '🏅', Ciclism: '🚴', Yoga: '🧘',
    Fitness: '💪', Trail: '🌲', Înot: '🏊', Social: '🤝',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
    Maraton: 'linear-gradient(135deg, #1a7fff 0%, #7c3aed 100%)',
    Ciclism: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    Yoga: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    Fitness: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    Trail: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
    Înot: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
    Social: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    default: 'linear-gradient(135deg, #1a7fff 0%, #7c3aed 100%)',
};

const CATEGORY_IMAGES: Record<string, string> = {
    Maraton: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&q=80',
    Ciclism: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80',
    Yoga: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80',
    Fitness: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&q=80',
    Trail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
    Înot: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80',
    Social: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80',
    default: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80',
};

const MONTHS_RO = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie',
];
const WEEKDAYS_RO = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];

const formatDateFull = (iso: string) => {
    const d = new Date(iso);
    return `${WEEKDAYS_RO[d.getDay()]}, ${d.getDate()} ${MONTHS_RO[d.getMonth()]} ${d.getFullYear()}`;
};

const formatDateShort = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()} ${MONTHS_RO[d.getMonth()]} ${d.getFullYear()}`;
};

const capacityPct = (cur: number, max: number) => Math.round((cur / max) * 100);

const getGradient = (category: string) =>
    CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS['default'];

const EvenimentePublic: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { evenimenteInscrise: inscrise, addEveniment, removeEveniment } = useDashboardData();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState<string>('Toate');
    const [diffFilter, setDiffFilter] = useState<string>('Toate');
    const [priceFilter, setPriceFilter] = useState<string>('Toate');
    const [detail, setDetail] = useState<Eveniment | null>(null);
    const [showMap, setShowMap] = useState(false);

    const openDetail = (ev: Eveniment) => {
        setDetail(ev);
        setShowMap(false);
    };

    const closeDetail = () => {
        setDetail(null);
        setShowMap(false);
    };

    const isJoined = (id: number) => inscrise.some((e) => e.id === id);

    const handleJoin = (ev: Eveniment, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
            return;
        }
        if (isJoined(ev.id)) {
            removeEveniment(ev.id);
        } else {
            addEveniment(ev);
        }
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return MOCK_EVENIMENTE.filter((ev) => {
            const matchSearch =
                ev.name.toLowerCase().includes(q) ||
                ev.city.toLowerCase().includes(q) ||
                ev.organizer.toLowerCase().includes(q) ||
                ev.description.toLowerCase().includes(q);
            const matchCat = catFilter === 'Toate' || ev.category === catFilter;
            const matchDiff = diffFilter === 'Toate' || ev.difficulty === diffFilter;
            const matchPrice =
                priceFilter === 'Toate' ||
                (priceFilter === 'Gratuit' ? ev.price === 'Gratuit' : ev.price !== 'Gratuit');
            return matchSearch && matchCat && matchDiff && matchPrice;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [search, catFilter, diffFilter, priceFilter]);

    const hasActiveFilters = catFilter !== 'Toate' || diffFilter !== 'Toate' || priceFilter !== 'Toate' || search;

    const clearFilters = () => {
        setCatFilter('Toate');
        setDiffFilter('Toate');
        setPriceFilter('Toate');
        setSearch('');
    };

    const selectedPct = detail ? capacityPct(detail.participants, detail.maxParticipants) : 0;
    const selectedJoined = detail ? isJoined(detail.id) : false;

    return (
        <div className="ep-page">
            <div className="ep-noise" aria-hidden />
            <div className="ep-orb ep-orb-1" aria-hidden />
            <div className="ep-orb ep-orb-2" aria-hidden />

            <Navbar />

            {/* ── HERO HEADER ────────────────────────────────── */}
            <header className="ep-hero">
                <div className="ep-hero-inner">
                    <div className="ep-hero-badge">Comunitate FitMoldova</div>
                    <h1 className="ep-hero-title">
                        Descoperă <span className="ep-hero-highlight">Evenimente</span> Sportive
                    </h1>
                    <p className="ep-hero-sub">
                        Înscrie-te la maratoane, ture cicliste, sesiuni de yoga și multe altele direct din Moldova
                    </p>
                    {/* SEARCH BAR centered */}
                    <div className="ep-search-wrap">
                        <span className="ep-search-icon">🔍</span>
                        <input
                            className="ep-search-input"
                            type="text"
                            placeholder="Caută eveniment, oraș, organizator..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button className="ep-search-clear" onClick={() => setSearch('')} aria-label="Șterge">✕</button>
                        )}
                    </div>
                </div>
            </header>

            {/* ── BODY: sidebar + grid ────────────────────────── */}
            <div className="ep-body">

                {/* LEFT SIDEBAR */}
                <aside className="ep-sidebar">

                    {/* Categorii */}
                    <div className="ep-filter-group">
                        <h4 className="ep-filter-group-title">Categorii</h4>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`ep-filter-btn ${catFilter === cat ? 'ep-filter-btn--active' : ''}`}
                                onClick={() => setCatFilter(cat)}
                            >
                                <span className="ep-filter-icon">{CATEGORY_ICONS[cat]}</span>
                                <span className="ep-filter-label">{cat}</span>
                                <span className="ep-filter-count">
                                    {cat === 'Toate'
                                        ? MOCK_EVENIMENTE.length
                                        : MOCK_EVENIMENTE.filter((e) => e.category === cat).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Dificultate */}
                    <div className="ep-filter-group">
                        <h4 className="ep-filter-group-title">Dificultate</h4>
                        {DIFFICULTIES.map((diff) => (
                            <button
                                key={diff}
                                className={`ep-filter-btn ${diffFilter === diff ? 'ep-filter-btn--active' : ''}`}
                                onClick={() => setDiffFilter(diff)}
                            >
                                <span className="ep-filter-icon">
                                    {diff === 'Ușor' ? '🟢' : diff === 'Mediu' ? '🟡' : diff === 'Avansat' ? '🔴' : '⚪'}
                                </span>
                                <span className="ep-filter-label">{diff}</span>
                            </button>
                        ))}
                    </div>

                    {/* Preț */}
                    <div className="ep-filter-group">
                        <h4 className="ep-filter-group-title">Preț</h4>
                        {PRICES.map((price) => (
                            <button
                                key={price}
                                className={`ep-filter-btn ${priceFilter === price ? 'ep-filter-btn--active' : ''}`}
                                onClick={() => setPriceFilter(price)}
                            >
                                <span className="ep-filter-icon">
                                    {price === 'Gratuit' ? '🆓' : price === 'Cu taxă' ? '💳' : '📋'}
                                </span>
                                <span className="ep-filter-label">{price}</span>
                            </button>
                        ))}
                    </div>

                    {/* Înscrierea mea */}
                    <div className="ep-filter-group ep-enrolled-box">
                        <h4 className="ep-filter-group-title">Înscrierea mea</h4>
                        <div className="ep-enrolled-stat">
                            <span className="ep-enrolled-num">{inscrise.length}</span>
                            <span className="ep-enrolled-label">
                                {inscrise.length === 1 ? 'eveniment' : 'evenimente'}
                            </span>
                        </div>
                        {isAuthenticated && inscrise.length > 0 && (
                            <Link to={ROUTES.EVENTS_DASHBOARD} className="ep-dashboard-link">
                                📊 Gestionează în Dashboard →
                            </Link>
                        )}
                        {!isAuthenticated && (
                            <Link to={ROUTES.LOGIN} className="ep-login-link">
                                🔐 Autentifică-te
                            </Link>
                        )}
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <div className="ep-main">
                    {/* Results bar */}
                    <div className="ep-results-bar">
                        <span className="ep-results-text">
                            <strong>{filtered.length}</strong>&nbsp;
                            {filtered.length === 1 ? 'eveniment găsit' : 'evenimente găsite'}
                        </span>
                        {hasActiveFilters && (
                            <button className="ep-clear-btn" onClick={clearFilters}>
                                ✕ Șterge filtrele
                            </button>
                        )}
                    </div>

                    {/* Empty state */}
                    {filtered.length === 0 ? (
                        <div className="ep-empty">
                            <div className="ep-empty-icon">🔍</div>
                            <h3 className="ep-empty-title">Niciun eveniment găsit</h3>
                            <p className="ep-empty-text">Încearcă să modifici filtrele sau termenul de căutare</p>
                            <button className="ep-clear-btn" onClick={clearFilters}>Șterge filtrele</button>
                        </div>
                    ) : (
                        <div className="ep-grid">
                            {filtered.map((ev) => {
                                const joined = isJoined(ev.id);
                                return (
                                    <div
                                        key={ev.id}
                                        className={`ep-card ${joined ? 'ep-card--joined' : ''}`}
                                        onClick={() => openDetail(ev)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && openDetail(ev)}
                                    >
                                        {/* ── IMAGE AREA ── */}
                                        <div className="ep-card-img">
                                            <img
                                                src={CATEGORY_IMAGES[ev.category] ?? CATEGORY_IMAGES['default']}
                                                alt={ev.category}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                            <div className="ep-card-img-overlay">
                                                <span className="ep-cat-chip">{ev.category}</span>
                                                {joined && (
                                                    <span className="ep-joined-chip">✓ Înscris</span>
                                                )}
                                            </div>
                                            <div className="ep-card-img-bottom">
                                                <span className={`ep-price-chip ${ev.price === 'Gratuit' ? 'ep-price-chip--free' : ''}`}>
                                                    {ev.price}
                                                </span>
                                            </div>
                                        </div>

                                        {/* ── CARD BODY ── */}
                                        <div className="ep-card-body">
                                            <h3 className="ep-card-title">{ev.name}</h3>
                                            <div className="ep-card-meta">
                                                <span className="ep-card-meta-item">
                                                    <span className="ep-meta-icon">📅</span>
                                                    {formatDateShort(ev.date)}
                                                </span>
                                                <span className="ep-card-meta-item">
                                                    <span className="ep-meta-icon">📍</span>
                                                    {ev.city}
                                                </span>
                                            </div>
                                            <div className="ep-card-meta">
                                                <span className="ep-card-meta-item">
                                                    <span className="ep-meta-icon">🕐</span>
                                                    {ev.time}
                                                </span>
                                                <span className="ep-card-meta-item">
                                                    <span className="ep-meta-icon">👥</span>
                                                    {ev.participants}/{ev.maxParticipants}
                                                </span>
                                            </div>

                                            <div className="ep-card-footer">
                                                <span className="ep-diff-badge">{ev.difficulty}</span>
                                                <button
                                                    className={joined ? 'ep-btn-leave' : 'ep-btn-join'}
                                                    onClick={(e) => handleJoin(ev, e)}
                                                >
                                                    {!isAuthenticated
                                                        ? '🔐 Autentifică-te'
                                                        : joined
                                                            ? '✕ Ieși'
                                                            : 'Alătură-te →'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── DETAIL OVERLAY ──────────────────────────────── */}
            {detail && (
                <div className="ep-overlay-backdrop" onClick={closeDetail}>
                    <div className="ep-overlay" onClick={(e) => e.stopPropagation()}>

                        <button className="ep-overlay-close" onClick={closeDetail} aria-label="Închide">✕</button>

                        {/* Hero banner */}
                        <div className="ep-overlay-hero" style={{ padding: 0, overflow: 'hidden' }}>
                            <img
                                src={CATEGORY_IMAGES[detail.category] ?? CATEGORY_IMAGES['default']}
                                alt={detail.category}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                            <div className="ep-overlay-hero-chips">
                                <span className="ep-overlay-chip">{detail.category}</span>
                                <span className="ep-overlay-chip">{detail.difficulty}</span>
                                <span className={`ep-overlay-chip ${detail.price === 'Gratuit' ? 'ep-overlay-chip--free' : ''}`}>
                                    {detail.price}
                                </span>
                                {selectedJoined && (
                                    <span className="ep-overlay-chip ep-overlay-chip--joined">✓ Înscris</span>
                                )}
                            </div>
                        </div>

                        {/* Scrollable content */}
                        <div className="ep-overlay-content">
                            <h2 className="ep-overlay-title">{detail.name}</h2>

                            {/* Meta grid */}
                            <div className="ep-overlay-meta-grid">
                                <div className="ep-overlay-meta-item">
                                    <span className="ep-overlay-meta-icon">📅</span>
                                    <div>
                                        <div className="ep-overlay-meta-label">Data & Ora</div>
                                        <div className="ep-overlay-meta-val">{formatDateFull(detail.date)} la {detail.time}</div>
                                    </div>
                                </div>
                                <div
                                    className="ep-overlay-meta-item ep-overlay-meta-item--clickable"
                                    onClick={() => setShowMap((v) => !v)}
                                    title="Click pentru hartă"
                                >
                                    <span className="ep-overlay-meta-icon">📍</span>
                                    <div style={{ flex: 1 }}>
                                        <div className="ep-overlay-meta-label">Locație</div>
                                        <div className="ep-overlay-meta-val">{detail.location}, {detail.city}</div>
                                    </div>
                                    <span className="ep-map-toggle-hint">
                                        {showMap ? '▲ Închide harta' : '🗺 Vezi pe hartă'}
                                    </span>
                                </div>
                                <div className="ep-overlay-meta-item">
                                    <span className="ep-overlay-meta-icon">👤</span>
                                    <div>
                                        <div className="ep-overlay-meta-label">Organizator</div>
                                        <div className="ep-overlay-meta-val">{detail.organizer}</div>
                                    </div>
                                </div>
                                <div className="ep-overlay-meta-item">
                                    <span className="ep-overlay-meta-icon">👥</span>
                                    <div>
                                        <div className="ep-overlay-meta-label">Capacitate</div>
                                        <div className="ep-overlay-meta-val">{detail.participants} / {detail.maxParticipants} locuri</div>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            {showMap && (
                                <div className="ep-overlay-map-wrap">
                                    <EventMap
                                        lat={detail.lat}
                                        lng={detail.lng}
                                        name={detail.name}
                                        location={detail.location}
                                        city={detail.city}
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <p className="ep-overlay-desc">{detail.description}</p>

                            {/* Capacity bar */}
                            <div className="ep-overlay-capacity">
                                <div className="ep-overlay-capacity-header">
                                    <span>Locuri ocupate</span>
                                    <span className="ep-overlay-capacity-pct">{selectedPct}%</span>
                                </div>
                                <div className="ep-overlay-capacity-bar">
                                    <div
                                        className={`ep-overlay-capacity-fill ${selectedPct > 80 ? 'ep-cap--high' : selectedPct > 50 ? 'ep-cap--mid' : 'ep-cap--low'}`}
                                        style={{ width: `${selectedPct}%` }}
                                    />
                                </div>
                                <span className="ep-overlay-capacity-text">
                                    {detail.participants} din {detail.maxParticipants} locuri ocupate
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="ep-overlay-tags">
                                {detail.tags.map((tag) => (
                                    <span key={tag} className="ep-overlay-tag">{tag}</span>
                                ))}
                            </div>

                            {/* Action button */}
                            <div className="ep-overlay-actions">
                                {!isAuthenticated ? (
                                    <button
                                        className="ep-overlay-btn-join"
                                        onClick={() => navigate(ROUTES.LOGIN)}
                                    >
                                        🔐 Autentifică-te pentru a participa
                                    </button>
                                ) : selectedJoined ? (
                                    <button
                                        className="ep-overlay-btn-leave"
                                        onClick={(e) => handleJoin(detail, e)}
                                    >
                                        ✕ Anulează Înscrierea
                                    </button>
                                ) : (
                                    <button
                                        className="ep-overlay-btn-join"
                                        onClick={(e) => handleJoin(detail, e)}
                                    >
                                        ✓ Înscrie-te la Eveniment →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        <Footer />
        </div>
    );
};

export default EvenimentePublic;