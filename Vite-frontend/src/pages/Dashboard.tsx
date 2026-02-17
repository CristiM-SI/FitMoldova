import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/paths';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME);
  };

  const registeredDate = user?.registeredAt
      ? new Date(user.registeredAt).toLocaleDateString('ro-RO', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
      : '';

  return (
      <div className="db-page">
        <div className="db-grid" aria-hidden="true" />

        {/* Sidebar */}
        <aside className="db-sidebar">
          <div className="db-logo">
            <span className="db-logo-white">FIT</span>
            <span className="db-logo-blue">MOLDOVA</span>
          </div>

          <nav className="db-nav">
            <a href="#" className="db-nav-item db-nav-item--active">
              <span className="db-nav-icon">📊</span>
              Dashboard
            </a>
            <a href="#" className="db-nav-item">
              <span className="db-nav-icon">🏃</span>
              Activități
            </a>
            <a href="#" className="db-nav-item">
              <span className="db-nav-icon">🏆</span>
              Provocări
            </a>
            <Link to={ROUTES.CLUBS} className="db-nav-item">
              <span className="db-nav-icon">👥</span>
              Cluburi
            </Link>
            <a href="#" className="db-nav-item">
              <span className="db-nav-icon">📅</span>
              Evenimente
            </a>
            <a href="#" className="db-nav-item">
              <span className="db-nav-icon">👤</span>
              Profil
            </a>
          </nav>

          <button className="db-logout-btn" onClick={handleLogout}>
            <span>↩</span> Deconectare
          </button>
        </aside>

        {/* Main */}
        <main className="db-main">
          <div className="db-topbar">
            <div>
              <h1 className="db-title">Dashboard</h1>
              <p className="db-subtitle">
                Bun venit, <span className="db-accent">{user?.firstName}</span>!
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

          {/* Welcome card */}
          <div className="db-welcome-card">
            <div className="db-welcome-content">
              <h2 className="db-welcome-title">Cont creat cu succes!</h2>
              <p className="db-welcome-text">
                Te-ai înregistrat pe{' '}
                <strong>{registeredDate}</strong>. Ești gata să începi
                călătoria ta fitness alături de comunitatea FitMoldova.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="db-stats-grid">
            <div className="db-stat-card">
              <div className="db-stat-label">Activități</div>
              <div className="db-stat-value">0</div>
              <div className="db-stat-hint">Adaugă prima activitate</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Distanță Totală</div>
              <div className="db-stat-value">0 km</div>
              <div className="db-stat-hint">Pornește primul antrenament</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Calorii Arse</div>
              <div className="db-stat-value">0</div>
              <div className="db-stat-hint">Urmărește progresul tău</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Zile Active</div>
              <div className="db-stat-value">0</div>
              <div className="db-stat-hint">Construiește un obicei</div>
            </div>
          </div>

          {/* Bottom sections */}
          <div className="db-sections-grid">

            <div className="db-section-card">
              <h3 className="db-section-title"> Provocări Active</h3>
              <div className="db-challenge-item">
                <div className="db-challenge-info">
                  <div className="db-challenge-name">100 km în Martie</div>
                  <div className="db-challenge-sub">312 participanți</div>
                </div>
                <button className="db-btn-join">Alătură-te</button>
              </div>
              <div className="db-challenge-item">
                <div className="db-challenge-info">
                  <div className="db-challenge-name">Streak de 7 zile</div>
                  <div className="db-challenge-sub">891 participanți</div>
                </div>
                <button className="db-btn-join">Alătură-te</button>
              </div>
              <div className="db-challenge-item">
                <div className="db-challenge-info">
                  <div className="db-challenge-name">50 km Ciclism</div>
                  <div className="db-challenge-sub">156 participanți</div>
                </div>
                <button className="db-btn-join">Alătură-te</button>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default Dashboard;
