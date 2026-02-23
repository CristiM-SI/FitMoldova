import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { MOCK_TRASEE } from '../services/mock/trasee';
import MoldovaRoutesMap from '../components/MoldovaRoutesMap';
import RoutesSidebar from '../components/RoutesSidebar';
import type { RouteDifficulty, RouteType } from '../types/Route';
import './RoutesPage.css';

const RoutesPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<RouteType | null>(null);
  const [filterDiff, setFilterDiff] = useState<RouteDifficulty | null>(null);

  const filteredTrasee = useMemo(
    () => MOCK_TRASEE.filter((t) => {
      if (filterType && t.type !== filterType) return false;
      if (filterDiff && t.difficulty !== filterDiff) return false;
      return true;
    }),
    [filterType, filterDiff],
  );

  // Dacă traseul selectat dispare după filtrare, resetăm selecția
  useEffect(() => {
    if (selectedId && !filteredTrasee.some((t) => t.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filteredTrasee, selectedId]);

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
      </div>
    </div>
  );
};

export default RoutesPage;
