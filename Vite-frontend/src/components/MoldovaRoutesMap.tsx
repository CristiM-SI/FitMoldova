import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Traseu, RouteType } from '../types/Route';

/* ---- Culori per tip de traseu ---- */
const TYPE_COLORS: Record<RouteType, string> = {
  alergare: '#FF6B00',
  ciclism:  '#0066FF',
  drumeție: '#00D084',
  trail:    '#FF4466',
};

/* ---- OSM tile style (inline, no external style URL needed) ---- */
const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

interface MoldovaRoutesMapProps {
  trasee: Traseu[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const MoldovaRoutesMap: React.FC<MoldovaRoutesMapProps> = ({ trasee, selectedId, onSelect }) => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<maplibregl.Map | null>(null);
  const markersRef    = useRef<maplibregl.Marker[]>([]);
  const addedIdsRef   = useRef<number[]>([]);
  // Keep callbacks fresh without re-running effects
  const onSelectRef   = useRef(onSelect);
  onSelectRef.current = onSelect;
  const selectedIdRef   = useRef(selectedId);
  selectedIdRef.current = selectedId;

  /* ── 1. Initialise map once ── */
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: [28.6, 47.2],
      zoom: 7,
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current  = null;
      addedIdsRef.current = [];
      markersRef.current  = [];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 2. Sync routes whenever trasee changes ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const syncRoutes = () => {
      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Remove old layers + sources
      addedIdsRef.current.forEach((id) => {
        if (map.getLayer(`route-${id}`)) map.removeLayer(`route-${id}`);
        if (map.getSource(`route-${id}`)) map.removeSource(`route-${id}`);
      });
      addedIdsRef.current = [];

      trasee.forEach((traseu) => {
        const color      = TYPE_COLORS[traseu.type];
        const isSelected = traseu.id === selectedIdRef.current;

        /* GeoJSON source + line layer */
        map.addSource(`route-${traseu.id}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: traseu.path.map((p) => [p.lng, p.lat]),
            },
          },
        });

        map.addLayer({
          id: `route-${traseu.id}`,
          type: 'line',
          source: `route-${traseu.id}`,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color':     color,
            'line-width':     isSelected ? 7 : 4,
            'line-opacity':   isSelected ? 1 : 0.72,
            'line-dasharray': isSelected ? [1] : [2, 3],
          },
        });

        /* Pointer cursor on hover */
        map.on('mouseenter', `route-${traseu.id}`, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', `route-${traseu.id}`, () => { map.getCanvas().style.cursor = ''; });
        map.on('click',      `route-${traseu.id}`, () => onSelectRef.current(traseu.id));

        /* Start-point marker */
        const size = isSelected ? 14 : 10;
        const el   = document.createElement('div');
        el.style.cssText = [
          `width:${size}px`, `height:${size}px`, 'border-radius:50%',
          `background:${color}`, 'border:2.5px solid #fff',
          `box-shadow:0 0 0 ${isSelected ? 3 : 2}px ${color}55`,
          'cursor:pointer', 'transition:all .2s',
        ].join(';');
        el.addEventListener('click', () => onSelectRef.current(traseu.id));

        /* Popup shown when selected */
        const popup = new maplibregl.Popup({
          className: 'route-popup',
          offset: [0, -(size / 2 + 4)],
          closeButton: false,
          closeOnClick: false,
        }).setHTML(`
          <div class="route-popup__title">${traseu.icon} ${traseu.name}</div>
          <div class="route-popup__meta">
            <span>📏 ${traseu.distance} km</span>
            <span>⏱️ ${traseu.estimatedDuration} min</span>
            <span>⬆️ ${traseu.elevationGain} m</span>
          </div>
          <div class="route-popup__tags">
            <span class="tag">${traseu.region}</span>
            <span class="tag">Dificultate: ${traseu.difficulty}</span>
            <span class="tag">Tip: ${traseu.type}</span>
          </div>
          <p class="route-popup__desc">${traseu.description}</p>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([traseu.startPoint.lng, traseu.startPoint.lat])
          .setPopup(popup)
          .addTo(map);

        if (isSelected) marker.togglePopup();

        addedIdsRef.current.push(traseu.id);
        markersRef.current.push(marker);
      });
    };

    if (map.isStyleLoaded()) {
      syncRoutes();
    } else {
      map.once('load', syncRoutes);
    }
  }, [trasee]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 3. Update visual selection (line width / opacity / popup) ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    trasee.forEach((traseu, idx) => {
      if (!map.getLayer(`route-${traseu.id}`)) return;
      const isSelected = traseu.id === selectedId;
      map.setPaintProperty(`route-${traseu.id}`, 'line-width',     isSelected ? 7 : 4);
      map.setPaintProperty(`route-${traseu.id}`, 'line-opacity',   isSelected ? 1 : 0.72);
      map.setPaintProperty(`route-${traseu.id}`, 'line-dasharray', isSelected ? [1] : [2, 3]);

      // Open popup only for selected marker, close others
      const marker = markersRef.current[idx];
      if (!marker) return;
      const open = marker.getPopup()?.isOpen() ?? false;
      if (isSelected && !open) marker.togglePopup();
      if (!isSelected && open)  marker.togglePopup();
    });
  }, [selectedId, trasee]);

  /* ── 4. Fly to selected route bounds ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;

    const route = trasee.find((t) => t.id === selectedId);
    if (!route || route.path.length === 0) return;

    const bounds = route.path.reduce(
      (b, p) => b.extend([p.lng, p.lat] as [number, number]),
      new maplibregl.LngLatBounds(
        [route.path[0].lng, route.path[0].lat],
        [route.path[0].lng, route.path[0].lat],
      ),
    );
    map.fitBounds(bounds, { padding: 48, maxZoom: 12, duration: 800 });
  }, [selectedId, trasee]);

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', width: '100%', minHeight: '500px', borderRadius: '16px', overflow: 'hidden' }}
    />
  );
};

export default MoldovaRoutesMap;
