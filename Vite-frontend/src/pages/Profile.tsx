import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { useProgress } from "../context/ProgressContext";
import { ROUTES } from "../routes/paths";
import styles from "../styles/Profile.module.css";
import './Dashboard.css';
import './DashboardOverlays.css';

const AVATAR_COLORS = [
    "#1a7fff", "#00c8a0", "#f59e0b", "#ef4444", "#8b5cf6"
];

function getInitials(firstName: string, lastName: string) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getAvatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const Profile: React.FC = () => {
    const { user: authUser, logout } = useAuth();
    const { user, updateUser } = useUser();
    const { completeProfile } = useProgress();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    const [editData, setEditData] = useState({
        firstName: user?.firstName || authUser?.firstName || "",
        lastName: user?.lastName || authUser?.lastName || "",
        phone: user?.phone || "",
        location: user?.location || "",
        bio: user?.bio || "",
    });

    const handleLogout = (): void => {
        logout();
        navigate(ROUTES.HOME);
    };

    if (!authUser) {
        return (
            <div className={styles.page}>
                <div className={styles.grid} aria-hidden="true" />
                <div className={styles.emptyCard}>
                    <p className={styles.emptyTitle}>Nu ești autentificat</p>
                    <p className={styles.emptyText}>Trebuie să creezi un cont pentru a vedea profilul.</p>
                    <button className={styles.btn} onClick={() => navigate(ROUTES.REGISTER)}>
                        CREEAZĂ CONT
                    </button>
                </div>
            </div>
        );
    }

    const displayFirstName = user?.firstName || authUser.firstName;
    const displayLastName = user?.lastName || authUser.lastName;
    const displayEmail = user?.email || authUser.email;

    const avatarColor = getAvatarColor(displayFirstName + displayLastName);
    const initials = getInitials(displayFirstName, displayLastName);
    const fullName = `${displayFirstName} ${displayLastName}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateUser(editData);
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);

        // Bifează milestone-ul dacă cel puțin un câmp e completat
        if (editData.phone || editData.location || editData.bio) {
            completeProfile();
        }
    };

    const handleCancel = () => {
        setEditData({
            firstName: user?.firstName || authUser.firstName,
            lastName: user?.lastName || authUser.lastName,
            phone: user?.phone || "",
            location: user?.location || "",
            bio: user?.bio || "",
        });
        setIsEditing(false);
    };

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
                    <Link to={ROUTES.EVENTS_DASHBOARD} className="db-nav-item">
                        <span className="db-nav-icon">📅</span> Evenimente
                    </Link>
                    <Link to={ROUTES.PROFILE} className="db-nav-item db-nav-item--active">
                        <span className="db-nav-icon">👤</span> Profil
                    </Link>
                </nav>
                <button className="db-logout-btn" onClick={handleLogout}>
                    <span>↩</span> Deconectare
                </button>
            </aside>

            {/* Main */}
            <main className="db-main" style={{ padding: '0' }}>
                {/* Top bar cu Edit */}
                <header className={styles.topBar} style={{ position: 'relative', zIndex: 100 }}>
                    <h1 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                        👤 Profilul Meu
                    </h1>
                    <div className={styles.topRight}>
                        {!isEditing ? (
                            <button
                                className={styles.editBtn}
                                onClick={() => setIsEditing(true)}
                                title="Editează profilul"
                            >
                                <PencilIcon />
                                <span>Editează</span>
                            </button>
                        ) : (
                            <div className={styles.editActions}>
                                <button className={styles.cancelBtn} onClick={handleCancel}>Anulează</button>
                                <button className={styles.saveBtn} onClick={handleSave}>Salvează</button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Save toast */}
                {saved && (
                    <div className={styles.toast}>
                        <CheckIcon /> Profilul a fost actualizat!
                    </div>
                )}

                <div className={styles.main}>
                    {/* Hero card */}
                    <div className={styles.heroCard}>
                        <div className={styles.heroBg} />
                        <div className={styles.avatarWrap}>
                            <div className={styles.avatar} style={{ backgroundColor: avatarColor }}>
                                {initials}
                            </div>
                            {isEditing && (
                                <div className={styles.avatarBadge}><PencilIcon /></div>
                            )}
                        </div>

                        {isEditing ? (
                            <div className={styles.nameEditRow}>
                                <input
                                    name="firstName"
                                    className={styles.nameInput}
                                    value={editData.firstName}
                                    onChange={handleChange}
                                    placeholder="Prenume"
                                />
                                <input
                                    name="lastName"
                                    className={styles.nameInput}
                                    value={editData.lastName}
                                    onChange={handleChange}
                                    placeholder="Nume"
                                />
                            </div>
                        ) : (
                            <h1 className={styles.heroName}>{fullName}</h1>
                        )}

                        <p className={styles.heroEmail}>{displayEmail}</p>
                        <div className={styles.heroBadge}>
                            <span className={styles.badgeDot} />
                            Membru activ
                        </div>
                    </div>

                    {/* Info grid */}
                    <div className={styles.grid2}>
                        <div className={styles.infoCard}>
                            <h2 className={styles.cardTitle}>
                                <UserIcon /> Informații personale
                            </h2>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Prenume</label>
                                {isEditing ? (
                                    <input name="firstName" className={styles.fieldInput} value={editData.firstName} onChange={handleChange} />
                                ) : (
                                    <p className={styles.fieldValue}>{displayFirstName}</p>
                                )}
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Nume</label>
                                {isEditing ? (
                                    <input name="lastName" className={styles.fieldInput} value={editData.lastName} onChange={handleChange} />
                                ) : (
                                    <p className={styles.fieldValue}>{displayLastName}</p>
                                )}
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Email</label>
                                <p className={styles.fieldValue}>{displayEmail}</p>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Telefon</label>
                                {isEditing ? (
                                    <input name="phone" className={styles.fieldInput} value={editData.phone} onChange={handleChange} placeholder="+373 xxx xxx xxx" />
                                ) : (
                                    <p className={styles.fieldValue}>{user?.phone || <span className={styles.empty}>Necompletat</span>}</p>
                                )}
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Locație</label>
                                {isEditing ? (
                                    <input name="location" className={styles.fieldInput} value={editData.location} onChange={handleChange} placeholder="ex: Chișinău, Moldova" />
                                ) : (
                                    <p className={styles.fieldValue}>{user?.location || <span className={styles.empty}>Necompletat</span>}</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <h2 className={styles.cardTitle}>
                                <InfoIcon /> Despre mine
                            </h2>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Bio</label>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        className={styles.fieldTextarea}
                                        value={editData.bio}
                                        onChange={handleChange}
                                        placeholder="Spune ceva despre tine..."
                                        rows={4}
                                    />
                                ) : (
                                    <p className={styles.fieldValue}>
                                        {user?.bio || <span className={styles.empty}>Nicio descriere adăugată.</span>}
                                    </p>
                                )}
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Membru din</label>
                                <p className={styles.fieldValue}>{user?.joinDate || '—'}</p>
                            </div>

                            <div className={styles.stats}>
                                <div className={styles.stat}>
                                    <span className={styles.statNum}>0</span>
                                    <span className={styles.statLbl}>Activități</span>
                                </div>
                                <div className={styles.statDiv} />
                                <div className={styles.stat}>
                                    <span className={styles.statNum}>0</span>
                                    <span className={styles.statLbl}>Provocări</span>
                                </div>
                                <div className={styles.statDiv} />
                                <div className={styles.stat}>
                                    <span className={styles.statNum}>0</span>
                                    <span className={styles.statLbl}>Cluburi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back button */}
                    <div className="ov-back-wrap" style={{ margin: '1rem 0 2rem' }}>
                        <Link to={ROUTES.DASHBOARD} className="ov-btn-back">
                            ← Înapoi la Dashboard
                        </Link>
                    </div>
                </div>

                <div className="db-footer">
                    <p className="db-footer-copy">© 2026 FitMoldova. Toate drepturile rezervate.</p>
                    <div className="db-footer-links">
                        <Link to={ROUTES.CONTACT} className="db-footer-link">Contact</Link>
                        <Link to={ROUTES.FEEDBACK} className="db-footer-link">Feedback</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

/* ---- Icons ---- */
const PencilIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

export default Profile;
