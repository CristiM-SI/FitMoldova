import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/paths';
import './Dashboard.css';
import './DashboardOverlays.css';
import './Clubs.css';

const ClubsDashboardEmpty: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME);
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
              <div className="db-stat-value">0</div>
              <div className="db-stat-hint">Nu ești membru în niciun club</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Cluburi Disponibile</div>
              <div className="db-stat-value">0</div>
              <div className="db-stat-hint">Niciun club disponibil</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Comunitate Totală</div>
              <div className="db-stat-value">0</div>
              <div className="db-stat-hint">Membri activi în cluburi</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="cl-tabs">
            <button className="cl-tab cl-tab--active">
              Cluburile Mele <span className="cl-tab-count">0</span>
            </button>
            <button className="cl-tab">
              Explorează <span className="cl-tab-count">0</span>
            </button>
          </div>

          {/* Empty state */}
          <div className="cl-empty">
            <div className="cl-empty-icon">👥</div>
            <h3 className="cl-empty-title">Nu ești membru în niciun club</h3>
            <p className="cl-empty-text">
              Momentan nu sunt cluburi disponibile. Revino mai târziu pentru noi oportunități!
            </p>
          </div>

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

export default ClubsDashboardEmpty;
