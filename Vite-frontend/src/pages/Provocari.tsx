import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useDashboardData } from '../context/useDashboardData';
import { ROUTES } from '../routes/paths';
import type { Provocare } from '../services/mock/provocari';
import './Dashboard.css';
import './DashboardOverlays.css';

const difficultyColor = (d: string) => {
  if (d === 'Ușor') return 'ov-badge--green';
  if (d === 'Mediu') return 'ov-badge--yellow';
  return 'ov-badge--red';
};

const Provocari: React.FC = () => {
  const { user, logout } = useAuth();
  const { completeChallenge } = useProgress();
  const {
    provocariInscrise: inscrise,
    provocariDisponibile: disponibile,
    addProvocare,
    removeProvocare,
  } = useDashboardData();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME);
  };

  const inscrieTe = (provocare: Provocare) => {
    addProvocare(provocare);
    completeChallenge();
  };

  const paraseste = (id: number) => {
    removeProvocare(id);
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
            <Link to={ROUTES.EVENTS_DASHBOARD} className="db-nav-item">
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
              <h1 className="db-title">
                Provocări</h1>
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
              <div className="db-stat-value">{inscrise.length}</div>
              <div className="db-stat-hint">Provocări la care participi</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Disponibile</div>
              <div className="db-stat-value">{disponibile.length}</div>
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
            {inscrise.length === 0 ? (
                <div className="ov-empty">
                  <p className="ov-empty-text">Nu ești înscris la nicio provocare.</p>
                  <p className="ov-empty-hint">Alege o provocare din lista de mai jos!</p>
                </div>
            ) : (
                <div className="ov-list">
                  {inscrise.map((p) => (
                      <div key={p.id} className="ov-item">
                        <div className="ov-item-info">
                          <div className="ov-item-name">{p.name}</div>
                          <div className="ov-item-meta">
                            <span className={`ov-badge ${difficultyColor(p.difficulty)}`}>{p.difficulty}</span>
                            <span>⏱ {p.duration}</span>
                            <span>👥 {p.participants} participanți</span>
                          </div>
                          <div className="ov-progress-bar">
                            <div className="ov-progress-fill" style={{ width: `${p.progress ?? 0}%` }} />
                          </div>
                        </div>
                        <button className="ov-btn-leave" onClick={() => paraseste(p.id)}>
                          Părăsește
                        </button>
                      </div>
                  ))}
                </div>
            )}
          </div>

          {/* Provocări disponibile */}
          <div className="db-section-card ov-section">
            <h3 className="db-section-title">Provocări Disponibile</h3>
            <p className="ov-section-desc">Provocări populare din comunitatea FitMoldova</p>
            {disponibile.length === 0 ? (
                <div className="ov-empty">
                  <p className="ov-empty-text">Te-ai înscris la toate provocările!</p>
                </div>
            ) : (
                <div className="ov-list">
                  {disponibile.map((p) => (
                      <div key={p.id} className="ov-item ov-item--rec">
                        <div className="ov-item-info">
                          <div className="ov-item-name">{p.name}</div>
                          <div style={{ color: '#7a8baa', fontSize: '0.8rem', margin: '0.25rem 0' }}>{p.description}</div>
                          <div className="ov-item-meta">
                            <span className={`ov-badge ${difficultyColor(p.difficulty)}`}>{p.difficulty}</span>
                            <span>⏱ {p.duration}</span>
                            <span>👥 {p.participants} participanți</span>
                          </div>
                        </div>
                        <button className="ov-btn-join" onClick={() => inscrieTe(p)}>
                          Alătură-te
                        </button>
                      </div>
                  ))}
                </div>
            )}
          </div>

          <div className="ov-back-wrap">
            <Link to={ROUTES.DASHBOARD} className="ov-btn-back">← Înapoi la Dashboard</Link>
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

export default Provocari;
