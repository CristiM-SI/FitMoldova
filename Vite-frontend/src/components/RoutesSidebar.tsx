import React from 'react';
import type { Traseu, RouteType, RouteDifficulty } from '../types/Route';

const TYPE_LABELS: Record<RouteType, string> = {
  alergare: '🏃 Alergare',
  ciclism:  '🚴 Ciclism',
  drumeție: '🌲 Drumeție',
  trail:    '🏔️ Trail',
};

const TYPE_COLORS: Record<RouteType, string> = {
  alergare: '#FF6B00',
  ciclism:  '#0066FF',
  drumeție: '#00D084',
  trail:    '#FF4466',
};

const DIFF_COLORS: Record<RouteDifficulty, string> = {
  'Ușor':   '#00D084',
  'Mediu':  '#FFB800',
  'Avansat':'#FF4466',
};

const ALL_TYPES: RouteType[] = ['alergare', 'ciclism', 'drumeție', 'trail'];
const ALL_DIFFS: RouteDifficulty[] = ['Ușor', 'Mediu', 'Avansat'];

interface RoutesSidebarProps {
  trasee: Traseu[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  filterType: RouteType | null;
  setFilterType: (t: RouteType | null) => void;
  filterDiff: RouteDifficulty | null;
  setFilterDiff: (d: RouteDifficulty | null) => void;
}

const RoutesSidebar: React.FC<RoutesSidebarProps> = ({
  trasee, selectedId, onSelect,
  filterType, setFilterType,
  filterDiff, setFilterDiff,
}) => {
  const filtered = trasee.filter((t) => {
    if (filterType && t.type !== filterType) return false;
    if (filterDiff && t.difficulty !== filterDiff) return false;
    return true;
  });

  return (
    <div className="rsb">
      {/* Filtre tip */}
      <div className="rsb-section">
        <p className="rsb-label">Tip activitate</p>
        <div className="rsb-chips">
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              className={`rsb-chip ${filterType === type ? 'rsb-chip--active' : ''}`}
              style={filterType === type ? { borderColor: TYPE_COLORS[type], color: TYPE_COLORS[type] } : {}}
              onClick={() => setFilterType(filterType === type ? null : type)}
            >
              {TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Filtre dificultate */}
      <div className="rsb-section">
        <p className="rsb-label">Dificultate</p>
        <div className="rsb-chips">
          {ALL_DIFFS.map((diff) => (
            <button
              key={diff}
              className={`rsb-chip ${filterDiff === diff ? 'rsb-chip--active' : ''}`}
              style={filterDiff === diff ? { borderColor: DIFF_COLORS[diff], color: DIFF_COLORS[diff] } : {}}
              onClick={() => setFilterDiff(filterDiff === diff ? null : diff)}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Contor */}
      <p className="rsb-count">
        {filtered.length} {filtered.length === 1 ? 'traseu' : 'trasee'}
        {(filterType || filterDiff) && (
          <button className="rsb-reset" onClick={() => { setFilterType(null); setFilterDiff(null); }}>
            Resetează
          </button>
        )}
      </p>

      {/* Lista traseelor */}
      <ul className="rsb-list">
        {filtered.length === 0 && (
          <li className="rsb-empty">Niciun traseu găsit pentru filtrele selectate.</li>
        )}
        {filtered.map((t) => (
          <li
            key={t.id}
            className={`rsb-card ${selectedId === t.id ? 'rsb-card--selected' : ''}`}
            onClick={() => onSelect(t.id)}
            style={selectedId === t.id ? { borderColor: TYPE_COLORS[t.type] } : {}}
          >
            <div className="rsb-card-header">
              <span className="rsb-card-icon" style={{ background: TYPE_COLORS[t.type] + '22', color: TYPE_COLORS[t.type] }}>
                {t.icon}
              </span>
              <div className="rsb-card-info">
                <span className="rsb-card-name">{t.name}</span>
                <span className="rsb-card-region">📍 {t.region}</span>
              </div>
            </div>

            <div className="rsb-card-meta">
              <span className="rsb-meta-item">
                📏 <strong>{t.distance} km</strong>
              </span>
              <span className="rsb-meta-item">
                ⏱️ {t.estimatedDuration} min
              </span>
              <span className="rsb-meta-item">
                ⬆️ {t.elevationGain} m
              </span>
              <span
                className="rsb-diff-badge"
                style={{ background: DIFF_COLORS[t.difficulty] + '22', color: DIFF_COLORS[t.difficulty] }}
              >
                {t.difficulty}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoutesSidebar;
