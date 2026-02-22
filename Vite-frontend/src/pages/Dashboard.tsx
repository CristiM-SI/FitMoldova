import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { ROUTES } from '../routes/paths';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { progress } = useProgress();
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
          <Link to={ROUTES.HOME} className="db-logo">
            <span className="db-logo-white">FIT</span>
            <span className="db-logo-blue">MOLDOVA</span>
          </Link>

          <nav className="db-nav">
            <Link to={ROUTES.DASHBOARD} className="db-nav-item db-nav-item--active">
              <span className="db-nav-icon">📊</span>
              Dashboard
            </Link>
            <Link to={ROUTES.ACTIVITIES} className="db-nav-item">
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
            <Link to={ROUTES.CONTACT} className="db-nav-item">
              <span className="db-nav-icon">✉️</span>
              Contact
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
            <div className="db-section-card">
              <h3 className="db-section-title">🚀 Pași următori</h3>
              <ul className="db-checklist">
                <li className={`db-check-item ${progress.accountCreated ? 'db-check-done' : ''}`}>
                  <span className="db-check-icon">{progress.accountCreated ? '✓' : '○'}</span>
                  Creare cont
                </li>
                <li className={`db-check-item ${progress.profileCompleted ? 'db-check-done' : ''}`}>
                  <span className="db-check-icon">{progress.profileCompleted ? '✓' : '○'}</span>
                  Completează profilul tău
                </li>
                <li className={`db-check-item ${progress.firstActivity ? 'db-check-done' : ''}`}>
                  <span className="db-check-icon">{progress.firstActivity ? '✓' : '○'}</span>
                  Înregistrează prima activitate
                </li>
                <li className={`db-check-item ${progress.joinedClub ? 'db-check-done' : ''}`}>
                  <span className="db-check-icon">{progress.joinedClub ? '✓' : '○'}</span>
                  Alătură-te unui club local
                </li>
                <li className={`db-check-item ${progress.joinedChallenge ? 'db-check-done' : ''}`}>
                  <span className="db-check-icon">{progress.joinedChallenge ? '✓' : '○'}</span>
                  Participă la o provocare
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
  );
};

export default Dashboard;
