import React, { useState, useRef, useCallback } from 'react';
import { message } from 'antd';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const CATEGORIES = ['Toate', 'Antrenament', 'Competiții', 'Nutriție', 'Recuperare', 'Evenimente'];

const SAMPLE_MEDIA = [
    { id: 1, type: 'image', category: 'Competiții', user: 'FitMoldova', handle: '@fitmoldova', time: '2h', title: 'Maratonul Chișinău 2025', likes: 248, comments: 34, verified: true, color: '#1a3a5c', emoji: '🏃' },
    { id: 2, type: 'video', category: 'Antrenament', user: 'Ion Ceban', handle: '@ion_fitness', time: '5h', title: 'Leg Day Full Routine', likes: 189, comments: 22, verified: true, color: '#1a2e1a', emoji: '🏋️' },
    { id: 3, type: 'image', category: 'Nutriție', user: 'Maria Lungu', handle: '@maria_fit', time: '1z', title: 'Meal prep săptămânal', likes: 312, comments: 45, verified: true, color: '#2e1a2e', emoji: '🥗' },
    { id: 4, type: 'image', category: 'Antrenament', user: 'Alex Rusu', handle: '@alex_rusu', time: '1z', title: 'Morning Run 10K', likes: 97, comments: 11, verified: false, color: '#1a2e2e', emoji: '🌅' },
    { id: 5, type: 'video', category: 'Recuperare', user: 'Dr. Popescu', handle: '@dr_popescu', time: '2z', title: 'Stretching post-maraton', likes: 421, comments: 67, verified: true, color: '#2e2a1a', emoji: '🧘' },
    { id: 6, type: 'image', category: 'Competiții', user: 'FitMoldova', handle: '@fitmoldova', time: '3z', title: 'Podium Cupa Moldovei', likes: 534, comments: 89, verified: true, color: '#1a1a3a', emoji: '🏆' },
    { id: 7, type: 'image', category: 'Antrenament', user: 'Natalia Bîrcă', handle: '@natalia_b', time: '4z', title: 'CrossFit WOD', likes: 143, comments: 19, verified: false, color: '#2e1a1a', emoji: '💪' },
    { id: 8, type: 'video', category: 'Evenimente', user: 'FitMoldova', handle: '@fitmoldova', time: '5z', title: 'FitFest 2025 Highlights', likes: 876, comments: 123, verified: true, color: '#1a2a1a', emoji: '🎉' },
    { id: 9, type: 'image', category: 'Nutriție', user: 'Chef Sănătos', handle: '@chef_fit', time: '6z', title: 'Smoothie proteinat', likes: 267, comments: 38, verified: false, color: '#2a1a2a', emoji: '🥤' },
];

const UPLOAD_TYPES = [
    { icon: '🖼️', label: 'Imagine', accept: 'image/*', ext: 'JPG, PNG, WEBP' },
    { icon: '🎬', label: 'Video', accept: 'video/*', ext: 'MP4, MOV' },
    { icon: '🎵', label: 'Audio', accept: 'audio/*', ext: 'MP3, WAV' },
    { icon: '📄', label: 'Document', accept: '.pdf,.doc,.docx', ext: 'PDF, DOC' },
];

const CATEGORY_IMAGES: Record<string, string> = {
    Competiții: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
    Antrenament: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
    Nutriție: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    Recuperare: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    Evenimente: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    default: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80',
};

interface MediaItem {
    id: number; type: string; category: string; user: string;
    handle: string; time: string; title: string; likes: number;
    comments: number; verified: boolean; color: string; emoji: string;
}

const MediaCard: React.FC<{ item: MediaItem; onClick: (item: MediaItem) => void }> = ({ item, onClick }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(item.likes);
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={() => onClick(item)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#0d1b2e',
                border: `1px solid ${hovered ? '#38bdf8' : '#1e3a5f'}`,
                borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                transition: 'all 0.25s ease',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered ? '0 8px 32px rgba(56,189,248,0.15)' : 'none',
            }}
        >
            <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                <img
                    src={CATEGORY_IMAGES[item.category] ?? CATEGORY_IMAGES['default']}
                    alt={item.category}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {item.type === 'video' && (
                    <div style={{
                        position: 'absolute', bottom: 10, right: 10,
                        background: 'rgba(0,0,0,0.75)', borderRadius: 6,
                        padding: '3px 8px', fontSize: 11, color: '#38bdf8',
                    }}>▶ Video</div>
                )}
                <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: 'rgba(56,189,248,0.2)', border: '1px solid rgba(56,189,248,0.4)',
                    borderRadius: 6, padding: '3px 10px', fontSize: 11, color: '#38bdf8', fontWeight: 600,
                }}>{item.category}</div>
            </div>

            <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#0a1628',
                    }}>{item.user.slice(0, 2).toUpperCase()}</div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{item.user}</span>
                            {item.verified && <span style={{ color: '#38bdf8', fontSize: 12 }}>✓</span>}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{item.time} în urmă</div>
                    </div>
                </div>

                <p style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1', marginBottom: 12, lineHeight: 1.4 }}>
                    {item.title}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                setLiked(!liked);
                                setLikeCount(liked ? likeCount - 1 : likeCount + 1);
                            }}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 5,
                                color: liked ? '#f43f5e' : '#64748b', fontSize: 13,
                            }}
                        >{liked ? '❤️' : '🤍'} {likeCount}</button>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 13 }}>
                            💬 {item.comments}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UploadModal: React.FC<{ onClose: () => void; onUpload: (data: { files: File[]; title: string; category: string }) => void }> = ({ onClose, onUpload }) => {
    const [dragOver, setDragOver] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [activeType, setActiveType] = useState(0);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Antrenament');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setDragOver(false);
        setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }, []);

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{
                background: '#0d1b2e', border: '1px solid #1e3a5f', borderRadius: 24,
                width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 32,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <div>
                        <h2 style={{ color: '#e2e8f0', fontSize: 22, fontWeight: 700, margin: 0 }}>📤 Încarcă Media</h2>
                        <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>Adaugă imagini, video, audio sau documente</p>
                    </div>
                    <button onClick={onClose} style={{
                        background: '#1e3a5f', border: 'none', borderRadius: '50%',
                        width: 36, height: 36, cursor: 'pointer', color: '#94a3b8', fontSize: 18,
                    }}>×</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
                    {UPLOAD_TYPES.map((t, i) => (
                        <button key={i} onClick={() => setActiveType(i)} style={{
                            background: activeType === i ? 'rgba(56,189,248,0.15)' : '#081222',
                            border: `1px solid ${activeType === i ? '#38bdf8' : '#1e3a5f'}`,
                            borderRadius: 12, padding: '12px 8px', cursor: 'pointer', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 24, marginBottom: 4 }}>{t.icon}</div>
                            <div style={{ color: activeType === i ? '#38bdf8' : '#94a3b8', fontSize: 12, fontWeight: 600 }}>{t.label}</div>
                            <div style={{ color: '#475569', fontSize: 10, marginTop: 2 }}>{t.ext}</div>
                        </button>
                    ))}
                </div>

                <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: `2px dashed ${dragOver ? '#38bdf8' : '#1e3a5f'}`,
                        borderRadius: 16, padding: 32, textAlign: 'center', cursor: 'pointer',
                        background: dragOver ? 'rgba(56,189,248,0.05)' : '#081222', marginBottom: 20,
                    }}
                >
                    <div style={{ fontSize: 36, marginBottom: 12 }}>{dragOver ? '📂' : '⬆️'}</div>
                    <p style={{ color: '#94a3b8', fontSize: 15, margin: '0 0 6px', fontWeight: 600 }}>
                        {dragOver ? 'Eliberează pentru a încărca' : 'Trage fișierele aici'}
                    </p>
                    <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>
                        sau <span style={{ color: '#38bdf8' }}>selectează din calculator</span>
                    </p>
                    <input ref={fileInputRef} type="file" accept={UPLOAD_TYPES[activeType].accept}
                           multiple onChange={e => setSelectedFiles(prev => [...prev, ...Array.from(e.target.files ?? [])])}
                           style={{ display: 'none' }} />
                </div>

                {selectedFiles.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                        <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                            Fișiere selectate ({selectedFiles.length})
                        </p>
                        {selectedFiles.map((f, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                background: '#081222', border: '1px solid #1e3a5f',
                                borderRadius: 10, padding: '10px 12px', marginBottom: 8,
                            }}>
                                <span style={{ fontSize: 20 }}>🖼️</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                                    <div style={{ color: '#475569', fontSize: 11 }}>{formatSize(f.size)}</div>
                                </div>
                                <button onClick={() => setSelectedFiles(prev => prev.filter((_, j) => j !== i))}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 16 }}>×</button>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginBottom: 16 }}>
                    <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Titlu postare</label>
                    <input value={title} onChange={e => setTitle(e.target.value)}
                           placeholder="Descrie conținutul media..."
                           style={{
                               width: '100%', background: '#081222', border: '1px solid #1e3a5f',
                               borderRadius: 10, padding: '12px 14px', color: '#e2e8f0',
                               fontSize: 14, outline: 'none', boxSizing: 'border-box',
                           }} />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Categorie</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} style={{
                        width: '100%', background: '#081222', border: '1px solid #1e3a5f',
                        borderRadius: 10, padding: '12px 14px', color: '#e2e8f0',
                        fontSize: 14, outline: 'none', boxSizing: 'border-box',
                    }}>
                        {CATEGORIES.filter(c => c !== 'Toate').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <button
                    onClick={() => { onUpload({ files: selectedFiles, title, category }); onClose(); }}
                    style={{
                        width: '100%', padding: 14,
                        background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                        border: 'none', borderRadius: 12, cursor: 'pointer',
                        color: '#0a1628', fontSize: 15, fontWeight: 700,
                    }}>
                    {selectedFiles.length > 0 ? `Publică ${selectedFiles.length} fișier${selectedFiles.length > 1 ? 'e' : ''}` : 'Publică în Galerie'}
                </button>
            </div>
        </div>
    );
};

const MediaModal: React.FC<{ item: MediaItem; onClose: () => void }> = ({ item, onClose }) => (
    <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(12px)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={{
            background: '#0d1b2e', border: '1px solid #1e3a5f',
            borderRadius: 24, width: '100%', maxWidth: 700, overflow: 'hidden',
        }}>
            <div style={{ height: 350, position: 'relative', overflow: 'hidden' }}>
                <img
                    src={CATEGORY_IMAGES[item.category] ?? CATEGORY_IMAGES['default']}
                    alt={item.category}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <button onClick={onClose} style={{
                    position: 'absolute', top: 16, right: 16,
                    background: 'rgba(0,0,0,0.6)', border: '1px solid #1e3a5f',
                    borderRadius: '50%', width: 40, height: 40,
                    cursor: 'pointer', color: '#94a3b8', fontSize: 20,
                }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
                <h3 style={{ color: '#e2e8f0', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>{item.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: '#0a1628',
                    }}>{item.user.slice(0, 2).toUpperCase()}</div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}>{item.user}</span>
                            {item.verified && <span style={{ color: '#38bdf8' }}>✓</span>}
                        </div>
                        <span style={{ color: '#64748b', fontSize: 12 }}>{item.handle} · {item.time} în urmă</span>
                    </div>
                    <span style={{
                        marginLeft: 'auto', background: 'rgba(56,189,248,0.15)',
                        border: '1px solid rgba(56,189,248,0.3)', borderRadius: 8,
                        padding: '4px 12px', color: '#38bdf8', fontSize: 12, fontWeight: 600,
                    }}>{item.category}</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button style={{
                        flex: 1, padding: 12, background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                        border: 'none', borderRadius: 10, cursor: 'pointer', color: '#0a1628', fontWeight: 700, fontSize: 14,
                    }}>❤️ {item.likes} Aprecieri</button>
                    <button style={{
                        flex: 1, padding: 12, background: '#081222',
                        border: '1px solid #1e3a5f', borderRadius: 10, cursor: 'pointer', color: '#94a3b8', fontWeight: 600, fontSize: 14,
                    }}>💬 {item.comments} Comentarii</button>
                </div>
            </div>
        </div>
    </div>
);

const Gallery: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('Toate');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showUpload, setShowUpload] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [uploadedItems, setUploadedItems] = useState<MediaItem[]>([]);
    const [ctaHovered, setCtaHovered] = useState(false);
    const [hoveredListId, setHoveredListId] = useState<number | null>(null);

    const allMedia = [...uploadedItems, ...SAMPLE_MEDIA];
    const filtered = activeCategory === 'Toate' ? allMedia : allMedia.filter(m => m.category === activeCategory);

    const handleUpload = ({ files, title, category }: { files: File[]; title: string; category: string }) => {
        const newItems: MediaItem[] = files.map((f, i) => ({
            id: Date.now() + i,
            type: f.type.startsWith('video') ? 'video' : 'image',
            category, user: 'Tu', handle: '@user', time: 'acum',
            title: title || f.name, likes: 0, comments: 0,
            verified: false, color: '#1a2a3a',
            emoji: f.type.startsWith('video') ? '🎬' : '🖼️',
        }));
        if (newItems.length === 0 && title) {
            newItems.push({ id: Date.now(), type: 'image', category, user: 'Tu', handle: '@user', time: 'acum', title, likes: 0, comments: 0, verified: false, color: '#1a2a3a', emoji: '📌' });
        }
        setUploadedItems(prev => [...newItems, ...prev]);
        message.success(`${newItems.length || 1} element publicat în galerie!`);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#060f1a', fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#e2e8f0' }}>
            <Navbar />

            {/* Hero */}
            <div style={{
                paddingTop: 100, paddingBottom: 48, paddingLeft: '5%', paddingRight: '5%',
                background: 'linear-gradient(180deg, #0a1628 0%, #060f1a 100%)',
                borderBottom: '1px solid #1e3a5f',
            }}>
                <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px', color: '#e2e8f0' }}>
                    🖼️ Galerie & <span style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Multimedia</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: 16, margin: '0 0 24px' }}>
                    Explorează conținut vizual din comunitatea FitMoldova
                </p>
                <div style={{ display: 'flex', gap: 24 }}>
                    {[
                        { label: 'Total media', value: allMedia.length },
                        { label: 'Video', value: allMedia.filter(m => m.type === 'video').length },
                        { label: 'Imagini', value: allMedia.filter(m => m.type === 'image').length },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: '#0d1b2e', border: '1px solid #1e3a5f',
                            borderRadius: 12, padding: '12px 20px', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#38bdf8' }}>{s.value}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 5%' }}>
                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                                padding: '7px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                                border: `1px solid ${activeCategory === cat ? '#38bdf8' : '#1e3a5f'}`,
                                background: activeCategory === cat ? 'rgba(56,189,248,0.15)' : '#081222',
                                color: activeCategory === cat ? '#38bdf8' : '#64748b',
                            }}>
                                {cat} <span style={{ opacity: 0.6, fontSize: 11 }}>
                                    {cat === 'Toate' ? allMedia.length : allMedia.filter(m => m.category === cat).length}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setViewMode('grid')} style={{
                            padding: '8px 14px', borderRadius: 8, border: '1px solid #1e3a5f', cursor: 'pointer', fontSize: 16,
                            background: viewMode === 'grid' ? 'rgba(56,189,248,0.15)' : '#081222',
                            color: viewMode === 'grid' ? '#38bdf8' : '#64748b',
                        }}>⊞</button>
                        <button onClick={() => setViewMode('list')} style={{
                            padding: '8px 14px', borderRadius: 8, border: '1px solid #1e3a5f', cursor: 'pointer', fontSize: 16,
                            background: viewMode === 'list' ? 'rgba(56,189,248,0.15)' : '#081222',
                            color: viewMode === 'list' ? '#38bdf8' : '#64748b',
                        }}>☰</button>
                        <button onClick={() => setShowUpload(true)} style={{
                            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                            color: '#0a1628', fontWeight: 700, fontSize: 13,
                        }}>+ Încarcă</button>
                    </div>
                </div>

                {/* Upload CTA */}
                <div onClick={() => setShowUpload(true)}
                     onMouseEnter={() => setCtaHovered(true)}
                     onMouseLeave={() => setCtaHovered(false)}
                     style={{
                    background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(129,140,248,0.08))',
                    border: `2px dashed ${ctaHovered ? '#38bdf8' : '#1e3a5f'}`, borderRadius: 16, padding: 28,
                    textAlign: 'center', cursor: 'pointer', marginBottom: 24,
                    transition: 'all 0.2s',
                }}
                >
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📤</div>
                    <p style={{ color: '#94a3b8', fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>Adaugă conținut în galerie</p>
                    <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>Imagini • Video • Audio • Documente</p>
                </div>

                {/* Grid */}
                {viewMode === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                        {filtered.map(item => <MediaCard key={item.id} item={item} onClick={setSelectedItem} />)}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filtered.map(item => (
                            <div key={item.id} onClick={() => setSelectedItem(item)}
                                 onMouseEnter={() => setHoveredListId(item.id)}
                                 onMouseLeave={() => setHoveredListId(null)}
                                 style={{
                                background: '#0d1b2e',
                                border: `1px solid ${hoveredListId === item.id ? '#38bdf8' : '#1e3a5f'}`,
                                borderRadius: 14, padding: 16, display: 'flex', gap: 16,
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            >
                                <div style={{
                                    width: 64, height: 64, borderRadius: 12, flexShrink: 0, overflow: 'hidden',
                                }}>
                                    <img
                                        src={CATEGORY_IMAGES[item.category] ?? CATEGORY_IMAGES['default']}
                                        alt={item.category}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 15 }}>{item.title}</span>
                                        <span style={{
                                            background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)',
                                            borderRadius: 6, padding: '2px 8px', color: '#38bdf8', fontSize: 11,
                                        }}>{item.category}</span>
                                    </div>
                                    <div style={{ color: '#64748b', fontSize: 12 }}>
                                        {item.user} · {item.time} în urmă · ❤️ {item.likes} · 💬 {item.comments}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                        <p style={{ color: '#64748b', fontSize: 16 }}>Niciun element în această categorie</p>
                    </div>
                )}
            </div>

            <Footer />

            {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />}
            {selectedItem && <MediaModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

        </div>
    );
};

export default Gallery;