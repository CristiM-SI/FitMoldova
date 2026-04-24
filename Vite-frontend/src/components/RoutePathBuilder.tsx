import React, { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { RouteCoord } from '../types/Route';

/* ── Haversine ────────────────────────────────────────────────────────────── */
function haversineKm(a: RouteCoord, b: RouteCoord): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(s));
}

export function calcDistance(path: RouteCoord[]): number {
  let total = 0;
  for (let i = 1; i < path.length; i++) total += haversineKm(path[i - 1], path[i]);
  return Math.round(total * 10) / 10;
}

/* ── OSM tile style ─────────────────────────────────────────────────────── */
const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

const SOURCE_ID = 'route-builder-path';
const LAYER_ID  = 'route-builder-line';

interface RoutePathBuilderProps {
  path: RouteCoord[];
  onChange: (path: RouteCoord[]) => void;
}

const RoutePathBuilder: React.FC<RoutePathBuilderProps> = ({ path, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<maplibregl.Map | null>(null);
  const markersRef   = useRef<maplibregl.Marker[]>([]);
  /* Keep latest path accessible in map event handler without re-binding */
  const pathRef      = useRef<RouteCoord[]>(path);
  pathRef.current    = path;
  const onChangeRef  = useRef(onChange);
  onChangeRef.current = onChange;

  /* ── 1. Init map once ──────────────────────────────────────────────────── */
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: [28.6, 47.2],
      zoom: 7,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      /* GeoJSON source for the polyline */
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
      });
      map.addLayer({
        id: LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#1a6fff', 'line-width': 4 },
      });

      /* Change cursor to crosshair over the map */
      map.getCanvas().style.cursor = 'crosshair';

      /* Click → add point */
      map.on('click', (e) => {
        const newPoint: RouteCoord = {
          lat: Math.round(e.lngLat.lat * 1e6) / 1e6,
          lng: Math.round(e.lngLat.lng * 1e6) / 1e6,
        };
        onChangeRef.current([...pathRef.current, newPoint]);
      });
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 2. Sync markers & polyline whenever path changes ─────────────────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    /* Remove old markers */
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    /* Update polyline */
    const src = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    src?.setData({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: path.map((p) => [p.lng, p.lat]) },
    });

    /* Add numbered markers */
    path.forEach((point, idx) => {
      const isFirst = idx === 0;
      const isLast  = idx === path.length - 1 && path.length > 1;

      const el = document.createElement('div');
      el.style.cssText = [
        'width:22px', 'height:22px', 'border-radius:50%',
        `background:${isFirst ? '#00b894' : isLast ? '#e74c3c' : '#1a6fff'}`,
        'border:2px solid #fff',
        'box-shadow:0 1px 4px rgba(0,0,0,.35)',
        'display:flex', 'align-items:center', 'justify-content:center',
        'color:#fff', 'font-size:10px', 'font-weight:700',
        'cursor:default',
      ].join(';');
      el.textContent = isFirst ? 'S' : isLast ? 'E' : String(idx + 1);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [path]);

  /* ── Handlers ──────────────────────────────────────────────────────────── */
  const handleUndo = useCallback(() => {
    if (pathRef.current.length === 0) return;
    onChangeRef.current(pathRef.current.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    onChangeRef.current([]);
  }, []);

  const dist = calcDistance(path);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        background: '#f5f5f5', borderRadius: 8, padding: '6px 10px',
        fontSize: 13,
      }}>
        <span style={{ color: '#555' }}>
          🖱️ Click pe hartă pentru a adăuga puncte
        </span>
        <span style={{ marginLeft: 'auto', color: '#1a6fff', fontWeight: 600 }}>
          {path.length} puncte · {dist} km
        </span>
        <button
          type="button"
          onClick={handleUndo}
          disabled={path.length === 0}
          style={{
            padding: '3px 10px', borderRadius: 6, border: '1px solid #d9d9d9',
            background: '#fff', cursor: path.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: 12,
          }}
        >
          ↩ Undo
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={path.length === 0}
          style={{
            padding: '3px 10px', borderRadius: 6, border: '1px solid #ffa39e',
            background: '#fff5f5', color: '#cf1322',
            cursor: path.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: 12,
          }}
        >
          🗑 Golește
        </button>
      </div>

      {/* Map */}
      <div
        ref={containerRef}
        style={{
          height: 380,
          width: '100%',
          borderRadius: 10,
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
        }}
      />

      {/* Legend */}
      {path.length > 0 && (
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#888' }}>
          <span><span style={{ color: '#00b894', fontWeight: 700 }}>S</span> — Start</span>
          <span><span style={{ color: '#e74c3c', fontWeight: 700 }}>E</span> — Finish</span>
          <span style={{ marginLeft: 'auto' }}>
            Start: {path[0].lat.toFixed(5)}, {path[0].lng.toFixed(5)}
            {path.length > 1 && ` · Finish: ${path[path.length - 1].lat.toFixed(5)}, ${path[path.length - 1].lng.toFixed(5)}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default RoutePathBuilder;
