import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/paths';
import './Dashboard.css';
import './DashboardOverlays.css';

interface Activitate {
  id: number;
  name: string;
  type: string;
  icon: string;
  distance: string;
  duration: string;
  calories: number;
  date: string;
}

const ActivitatiEmpty: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activitatiCurente] = useState<Activitate[]>([]);

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME);
  };

  const totalCalories = activitatiCurente.reduce((s, a) => s + a.calories, 0);
  const totalActivitati = activitatiCurente.length;

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
              <span className="db-nav-icon">📊</span>
              Dashboard
            </Link>
            <Link to={ROUTES.ACTIVITIES} className="db-nav-item db-nav-item--active">
              <span className="db-nav-icon">🏃</span>
              Activități
            </Link>
            <Link to={ROUTES.CHALLENGES} className="db-nav-item">
              <span className="db-nav-icon">🏆</span>
              Provocări
            </Link>
            <Link to={ROUTES.CLUBS} className="db-nav-item">
              <span className="db-nav-icon">👥</span>
              Cluburi
            </Link>
            <Link to={ROUTES.EVENTS} className="db-nav-item">
              <span className="db-nav-icon">📅</span>
              Evenimente
            </Link>
            <Link to={ROUTES.PROFILE} className="db-nav-item">
              <span className="db-nav-icon">👤</span>
              Profil
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
              <h1 className="db-title">Activități</h1>
              <p className="db-subtitle">
                Gestionează activitățile tale sportive
              </p>
            </div>
            <div className="db-user-chip">
              <div className="db-avatar">{user?.avatar}</div>
              <div className="db-user-info">
                <div className="db-user-name">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="db-user-email">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="db-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="db-stat-card">
              <div className="db-stat-label">Activități Înregistrate</div>
              <div className="db-stat-value">{totalActivitati}</div>
              <div className="db-stat-hint">Total activități adăugate</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Calorii Arse</div>
              <div className="db-stat-value">{totalCalories}</div>
              <div className="db-stat-hint">Total calorii din activități</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Recomandări Disponibile</div>
              <div className="db-stat-value">0</div>
              <div className="db-stat-hint">Activități sugerate</div>
            </div>
          </div>

          {/* Activități curente */}
          <div className="db-section-card ov-section">
            <h3 className="db-section-title">Activitățile Tale Curente</h3>

            <div className="ov-empty">
              <p className="ov-empty-text">
                Nu ai nicio activitate la moment.
              </p>
              <p className="ov-empty-hint">
                Momentan nu sunt activități disponibile pentru adăugare.
              </p>
            </div>
          </div>

          {/* Buton înapoi */}
          <div className="ov-back-wrap">
            <Link to={ROUTES.DASHBOARD} className="ov-btn-back">
              ← Înapoi la Dashboard
            </Link>
          </div>
        </main>
      </div>
  );
};

export default ActivitatiEmpty;
