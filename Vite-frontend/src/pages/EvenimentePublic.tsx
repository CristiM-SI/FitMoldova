import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EventMap from '../components/EventMap';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../context/useDashboardData';
import { eventApi } from '../services/api/eventApi';
import type { EventDto } from '../services/api/eventApi';
import { ROUTES } from '../routes/paths';

// ── Constante locale (nu mai vin din mock) ────────────────────────────────────
const CATEGORIES = ['Toate', 'Maraton', 'Ciclism', 'Yoga', 'Fitness', 'Trail', 'Înot', 'Social'] as const;
const DIFFICULTIES = ['Toate', 'Ușor', 'Mediu', 'Avansat'] as const;
const PRICES = ['Toate', 'Gratuit', 'Cu taxă'] as const;

const CATEGORY_IMAGES: Record<string, string> = {
    Toate:   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=48&q=80&auto=format&fit=crop',
    Maraton: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=48&q=80&auto=format&fit=crop',
    Ciclism: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=48&q=80&auto=format&fit=crop',
    Yoga:    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=48&q=80&auto=format&fit=crop',
    Fitness: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=48&q=80&auto=format&fit=crop',
    Trail:   'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=48&q=80&auto=format&fit=crop',
    Înot:    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=48&q=80&auto=format&fit=crop',
    Social:  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=48&q=80&auto=format&fit=crop',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
    Maraton: 'linear-gradient(135deg, #1a7fff 0%, #7c3aed 100%)',
    Ciclism: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    Yoga:    'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    Fitness: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    Trail:   'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
    Înot:    'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
    Social:  'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    default: 'linear-gradient(135deg, #1a7fff 0%, #7c3aed 100%)',
};

const CATEGORY_ICON: Record<string, string> = {
    Maraton: '🏅', Ciclism: '🚴', Yoga: '🧘', Fitness: '💪',
    Trail: '🥾', Înot: '🏊', Social: '🎉',
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
const getGradient = (category: string) => CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS['default'];

// ── Tipuri locale ─────────────────────────────────────────────────────────────
// Extindem EventDto cu câmpuri UI derivate local
type EventItem = EventDto & {
    icon:  string;
    image: string;
    time:  string;
    tags:  string[];
    lat:   number;
    lng:   number;
};

function toEventItem(dto: EventDto): EventItem {
    return {
        ...dto,
        icon:  CATEGORY_ICON[dto.category] ?? '🏋️',
        image: dto.imageUrl ?? '',
        time:  '—',
        tags:  [],
        lat:   47.0245,
        lng:   28.8322,
    };
}

// ── Componenta principală ─────────────────────────────────────────────────────
const EvenimentePublic: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { joinedEventIds, joinEvent, leaveEvent } = useDashboardData();
    const navigate = useNavigate();

    const [events,     setEvents]     = useState<EventItem[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState<string | null>(null);
    const [search,     setSearch]     = useState('');
    const [catFilter,  setCatFilter]  = useState<string>('Toate');
    const [diffFilter, setDiffFilter] = useState<string>('Toate');
    const [priceFilter,setPriceFilter]= useState<string>('Toate');
    const [detail,     setDetail]     = useState<EventItem | null>(null);
    const [showMap,    setShowMap]    = useState(false);
    const [joining,    setJoining]    = useState<number | null>(null);

    useEffect(() => {
        eventApi.getAll()
            .then((data) => setEvents(
                data
                    .filter((dto) => dto.maxParticipants > 0)   // exclude 0/0 events
                    .map(toEventItem)
            ))
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // isJoined vine exclusiv din joinedEventIds (API, nu localStorage)
    const isJoined = (id: number) => joinedEventIds.includes(id);

    const handleJoin = async (ev: EventItem, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!isAuthenticated) { navigate({ to: ROUTES.LOGIN }); return; }
        if (joining === ev.id) return;
        setJoining(ev.id);
        try {
            if (isJoined(ev.id)) {
                await leaveEvent(ev.id);
                // actualizare locala a contorului (context face si el optimistic update)
                setEvents((prev) => prev.map((item) =>
                    item.id === ev.id ? { ...item, participants: Math.max(0, item.participants - 1) } : item
                ));
                if (detail?.id === ev.id) {
                    setDetail((prev) => prev ? { ...prev, participants: Math.max(0, prev.participants - 1) } : prev);
                }
            } else {
                await joinEvent(ev.id);
                setEvents((prev) => prev.map((item) =>
                    item.id === ev.id ? { ...item, participants: item.participants + 1 } : item
                ));
                if (detail?.id === ev.id) {
                    setDetail((prev) => prev ? { ...prev, participants: prev.participants + 1 } : prev);
                }
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setJoining(null);
        }
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return events.filter((ev) => {
            const matchSearch =
                ev.name.toLowerCase().includes(q) ||
                ev.city.toLowerCase().includes(q) ||
                ev.organizer.toLowerCase().includes(q) ||
                ev.description.toLowerCase().includes(q);
            const matchCat   = catFilter   === 'Toate' || ev.category  === catFilter;
            const matchDiff  = diffFilter  === 'Toate' || ev.difficulty === diffFilter;
            const matchPrice = priceFilter === 'Toate' ||
                (priceFilter === 'Gratuit' ? ev.price === 'Gratuit' : ev.price !== 'Gratuit');
            return matchSearch && matchCat && matchDiff && matchPrice;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [events, search, catFilter, diffFilter, priceFilter]);

    const hasActiveFilters = catFilter !== 'Toate' || diffFilter !== 'Toate' || priceFilter !== 'Toate' || search;
    const clearFilters = () => { setCatFilter('Toate'); setDiffFilter('Toate'); setPriceFilter('Toate'); setSearch(''); };

    const joinedCount  = joinedEventIds.length;
    const selectedPct  = detail ? capacityPct(detail.participants, detail.maxParticipants) : 0;
    const selectedJoined = detail ? isJoined(detail.id) : false;

    return (
        <div className="ep-page">
            <div className="ep-noise" aria-hidden />
            <div className="ep-orb ep-orb-1" aria-hidden />
            <div className="ep-orb ep-orb-2" aria-hidden />

            <Navbar />

            {/* ── HERO ── */}
            <header className="ep-hero">
                <div className="ep-hero-inner">
                    <div className="ep-hero-badge">Comunitate FitMoldova</div>
                    <h1 className="ep-hero-title">
                        Descoperă <span className="ep-hero-highlight">Evenimente</span> Sportive
                    </h1>
                    <p className="ep-hero-sub">
                        Înscrie-te la maratoane, ture cicliste, sesiuni de yoga și multe altele direct din Moldova
                    </p>
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

            {/* ── BODY ── */}
            <div className="ep-body">

                {/* LEFT SIDEBAR */}
                <aside className="ep-sidebar">

                    <div className="ep-filter-group">
                        <h4 className="ep-filter-group-title">Categorii</h4>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`ep-filter-btn ${catFilter === cat ? 'ep-filter-btn--active' : ''}`}
                                onClick={() => setCatFilter(cat)}
                            >
                                <img
                                    src={CATEGORY_IMAGES[cat]}
                                    alt={cat}
                                    loading="lazy"
                                    style={{
                                        width: 28, height: 28, borderRadius: '50%', objectFit: 'cover',
                                        flexShrink: 0,
                                        border: catFilter === cat ? '2px solid #1a7fff' : '2px solid transparent',
                                    }}
                                />
                                <span className="ep-filter-label">{cat}</span>
                                <span className="ep-filter-count">
                                    {cat === 'Toate' ? events.length : events.filter((e) => e.category === cat).length}
                                </span>
                            </button>
                        ))}
                    </div>

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

                    <div className="ep-filter-group ep-enrolled-box">
                        <h4 className="ep-filter-group-title">Înscrierea mea</h4>
                        <div className="ep-enrolled-stat">
                            <span className="ep-enrolled-num">{joinedCount}</span>
                            <span className="ep-enrolled-label">
                                {joinedCount === 1 ? 'eveniment' : 'evenimente'}
                            </span>
                        </div>
                        {isAuthenticated && joinedCount > 0 && (
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

                {/* MAIN */}
                <div className="ep-main">
                    <div className="ep-results-bar">
                        <span className="ep-results-text">
                            <strong>{filtered.length}</strong>&nbsp;
                            {filtered.length === 1 ? 'eveniment găsit' : 'evenimente găsite'}
                        </span>
                        {hasActiveFilters && (
                            <button className="ep-clear-btn" onClick={clearFilters}>✕ Șterge filtrele</button>
                        )}
                    </div>

                    {loading && <div className="ep-loading">Se încarcă evenimentele...</div>}
                    {error   && <div className="ep-error">⚠️ {error}</div>}

                    {!loading && !error && (filtered.length === 0 ? (
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
                                const isJoining = joining === ev.id;
                                return (
                                    <div
                                        key={ev.id}
                                        className={`ep-card ${joined ? 'ep-card--joined' : ''}`}
                                        onClick={() => { setDetail(ev); setShowMap(false); }}
                                        role="button" tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && setDetail(ev)}
                                    >
                                        <div className="ep-card-img" style={{
                                            background: ev.image ? 'none' : getGradient(ev.category),
                                            position: 'relative', overflow: 'hidden',
                                        }}>
                                            {ev.image ? (
                                                <img src={ev.image} alt={ev.name} loading="lazy"
                                                     style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }} />
                                            ) : (
                                                <span className="ep-card-emoji">{ev.icon}</span>
                                            )}
                                            <div className="ep-card-img-overlay">
                                                <span className="ep-cat-chip">{ev.category}</span>
                                                {joined && <span className="ep-joined-chip">✓ Înscris</span>}
                                            </div>
                                            <div className="ep-card-img-bottom">
                                                <span className={`ep-price-chip ${ev.price === 'Gratuit' ? 'ep-price-chip--free' : ''}`}>
                                                    {ev.price}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ep-card-body">
                                            <h3 className="ep-card-title">{ev.name}</h3>
                                            <div className="ep-card-meta">
                                                <span className="ep-card-meta-item"><span className="ep-meta-icon">📅</span>{formatDateShort(ev.date)}</span>
                                                <span className="ep-card-meta-item"><span className="ep-meta-icon">📍</span>{ev.city}</span>
                                            </div>
                                            <div className="ep-card-meta">
                                                <span className="ep-card-meta-item"><span className="ep-meta-icon">🕐</span>{ev.time}</span>
                                                <span className="ep-card-meta-item"><span className="ep-meta-icon">👥</span>{ev.participants}/{ev.maxParticipants}</span>
                                            </div>
                                            <div className="ep-card-footer">
                                                <span className="ep-diff-badge">{ev.difficulty}</span>
                                                <button
                                                    className={joined ? 'ep-btn-leave' : 'ep-btn-join'}
                                                    onClick={(e) => handleJoin(ev, e)}
                                                    disabled={isJoining}
                                                >
                                                    {isJoining ? '...' : !isAuthenticated ? '🔐 Autentifică-te' : joined ? '✕ Ieși' : 'Alătură-te →'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── DETAIL OVERLAY ── */}
            {detail && (
                <div className="ep-overlay-backdrop" onClick={() => { setDetail(null); setShowMap(false); }}>
                    <div className="ep-overlay" onClick={(e) => e.stopPropagation()}>
                        <button className="ep-overlay-close" onClick={() => { setDetail(null); setShowMap(false); }} aria-label="Închide">✕</button>

                        <div className="ep-overlay-hero" style={{
                            background: detail.image ? 'none' : getGradient(detail.category),
                            position: 'relative', overflow: 'hidden',
                        }}>
                            {detail.image ? (
                                <>
                                    <img src={detail.image} alt={detail.name} loading="lazy"
                                         style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />
                                </>
                            ) : (
                                <span className="ep-overlay-emoji">{detail.icon}</span>
                            )}
                            <div className="ep-overlay-hero-chips" style={{ position: 'relative', zIndex: 1 }}>
                                <span className="ep-overlay-chip">{detail.category}</span>
                                <span className="ep-overlay-chip">{detail.difficulty}</span>
                                <span className={`ep-overlay-chip ${detail.price === 'Gratuit' ? 'ep-overlay-chip--free' : ''}`}>{detail.price}</span>
                                {selectedJoined && <span className="ep-overlay-chip ep-overlay-chip--joined">✓ Înscris</span>}
                            </div>
                        </div>

                        <div className="ep-overlay-content">
                            <h2 className="ep-overlay-title">{detail.name}</h2>

                            <div className="ep-overlay-meta-grid">
                                <div className="ep-overlay-meta-item">
                                    <span className="ep-overlay-meta-icon">📅</span>
                                    <div>
                                        <div className="ep-overlay-meta-label">Data & Ora</div>
                                        <div className="ep-overlay-meta-val">{formatDateFull(detail.date)} la {detail.time}</div>
                                    </div>
                                </div>
                                <div className="ep-overlay-meta-item ep-overlay-meta-item--clickable"
                                     onClick={() => setShowMap((v) => !v)} title="Click pentru hartă">
                                    <span className="ep-overlay-meta-icon">📍</span>
                                    <div style={{ flex: 1 }}>
                                        <div className="ep-overlay-meta-label">Locație</div>
                                        <div className="ep-overlay-meta-val">{detail.location}, {detail.city}</div>
                                    </div>
                                    <span className="ep-map-toggle-hint">{showMap ? '▲ Închide harta' : '🗺 Vezi pe hartă'}</span>
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

                            {showMap && (
                                <div className="ep-overlay-map-wrap">
                                    <EventMap lat={detail.lat} lng={detail.lng} name={detail.name} location={detail.location} city={detail.city} />
                                </div>
                            )}

                            <p className="ep-overlay-desc">{detail.description}</p>

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

                            {detail.tags.length > 0 && (
                                <div className="ep-overlay-tags">
                                    {detail.tags.map((tag) => (
                                        <span key={tag} className="ep-overlay-tag">{tag}</span>
                                    ))}
                                </div>
                            )}

                            <div className="ep-overlay-actions">
                                {!isAuthenticated ? (
                                    <button className="ep-overlay-btn-join" onClick={() => navigate({ to: ROUTES.LOGIN })}>
                                        🔐 Autentifică-te pentru a participa
                                    </button>
                                ) : selectedJoined ? (
                                    <button className="ep-overlay-btn-leave" onClick={(e) => handleJoin(detail, e)} disabled={joining === detail.id}>
                                        {joining === detail.id ? '...' : '✕ Anulează Înscrierea'}
                                    </button>
                                ) : (
                                    <button className="ep-overlay-btn-join" onClick={(e) => handleJoin(detail, e)} disabled={joining === detail.id}>
                                        {joining === detail.id ? '...' : '✓ Înscrie-te la Eveniment →'}
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
