import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/paths';
import type { Activity, RecommendedActivity } from '../types/Activity';
import { RECOMMENDED_ACTIVITIES } from '../services/mock/Mockdata';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUnderConstruction, setShowUnderConstruction] = useState<boolean>(false);
  const [showActivitiesPage, setShowActivitiesPage] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME);
  };

  const handleUnderConstructionClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    setShowUnderConstruction(true);
  };

  const handleActivitiesClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    setShowActivitiesPage(true);
  };

  const closeOverlay = (): void => {
    setShowUnderConstruction(false);
  };

  const closeActivitiesPage = (): void => {
    setShowActivitiesPage(false);
  };

  const addRecommendedActivity = (recommended: RecommendedActivity): void => {
    const newActivity: Activity = {
      id: Date.now(),
      title: recommended.title,
      type: recommended.type,
      duration: recommended.estimatedDuration,
      distance: recommended.estimatedDistance,
      calories: recommended.estimatedCalories,
      date: new Date().toISOString().split('T')[0],
      icon: recommended.icon,
    };
    setActivities([newActivity, ...activities]);
  };

  const deleteActivity = (id: number): void => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  const registeredDate = user?.registeredAt
      ? new Date(user.registeredAt).toLocaleDateString('ro-RO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      : '';

  return (
      <div className="db-page">
        <div className="db-grid" aria-hidden="true" />
        <aside className="db-sidebar">
          <Link to={ROUTES.HOME} className="db-logo">
            <span className="db-logo-white">FIT</span>
            <span className="db-logo-blue">MOLDOVA</span>
          </Link>
          <nav className="db-nav">
            <a href="#" className="db-nav-item db-nav-item--active">
              <span className="db-nav-icon">📊</span>
              Dashboard
            </a>
            <a href="#" className="db-nav-item" onClick={handleActivitiesClick}>
              <span className="db-nav-icon">🏃</span>
              Activități
            </a>
            <a href="#" className="db-nav-item" onClick={handleUnderConstructionClick}>
              <span className="db-nav-icon">🏆</span>
              Provocări
            </a>
            <Link to={ROUTES.CLUBS} className="db-nav-item">
              <span className="db-nav-icon">👥</span>
              Cluburi
            </Link>
            <a href="#" className="db-nav-item" onClick={handleUnderConstructionClick}>
              <span className="db-nav-icon">📅</span>
              Evenimente
            </a>
            <a href="#" className="db-nav-item" onClick={handleUnderConstructionClick}>
              <span className="db-nav-icon">👤</span>
              Profil
            </a>
          </nav>
          <button className="db-logout-btn" onClick={handleLogout}>
            <span>↩</span> Deconectare
          </button>
        </aside>
        <main className="db-main">
          <div className="db-topbar">
            <div>
              <h1 className="db-title">Dashboard</h1>
              <p className="db-subtitle">Bun venit, <span className="db-accent">{user?.firstName}</span>!</p>
            </div>
            <div className="db-user-chip">
              <div className="db-avatar">{user?.avatar}</div>
              <div className="db-user-info">
                <div className="db-user-name">{user?.firstName} {user?.lastName}</div>
                <div className="db-user-email">{user?.email}</div>
              </div>
            </div>
          </div>
          <div className="db-welcome-card">
            <div className="db-welcome-content">
              <h2 className="db-welcome-title">Cont creat cu succes!</h2>
              <p className="db-welcome-text">Te-ai înregistrat pe <strong>{registeredDate}</strong>. Ești gata să începi călătoria ta fitness alături de comunitatea FitMoldova.</p>
            </div>
          </div>
          <div className="db-stats-grid">
            <div className="db-stat-card">
              <div className="db-stat-label">Activități</div>
              <div className="db-stat-value">{activities.length}</div>
              <div className="db-stat-hint">{activities.length === 0 ? 'Adaugă prima activitate' : 'Continuă activitățile'}</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Distanță Totală</div>
              <div className="db-stat-value">{activities.reduce((sum, a) => sum + (a.distance || 0), 0).toFixed(1)} km</div>
              <div className="db-stat-hint">{activities.length === 0 ? 'Pornește primul antrenament' : 'Urmărește progresul'}</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Calorii Arse</div>
              <div className="db-stat-value">{activities.reduce((sum, a) => sum + a.calories, 0)}</div>
              <div className="db-stat-hint">{activities.length === 0 ? 'Urmărește progresul tău' : 'Foarte bine!'}</div>
            </div>
            <div className="db-stat-card">
              <div className="db-stat-label">Timp Total</div>
              <div className="db-stat-value">{activities.reduce((sum, a) => sum + a.duration, 0)} min</div>
              <div className="db-stat-hint">{activities.length === 0 ? 'Construiește un obicei' : 'Continuă astfel!'}</div>
            </div>
          </div>
          <div className="db-sections-grid">
            <div className="db-section-card">
              <h3 className="db-section-title">🏆 Provocări Active</h3>
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
                <li className="db-check-item db-check-done">
                  <span className="db-check-icon">✓</span>
                  Creare cont
                </li>
                <li className="db-check-item">
                  <span className="db-check-icon">○</span>
                  Completează profilul tău
                </li>
                <li className={`db-check-item ${activities.length > 0 ? 'db-check-done' : ''}`}>
                  <span className="db-check-icon">{activities.length > 0 ? '✓' : '○'}</span>
                  Înregistrează prima activitate
                </li>
                <li className="db-check-item">
                  <span className="db-check-icon">○</span>
                  Alătură-te unui club local
                </li>
                <li className="db-check-item">
                  <span className="db-check-icon">○</span>
                  Participă la o provocare
                </li>
              </ul>
            </div>
          </div>
        </main>
        {showActivitiesPage && (
            <div className="db-overlay db-activities-overlay" onClick={closeActivitiesPage}>
              <div className="db-activities-page" onClick={(e) => e.stopPropagation()}>
                <button className="db-overlay-close" onClick={closeActivitiesPage}>×</button>
                <div className="db-activities-header">
                  <h1 className="db-activities-title"><span className="db-activities-icon">🏃</span>Activitățile Mele</h1>
                  <p className="db-activities-subtitle">Monitorizează-ți progresul și adaugă activități noi</p>
                </div>
                <div className="db-activities-section">
                  <h2 className="db-section-title">📋 Activități Curente<span className="db-activity-count">({activities.length})</span></h2>
                  {activities.length === 0 ? (
                      <div className="db-empty-state">
                        <div className="db-empty-icon">📭</div>
                        <h3 className="db-empty-title">Nu ai activități înregistrate</h3>
                        <p className="db-empty-text">Începe prin a adăuga una din recomandările de mai jos sau creează propria activitate!</p>
                      </div>
                  ) : (
                      <div className="db-activities-list">
                        {activities.map((activity) => (
                            <div key={activity.id} className="db-activity-card">
                              <div className="db-activity-icon-large">{activity.icon}</div>
                              <div className="db-activity-details">
                                <h3 className="db-activity-name">{activity.title}</h3>
                                <div className="db-activity-meta">
                                  <span className="db-activity-date">📅 {new Date(activity.date).toLocaleDateString('ro-RO', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
                                  <span className="db-activity-type">• {activity.type}</span>
                                </div>
                                <div className="db-activity-stats">
                                  <div className="db-activity-stat">
                                    <span className="db-stat-label">⏱️ Durată</span>
                                    <span className="db-stat-value">{activity.duration} min</span>
                                  </div>
                                  {activity.distance && (
                                      <div className="db-activity-stat">
                                        <span className="db-stat-label">📍 Distanță</span>
                                        <span className="db-stat-value">{activity.distance} km</span>
                                      </div>
                                  )}
                                  <div className="db-activity-stat">
                                    <span className="db-stat-label">🔥 Calorii</span>
                                    <span className="db-stat-value">{activity.calories} kcal</span>
                                  </div>
                                </div>
                              </div>
                              <button className="db-activity-delete" onClick={() => deleteActivity(activity.id)} title="Șterge activitatea">🗑️</button>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
                <div className="db-activities-section">
                  <h2 className="db-section-title">💡 Recomandări Pentru Tine</h2>
                  <p className="db-recommendations-intro">Explorează aceste activități recomandate și adaugă-le cu un click!</p>
                  <div className="db-recommendations-grid">
                    {RECOMMENDED_ACTIVITIES.map((rec) => (
                        <div key={rec.id} className="db-recommendation-card">
                          <div className="db-rec-header">
                            <span className="db-rec-icon">{rec.icon}</span>
                            <span className={`db-rec-difficulty db-rec-difficulty--${rec.difficulty.toLowerCase()}`}>{rec.difficulty}</span>
                          </div>
                          <h3 className="db-rec-title">{rec.title}</h3>
                          <p className="db-rec-description">{rec.description}</p>
                          <div className="db-rec-stats">
                            <div className="db-rec-stat">
                              <span className="db-rec-stat-icon">⏱️</span>
                              <span>{rec.estimatedDuration} min</span>
                            </div>
                            {rec.estimatedDistance && (
                                <div className="db-rec-stat">
                                  <span className="db-rec-stat-icon">📍</span>
                                  <span>{rec.estimatedDistance} km</span>
                                </div>
                            )}
                            <div className="db-rec-stat">
                              <span className="db-rec-stat-icon">🔥</span>
                              <span>{rec.estimatedCalories} kcal</span>
                            </div>
                          </div>
                          <button className="db-rec-add-btn" onClick={() => addRecommendedActivity(rec)}>➕ Adaugă Activitate</button>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        )}
        {showUnderConstruction && (
            <div className="db-overlay" onClick={closeOverlay}>
              <div className="db-overlay-card" onClick={(e) => e.stopPropagation()}>
                <button className="db-overlay-close" onClick={closeOverlay}>×</button>
                <div className="db-overlay-icon">🚧</div>
                <h2 className="db-overlay-title">Pagină în Construcție</h2>
                <p className="db-overlay-text">Această funcționalitate este în curs de dezvoltare și va fi disponibilă în curând.<br />Mulțumim pentru înțelegere!</p>
                <button className="db-overlay-btn" onClick={closeOverlay}>Înapoi la Dashboard</button>
              </div>
            </div>
        )}
      </div>
  );
};

export default Dashboard;
