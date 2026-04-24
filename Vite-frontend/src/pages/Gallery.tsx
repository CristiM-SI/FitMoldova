import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { message, Spin, Empty } from 'antd';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import galleryApi, {
    type GalleryInfoDto,
    GALLERY_CATEGORIES,
    resolveImageUrl,
} from '../services/api/galleryApi';

const FILTER_CATEGORIES = ['Toate', ...GALLERY_CATEGORIES] as const;

// ─────────────────────────── Card ──────────────────────────────────────
const GalleryCard: React.FC<{
    item: GalleryInfoDto;
    onClick: (item: GalleryInfoDto) => void;
}> = ({ item, onClick }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={() => onClick(item)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#0d1b2e',
                border: `1px solid ${hovered ? '#38bdf8' : '#1e3a5f'}`,
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered ? '0 8px 32px rgba(56,189,248,0.15)' : 'none',
            }}
        >
            <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
                <img
                    src={resolveImageUrl(item.thumbnailUrl)}
                    alt={item.title}
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.4s ease',
                        transform: hovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: 'rgba(56,189,248,0.2)',
                        border: '1px solid rgba(56,189,248,0.4)',
                        borderRadius: 6,
                        padding: '3px 10px',
                        fontSize: 11,
                        color: '#38bdf8',
                        fontWeight: 600,
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    {item.category}
                </div>
            </div>

            <div style={{ padding: 16 }}>
                <h3
                    style={{
                        color: '#e0f2fe',
                        fontSize: 15,
                        fontWeight: 600,
                        margin: '0 0 6px',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {item.title}
                </h3>
                {item.description && (
                    <p
                        style={{
                            color: '#94a3b8',
                            fontSize: 12,
                            margin: '0 0 10px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {item.description}
                    </p>
                )}
                {item.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {item.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    fontSize: 10,
                                    color: '#64748b',
                                    background: '#1a2e4a',
                                    padding: '2px 8px',
                                    borderRadius: 4,
                                }}
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────── Lightbox Modal ────────────────────────────
const Lightbox: React.FC<{
    item: GalleryInfoDto;
    onClose: () => void;
}> = ({ item, onClose }) => {
    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.92)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                cursor: 'zoom-out',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'default',
                }}
            >
                <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.title}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '75vh',
                        objectFit: 'contain',
                        borderRadius: 12,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                    }}
                />
                <div
                    style={{
                        background: '#0d1b2e',
                        padding: '16px 20px',
                        borderRadius: '0 0 12px 12px',
                        marginTop: -12,
                        paddingTop: 20,
                    }}
                >
                    <h2 style={{ color: '#e0f2fe', margin: '0 0 6px', fontSize: 20 }}>
                        {item.title}
                    </h2>
                    {item.description && (
                        <p style={{ color: '#94a3b8', margin: '0 0 10px', fontSize: 14 }}>
                            {item.description}
                        </p>
                    )}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span
                            style={{
                                fontSize: 11,
                                color: '#38bdf8',
                                background: 'rgba(56,189,248,0.15)',
                                padding: '3px 10px',
                                borderRadius: 5,
                                fontWeight: 600,
                            }}
                        >
                            {item.category}
                        </span>
                        {item.tags.map((t) => (
                            <span
                                key={t}
                                style={{
                                    fontSize: 11,
                                    color: '#94a3b8',
                                    background: '#1a2e4a',
                                    padding: '3px 10px',
                                    borderRadius: 5,
                                }}
                            >
                                #{t}
                            </span>
                        ))}
                        <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: 12 }}>
                            {new Date(item.createdAt).toLocaleDateString('ro-MD')}
                        </span>
                    </div>
                </div>
            </div>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    fontSize: 18,
                    cursor: 'pointer',
                }}
                aria-label="Închide"
            >
                ×
            </button>
        </div>
    );
};

// ─────────────────────────── Main Page ─────────────────────────────────
const Gallery: React.FC = () => {
    const [items, setItems] = useState<GalleryInfoDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] =
        useState<(typeof FILTER_CATEGORIES)[number]>('Toate');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<GalleryInfoDto | null>(null);

    // Fetch la mount
    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        galleryApi
            .getAll()
            .then((data) => {
                if (!cancelled) setItems(data);
            })
            .catch((err) => {
                if (!cancelled) {
                    message.error(err.message || 'Eroare la încărcarea galeriei.');
                    setItems([]);
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // Filtrare + search (memoized ca să nu refacă filtrarea la fiecare hover)
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return items.filter((it) => {
            const matchCat = activeCategory === 'Toate' || it.category === activeCategory;
            if (!matchCat) return false;
            if (!q) return true;
            return (
                it.title.toLowerCase().includes(q) ||
                it.description.toLowerCase().includes(q) ||
                it.tags.some((t) => t.toLowerCase().includes(q))
            );
        });
    }, [items, activeCategory, search]);

    const handleCardClick = useCallback((item: GalleryInfoDto) => {
        setSelected(item);
    }, []);

    return (
        <div style={{ background: '#0a1628', minHeight: '100vh', color: '#e0f2fe' }}>
            <Navbar />

            {/* Hero */}
            <section style={{ padding: '60px 24px 40px', textAlign: 'center', maxWidth: 1200, margin: '0 auto' }}>
                <h1 style={{ fontSize: 42, fontWeight: 700, margin: '0 0 12px', color: '#e0f2fe' }}>
                    Galerie <span style={{ color: '#38bdf8' }}>FitMoldova</span>
                </h1>
                <p style={{ color: '#94a3b8', fontSize: 17, maxWidth: 600, margin: '0 auto' }}>
                    Momente de la evenimente, antrenamente și competițiile comunității.
                </p>
            </section>

            {/* Filters */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 24px' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Caută după titlu, descriere sau tag..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: '1 1 280px',
                            padding: '10px 16px',
                            background: '#0d1b2e',
                            border: '1px solid #1e3a5f',
                            borderRadius: 10,
                            color: '#e0f2fe',
                            fontSize: 14,
                            outline: 'none',
                        }}
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: 8,
                        flexWrap: 'wrap',
                        marginTop: 16,
                    }}
                >
                    {FILTER_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '6px 16px',
                                borderRadius: 20,
                                border: '1px solid',
                                borderColor: activeCategory === cat ? '#38bdf8' : '#1e3a5f',
                                background: activeCategory === cat ? 'rgba(56,189,248,0.15)' : 'transparent',
                                color: activeCategory === cat ? '#38bdf8' : '#94a3b8',
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Grid */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <Spin size="large" />
                    </div>
                ) : filtered.length === 0 ? (
                    <Empty
                        description={
                            <span style={{ color: '#94a3b8' }}>
                                {items.length === 0
                                    ? 'Nu există încă imagini în galerie.'
                                    : 'Nu am găsit imagini pentru filtrul curent.'}
                            </span>
                        }
                        style={{ padding: '60px 0' }}
                    />
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: 20,
                        }}
                    >
                        {filtered.map((item) => (
                            <GalleryCard key={item.id} item={item} onClick={handleCardClick} />
                        ))}
                    </div>
                )}
            </section>

            {selected && <Lightbox item={selected} onClose={() => setSelected(null)} />}

            <Footer />
        </div>
    );
};

export default Gallery;
