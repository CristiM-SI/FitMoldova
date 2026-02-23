import React from 'react';
import Navbar from '../components/layout/Navbar';
import { MOCK_TRASEE } from '../services/mock/trasee';
import './RoutesPage.css';

const RoutesPage: React.FC = () => {
  return (
    <div className="routes-page">
      <Navbar />

      <div className="routes-hero">
        <div className="routes-hero-content">
          <h1 className="routes-hero-title">
            Trasee <span className="routes-hero-highlight">Moldova</span>
          </h1>
          <p className="routes-hero-subtitle">
            Explorează {MOCK_TRASEE.length} trasee interactive de alergare, ciclism și drumeție
            pe harta Moldovei. Adaugă-ți traseul preferat ca obiectiv în dashboard.
          </p>

          <div className="routes-hero-stats">
            <div className="routes-stat">
              <span className="routes-stat-value">{MOCK_TRASEE.length}</span>
              <span className="routes-stat-label">Trasee</span>
            </div>
            <div className="routes-stat">
              <span className="routes-stat-value">
                {Math.round(MOCK_TRASEE.reduce((s, t) => s + t.distance, 0))} km
              </span>
              <span className="routes-stat-label">Distanță totală</span>
            </div>
            <div className="routes-stat">
              <span className="routes-stat-value">
                {[...new Set(MOCK_TRASEE.map((t) => t.region))].length}
              </span>
              <span className="routes-stat-label">Regiuni</span>
            </div>
          </div>
        </div>
      </div>

      <div className="routes-main">
        {/* Sidebar + Hartă — se completează în commit-urile 4 și 5 */}
        <div className="routes-layout">
          <aside className="routes-sidebar">
            <div className="routes-sidebar-placeholder">
              <span>📋 Lista traseelor</span>
              <p>Se încarcă în curând…</p>
            </div>
          </aside>

          <div className="routes-map-container">
            <div className="routes-map-placeholder">
              <span className="routes-map-placeholder-icon">🗺️</span>
              <p>Harta interactivă Moldova</p>
              <small>Se încarcă în curând…</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;
