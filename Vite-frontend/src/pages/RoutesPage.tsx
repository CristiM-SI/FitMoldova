import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { MOCK_TRASEE } from '../services/mock/trasee';
import MoldovaRoutesMap from '../components/MoldovaRoutesMap';
import RoutesSidebar from '../components/RoutesSidebar';
import type { RouteDifficulty, RouteType, Traseu } from '../types/Route';
import { useDashboardData } from '../context/useDashboardData';
import { useAuth } from '../context/AuthContext';
import './RoutesPage.css';

const RoutesPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<RouteType | null>(null);
  const [filterDiff, setFilterDiff] = useState<RouteDifficulty | null>(null);
  const [toast, setToast] = useState<{ icon: string; msg: string; visible: boolean }>({ icon: '', msg: '', visible: false });

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addTraseu, traseeSalvate } = useDashboardData();

  const filteredTrasee = useMemo(
    () => MOCK_TRASEE.filter((t) => {
      if (filterType && t.type !== filterType) return false;
      if (filterDiff && t.difficulty !== filterDiff) return false;
      return true;
    }),
    [filterType, filterDiff],
  );

  const selectedRoute: Traseu | undefined = useMemo(
    () => MOCK_TRASEE.find((t) => t.id === selectedId),
    [selectedId],
  );

  const isAlreadySaved = useMemo(
    () => (selectedRoute ? traseeSalvate.some((t) => t.id === selectedRoute.id) : false),
    [traseeSalvate, selectedRoute],
  );

  // Dacă traseul selectat dispare după filtrare, resetăm selecția
  useEffect(() => {
    if (selectedId && !filteredTrasee.some((t) => t.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filteredTrasee, selectedId]);

  const showToast = useCallback((icon: string, msg: string): void => {
    setToast({ icon, msg, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  }, []);

  const handleAddTarget = useCallback(() => {
    if (!selectedRoute) {
      showToast('ℹ️', 'Selectează un traseu din listă sau pe hartă.');
      return;
    }
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }
    if (isAlreadySaved) {
      showToast('✅', 'Traseul este deja în Dashboard.');
      return;
    }
    addTraseu(selectedRoute);
    showToast('🏁', 'Traseu adăugat la ținte în Dashboard!');
  }, [selectedRoute, isAuthenticated, navigate, location, isAlreadySaved, addTraseu, showToast]);

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
        <div className="routes-cta">
          <div>
            <p className="routes-cta-title">Adaugă traseul ca țintă</p>
            <p className="routes-cta-sub">
              Selectează un traseu pentru a-l trimite în Dashboard. {isAuthenticated ? '🏁' : '🔐 Autentificare necesară'}
            </p>
            {selectedRoute && (
              <p className="routes-cta-selected">
                {selectedRoute.icon} <strong>{selectedRoute.name}</strong> · {selectedRoute.distance} km · {selectedRoute.difficulty}
              </p>
            )}
          </div>
          <button
            className="routes-cta-btn"
            onClick={handleAddTarget}
            disabled={!selectedRoute}
          >
            {selectedRoute ? (isAlreadySaved ? 'În Dashboard' : 'Adaugă în Dashboard') : 'Selectează un traseu'}
          </button>
        </div>

        <div className="routes-layout">
          <aside className="routes-sidebar">
            <RoutesSidebar
              trasee={MOCK_TRASEE}
              selectedId={selectedId}
              onSelect={setSelectedId}
              filterType={filterType}
              setFilterType={setFilterType}
              filterDiff={filterDiff}
              setFilterDiff={setFilterDiff}
            />
          </aside>

          <div className="routes-map-container">
            <MoldovaRoutesMap
              trasee={filteredTrasee}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>

      {/* Toast */}
      <div
        className="routes-toast"
        style={{
          transform: toast.visible ? 'translateY(0)' : 'translateY(80px)',
          opacity: toast.visible ? 1 : 0,
        }}
      >
        <span className="routes-toast-icon">{toast.icon}</span>
        <span>{toast.msg}</span>
      </div>
      </div>
    </div>
  );
};

export default RoutesPage;
