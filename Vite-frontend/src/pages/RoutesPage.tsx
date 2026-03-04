import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ROUTES } from '../routes/paths';
import { MOCK_TRASEE } from '../services/mock/trasee';
import MoldovaRoutesMap from '../components/MoldovaRoutesMap';
import RoutesSidebar from '../components/RoutesSidebar';
import type { RouteDifficulty, RouteType, Traseu } from '../types/Route';
import { useDashboardData } from '../context/useDashboardData';
import { useAuth } from '../context/AuthContext';
import Box from '@mui/material/Box';
import {
  routesPageSx, routesHeroSx, routesHeroContentSx, routesHeroTitleSx,
  routesHeroHighlightSx, routesHeroSubtitleSx, routesHeroStatsSx,
  routesStatSx, routesStatValueSx, routesStatLabelSx, routesMainSx,
  routesCtaSx, routesCtaTitleSx, routesCtaSubSx, routesCtaSelectedSx,
  routesCtaBtnSx, routesLayoutSx, routesHomeBtnSx,
  routesMapContainerSx, routesToastSx, routeDetailsCardSx,
} from '../styles/routesPage.styles';
/* Keep CSS for sub-component styles (rsb-*, route-popup-*, rdc-*, leaflet) */
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
      <Box sx={routesPageSx}>
        <Navbar />

        <Box sx={routesHeroSx}>
          <Box sx={routesHeroContentSx}>
            <Box component="h1" sx={routesHeroTitleSx}>
              Trasee <Box component="span" sx={routesHeroHighlightSx}>Moldova</Box>
            </Box>
            <Box component="p" sx={routesHeroSubtitleSx}>
              Explorează {MOCK_TRASEE.length} trasee interactive de alergare, ciclism și drumeție
              pe harta Moldovei. Adaugă-ți traseul preferat ca obiectiv în dashboard.
            </Box>

            <Box sx={routesHeroStatsSx}>
              <Box sx={routesStatSx}>
                <Box component="span" sx={routesStatValueSx}>{MOCK_TRASEE.length}</Box>
                <Box component="span" sx={routesStatLabelSx}>Trasee</Box>
              </Box>
              <Box sx={routesStatSx}>
                <Box component="span" sx={routesStatValueSx}>
                  {Math.round(MOCK_TRASEE.reduce((s, t) => s + t.distance, 0))} km
                </Box>
                <Box component="span" sx={routesStatLabelSx}>Distanță totală</Box>
              </Box>
              <Box sx={routesStatSx}>
                <Box component="span" sx={routesStatValueSx}>
                  {[...new Set(MOCK_TRASEE.map((t) => t.region))].length}
                </Box>
                <Box component="span" sx={routesStatLabelSx}>Regiuni</Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={routesMainSx}>
          <Box sx={routesCtaSx}>
            <div>
              <Box component="p" sx={routesCtaTitleSx}>Adaugă traseul ca țintă</Box>
              <Box component="p" sx={routesCtaSubSx}>
                Selectează un traseu pentru a-l trimite în Dashboard. {isAuthenticated ? '🏁' : '🔐 Autentificare necesară'}
              </Box>
              {selectedRoute && (
                  <Box component="p" sx={routesCtaSelectedSx}>
                    {selectedRoute.icon} <strong>{selectedRoute.name}</strong> · {selectedRoute.distance} km · {selectedRoute.difficulty}
                  </Box>
              )}
            </div>
            <Box
                component="button"
                sx={routesCtaBtnSx}
                onClick={handleAddTarget}
                disabled={!selectedRoute}
            >
              {selectedRoute ? (isAlreadySaved ? 'În Dashboard' : 'Adaugă în Dashboard') : 'Selectează un traseu'}
            </Box>
          </Box>

          <Box sx={routesLayoutSx}>
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

            <Box sx={routesMapContainerSx}>
              <MoldovaRoutesMap
                  trasee={filteredTrasee}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
              />
            </Box>
          </Box>

          {/* Panou detalii traseu */}
          <Box sx={routeDetailsCardSx}>
            {selectedRoute ? (
                <>
                  <div className="rdc-header">
                    <div>
                      <p className="rdc-kicker">Traseu selectat</p>
                      <h3 className="rdc-title">{selectedRoute.icon} {selectedRoute.name}</h3>
                      <p className="rdc-sub">{selectedRoute.description}</p>
                    </div>
                    <div className="rdc-tags">
                      <span className="rdc-tag">📍 {selectedRoute.region}</span>
                      <span className="rdc-tag">Tip: {selectedRoute.type}</span>
                      <span className="rdc-tag">Dificultate: {selectedRoute.difficulty}</span>
                      <span className="rdc-tag">Suprafață: {selectedRoute.surface}</span>
                      <span className="rdc-tag">Sezon: {selectedRoute.bestSeason}</span>
                      <span className="rdc-tag">{selectedRoute.isLoop ? 'Circuit' : 'Linear'}</span>
                    </div>
                  </div>

                  <div className="rdc-stats">
                    <div className="rdc-stat">
                      <p className="rdc-stat-label">Distanță</p>
                      <p className="rdc-stat-value">{selectedRoute.distance} km</p>
                    </div>
                    <div className="rdc-stat">
                      <p className="rdc-stat-label">Durată estimată</p>
                      <p className="rdc-stat-value">{selectedRoute.estimatedDuration} min</p>
                    </div>
                    <div className="rdc-stat">
                      <p className="rdc-stat-label">Elevație</p>
                      <p className="rdc-stat-value">{selectedRoute.elevationGain} m</p>
                    </div>
                    <div className="rdc-stat">
                      <p className="rdc-stat-label">Punct Start</p>
                      <p className="rdc-stat-value">{selectedRoute.startPoint.lat.toFixed(4)}, {selectedRoute.startPoint.lng.toFixed(4)}</p>
                    </div>
                    <div className="rdc-stat">
                      <p className="rdc-stat-label">Punct Finish</p>
                      <p className="rdc-stat-value">{selectedRoute.endPoint.lat.toFixed(4)}, {selectedRoute.endPoint.lng.toFixed(4)}</p>
                    </div>
                  </div>

                  <div className="rdc-highlights">
                    <p className="rdc-highlights-title">Repere de pe traseu</p>
                    <div className="rdc-highlights-grid">
                      {selectedRoute.highlights.map((h) => (
                          <span key={h} className="rdc-chip">{h}</span>
                      ))}
                    </div>
                  </div>
                </>
            ) : (
                <div className="rdc-empty">
                  <div className="rdc-empty-icon">🗺️</div>
                  <p className="rdc-empty-title">Selectează un traseu din listă sau de pe hartă</p>
                  <p className="rdc-empty-sub">Vezi detaliile, reperele și adaugă-l ca țintă în Dashboard.</p>
                </div>
            )}\n        </Box>

          {/* Toast */}
          <Box sx={routesToastSx(toast.visible)}>
            <span style={{ fontSize: '1.1rem' }}>{toast.icon}</span>
            <span>{toast.msg}</span>
          </Box>

          {/* Buton Home rapid */}
          <Box component={Link} to={ROUTES.HOME} sx={routesHomeBtnSx} aria-label="Înapoi la Home">
            🏠
          </Box>
        </Box>
        <Footer />
      </Box>
  );
};

export default RoutesPage;
