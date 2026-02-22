import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useDashboardData } from '../context/DashboardDataContext';
import { ROUTES } from '../routes/paths';
import type { Club } from '../services/mock/cluburi';
import './Dashboard.css';
import './DashboardOverlays.css';
import './Clubs.css';

type TabType = 'mine' | 'explore';
const CATEGORIES = ['Toate', 'Alergare', 'Ciclism', 'Fitness', 'Yoga', 'Înot', 'Trail'] as const;

const renderStars = (rating: number) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
};

const ClubsDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { completeJoinClub } = useProgress();
  const {
    cluburiJoined: joined,
    cluburiDisponibile: available,
    addClub,
    removeClub,
  } = useDashboardData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('Toate');
  const [detailClub, setDetailClub] = useState<Club | null>(null);

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME);
  };

  const joinClub = (club: Club) => {
    addClub(club);
    completeJoinClub();
    setDetailClub(null);
  };

  const leaveClub = (id: number) => {
    removeClub(id);
    setDetailClub(null);
  };

  const displayList = activeTab === 'mine' ? joined : available;

  const filtered = useMemo(() => {
    return displayList.filter((c) => {
      const matchSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.location.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === 'Toate' || c.category === filterCat;
      return matchSearch && matchCat;
    });
  }, [displayList, search, filterCat]);

  const totalMembers = [...joined, ...available].reduce((s, c) => s + c.members, 0);

  const isJoined = (id: number) => joined.some((c) => c.id === id);

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
            <Link to={ROUTES.CLUBS} className="db-nav-item db-nav-item--active">
              <span className="db-nav-icon">👥</span> Cluburi
            </Link>
            <Link to={ROUTES.EVENTS} className="db-nav-item">
              <span className="db-nav-icon">📅</span> Evenimente
            </Link>
            <Link to={ROUTES.PROFILE} className="db-nav-item">
              <span className="db-nav-icon">👤</span> Profil
            </Link>
          </nav>
          <button className="db-logout-btn" onClick={handleLogout}>
            <span>↩</span> Deconectare
          </button>
        </aside>

        {/* Main */}
        <main className="db-main">
          <div className="db-topbar">
            <div>
              <h1 className="db-title">Cluburi</h1>
              <p className="db-subtitle">
                Descoperă și alătură-te cluburilor sportive din comunitate
              </p>
            </div>
            <div className="db-user-chip">
              <div className="db-avatar">{user?.avatar}</div>
              <div className="db-user-info">
                <div className="db-user-name">{user?.firstName} {user?.lastName}</div>
                <div className="db-user-email">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="db-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="db-stat-card">
              <div className="db-stat-label">Cluburile Mele</div>
              <div className="db-stat-value">{joined.length}</div>
              <div className="db-stat-hint">Cluburi la care ești membru</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Disponibile</div>
              <div className="db-stat-value">{available.length}</div>
              <div className="db-stat-hint">Cluburi de explorat</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Comunitate Totală</div>
              <div className="db-stat-value">{totalMembers.toLocaleString()}</div>
              <div className="db-stat-hint">Membri activi în cluburi</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="cl-tabs">
            <button
                className={`cl-tab ${activeTab === 'mine' ? 'cl-tab--active' : ''}`}
                onClick={() => setActiveTab('mine')}
            >
              Cluburile Mele <span className="cl-tab-count">{joined.length}</span>
            </button>
            <button
                className={`cl-tab ${activeTab === 'explore' ? 'cl-tab--active' : ''}`}
                onClick={() => setActiveTab('explore')}
            >
              Explorează <span className="cl-tab-count">{available.length}</span>
            </button>
          </div>

          {/* Toolbar */}
          <div className="cl-toolbar">
            <div className="cl-search-wrap">
              <span className="cl-search-icon">🔍</span>
              <input
                  className="cl-search"
                  type="text"
                  placeholder="Caută cluburi după nume sau locație..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    className={`cl-filter-btn ${filterCat === cat ? 'cl-filter-btn--active' : ''}`}
                    onClick={() => setFilterCat(cat)}
                >
                  {cat}
                </button>
            ))}
          </div>

          {/* Card grid or empty */}
          {filtered.length === 0 ? (
              <div className="cl-empty">
                <div className="cl-empty-icon">
                  {activeTab === 'mine' ? '🏠' : '🔍'}
                </div>
                <h3 className="cl-empty-title">
                  {activeTab === 'mine'
                      ? 'Nu ești membru în niciun club'
                      : 'Niciun club găsit'}
                </h3>
                <p className="cl-empty-text">
                  {activeTab === 'mine'
                      ? 'Explorează cluburile disponibile și alătură-te comunității!'
                      : 'Încearcă să schimbi filtrul sau termenul de căutare.'}
                </p>
              </div>
          ) : (
              <div className="cl-grid">
                {filtered.map((club) => {
                  const memberOfClub = isJoined(club.id);
                  return (
                      <div
                          key={club.id}
                          className={`cl-card ${memberOfClub ? 'cl-card--joined' : ''}`}
                          onClick={() => setDetailClub(club)}
                      >
                        <div className="cl-card-banner" />
                        <div className="cl-card-body">
                          <div className="cl-card-top">
                            <div className="cl-card-icon">{club.icon}</div>
                            <div className="cl-card-header">
                              <h3 className="cl-card-name">{club.name}</h3>
                              <div className="cl-card-location"> {club.location}</div>
                            </div>
                          </div>

                          <p className="cl-card-desc">{club.description}</p>

                          <div className="cl-card-meta">
                            <span className="cl-chip cl-chip--cat">{club.category}</span>
                            <span className={`cl-chip cl-chip--level-${club.level}`}>{club.level}</span>
                            <span className="cl-chip">🗓 {club.schedule}</span>
                            <span className="cl-chip">
                        <span className="cl-stars">{renderStars(club.rating)}</span> {club.rating}
                      </span>
                          </div>

                          <div className="cl-card-footer">
                            <span className="cl-card-members">👥 {club.members} membri</span>
                            {memberOfClub ? (
                                <button
                                    className="cl-btn-leave"
                                    onClick={(e) => { e.stopPropagation(); leaveClub(club.id); }}
                                >
                                  Părăsește
                                </button>
                            ) : (
                                <button
                                    className="cl-btn-join"
                                    onClick={(e) => { e.stopPropagation(); joinClub(club); }}
                                >
                                  Alătură-te
                                </button>
                            )}
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>
          )}

          {/* Detail overlay */}
          {detailClub && (
              <div className="cl-detail-overlay" onClick={() => setDetailClub(null)}>
                <div className="cl-detail-panel" onClick={(e) => e.stopPropagation()}>
                  <div className="cl-detail-banner" />
                  <button className="cl-detail-close" onClick={() => setDetailClub(null)}>✕</button>

                  <div className="cl-detail-body">
                    <div className="cl-detail-top">
                      <div className="cl-detail-icon">{detailClub.icon}</div>
                      <div>
                        <h2 className="cl-detail-name">{detailClub.name}</h2>
                        <div className="cl-detail-loc">📍 {detailClub.location}</div>
                      </div>
                    </div>

                    <p className="cl-detail-desc">{detailClub.description}</p>

                    <div className="cl-detail-grid">
                      <div className="cl-detail-stat">
                        <div className="cl-detail-stat-label">Categorie</div>
                        <div className="cl-detail-stat-value">{detailClub.category}</div>
                      </div>
                      <div className="cl-detail-stat">
                        <div className="cl-detail-stat-label">Nivel</div>
                        <div className="cl-detail-stat-value">{detailClub.level}</div>
                      </div>
                      <div className="cl-detail-stat">
                        <div className="cl-detail-stat-label">Program</div>
                        <div className="cl-detail-stat-value">{detailClub.schedule}</div>
                      </div>
                      <div className="cl-detail-stat">
                        <div className="cl-detail-stat-label">Membri</div>
                        <div className="cl-detail-stat-value">{detailClub.members}</div>
                      </div>
                      <div className="cl-detail-stat">
                        <div className="cl-detail-stat-label">Rating</div>
                        <div className="cl-detail-stat-value">
                          <span className="cl-stars">{renderStars(detailClub.rating)}</span> {detailClub.rating}
                        </div>
                      </div>
                      <div className="cl-detail-stat">
                        <div className="cl-detail-stat-label">Fondat</div>
                        <div className="cl-detail-stat-value">{detailClub.founded}</div>
                      </div>
                    </div>

                    {detailClub.nextEvent && (
                        <div className="cl-detail-event">
                          <div className="cl-detail-event-icon">📅</div>
                          <div>
                            <div className="cl-detail-event-label">Următorul Eveniment</div>
                            <div className="cl-detail-event-text">{detailClub.nextEvent}</div>
                          </div>
                        </div>
                    )}

                    <div className="cl-detail-actions">
                      {isJoined(detailClub.id) ? (
                          <button className="cl-btn-leave" onClick={() => leaveClub(detailClub.id)}>
                            Părăsește Clubul
                          </button>
                      ) : (
                          <button className="cl-btn-join" onClick={() => joinClub(detailClub)}>
                            Alătură-te Clubului
                          </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
          )}

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

export default ClubsDashboard;
