import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { ROUTES } from '../routes/paths';
import { MOCK_ACTIVITATI } from '../services/mock/activitati';
import type { Activitate } from '../services/mock/activitati';
import './Dashboard.css';
import './DashboardOverlays.css';

const Activitati: React.FC = () => {
  const { user, logout } = useAuth();
  const { completeFirstActivity } = useProgress();
  const navigate = useNavigate();

  const [activitatiCurente, setActivitatiCurente] = useState<Activitate[]>([]);
  const [recomandari, setRecomandari] = useState<Activitate[]>(MOCK_ACTIVITATI);

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME);
  };

  const adaugaActivitate = (activitate: Activitate) => {
    const nouaActivitate: Activitate = {
      ...activitate,
      id: Date.now(),
      date: new Date().toLocaleDateString('ro-RO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
    setActivitatiCurente((prev) => [nouaActivitate, ...prev]);
    setRecomandari((prev) => prev.filter((r) => r.id !== activitate.id));
    completeFirstActivity();
  };

  const eliminaActivitate = (id: number) => {
    const activitate = activitatiCurente.find((a) => a.id === id);
    setActivitatiCurente((prev) => prev.filter((a) => a.id !== id));
    if (activitate) {
      const originalRec = MOCK_ACTIVITATI.find(
          (r) => r.name === activitate.name
      );
      if (originalRec) {
        setRecomandari((prev) => [...prev, originalRec]);
      }
    }
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
              <div className="db-stat-value">{recomandari.length}</div>
              <div className="db-stat-hint">Activități sugerate</div>
            </div>
          </div>

          {/* Activități curente */}
          <div className="db-section-card ov-section">
            <h3 className="db-section-title">Activitățile Tale Curente</h3>

            {activitatiCurente.length === 0 ? (
                <div className="ov-empty">
                  <p className="ov-empty-text">
                    Nu ai nicio activitate la moment.
                  </p>
                  <p className="ov-empty-hint">
                    Adaugă activități din recomandările de mai jos!
                  </p>
                </div>
            ) : (
                <div className="ov-list">
                  {activitatiCurente.map((act) => (
                      <div key={act.id} className="ov-item">
                        <div className="ov-item-info">
                          <div className="ov-item-name">{act.name}</div>
                          <div className="ov-item-meta">
                            <span className="ov-tag">{act.type}</span>
                            <span>{act.distance}</span>
                            <span>{act.duration}</span>
                            <span>{act.calories} kcal</span>
                            {act.date && <span>📅 {act.date}</span>}
                          </div>
                        </div>
                        <button
                            className="ov-btn-remove"
                            onClick={() => eliminaActivitate(act.id)}
                            title="Elimină activitatea"
                        >
                          ✕
                        </button>
                      </div>
                  ))}
                </div>
            )}
          </div>

          {/* Recomandări — apare doar dacă există date mock */}
          {MOCK_ACTIVITATI.length > 0 && (
              <div className="db-section-card ov-section">
                <h3 className="db-section-title">Recomandări de Activități</h3>
                <p className="ov-section-desc">
                  Activități populare din comunitatea FitMoldova. Adaugă-le la lista ta!
                </p>

                {recomandari.length === 0 ? (
                    <div className="ov-empty">
                      <p className="ov-empty-text">
                        Ai adăugat toate recomandările! Felicitări!!!
                      </p>
                    </div>
                ) : (
                    <div className="ov-list">
                      {recomandari.map((rec) => (
                          <div key={rec.id} className="ov-item ov-item--rec">
                            <div className="ov-item-info">
                              <div className="ov-item-name">{rec.name}</div>
                              <div className="ov-item-meta">
                                <span className="ov-tag">{rec.type}</span>
                                <span>{rec.distance}</span>
                                <span>{rec.duration}</span>
                                <span>{rec.calories} kcal</span>
                              </div>
                            </div>
                            <button
                                className="ov-btn-add"
                                onClick={() => adaugaActivitate(rec)}
                            >
                              + Adaugă
                            </button>
                          </div>
                      ))}
                    </div>
                )}
              </div>
          )}

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

export default Activitati;
