import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/paths';
import './Dashboard.css';
import './DashboardOverlays.css';

const Provocari: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="db-page">
      <div className="db-grid" aria-hidden="true" />

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
          <Link to={ROUTES.CHALLENGES} className="db-nav-item db-nav-item--active">
            <span className="db-nav-icon">🏆</span> Provocări
          </Link>
          <Link to={ROUTES.CLUBS} className="db-nav-item">
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

      <main className="db-main">
        <div className="db-topbar">
          <div>
            <h1 className="db-title">Provocări</h1>
            <p className="db-subtitle">Participă la provocări și depășește-ți limitele</p>
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
            <div className="db-stat-label">Provocări Active</div>
            <div className="db-stat-hint">Provocări la care participi</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-label">Disponibile</div>
            <div className="db-stat-hint">Provocări de explorat</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-label">Completate</div>
            <div className="db-stat-value">0</div>
            <div className="db-stat-hint">Provocări finalizate</div>
          </div>
        </div>

        {/* Provocări inscrise */}
        <div className="db-section-card ov-section">
          <h3 className="db-section-title">Provocările Tale</h3>
          { }
        </div>

        {/* Provocări disponibile */}
        <div className="db-section-card ov-section">
          <h3 className="db-section-title">Provocări Disponibile</h3>
          <p className="ov-section-desc">Provocări populare din comunitatea FitMoldova</p>
          { }
        </div>

        <div className="ov-back-wrap">
          <Link to={ROUTES.DASHBOARD} className="ov-btn-back">← Înapoi la Dashboard</Link>
        </div>
      </main>
    </div>
  );
};

export default Provocari;
