import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

/* ---- OSM tile style ---- */
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

interface EventMapProps {
  lat: number;
  lng: number;
  name: string;
  location: string;
  city: string;
}

const EventMap: React.FC<EventMapProps> = ({ lat, lng, name, location, city }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<maplibregl.Map | null>(null);
  const markerRef    = useRef<maplibregl.Marker | null>(null);

  /* ── Initialise map once ── */
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: [lng, lat],
      zoom: 15,
    });
    map.scrollZoom.disable();
    mapRef.current = map;

    map.on('load', () => {
      const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div style="font-family:sans-serif;min-width:160px">
            <strong style="display:block;margin-bottom:4px">${name}</strong>
            <span style="font-size:.85rem;color:#555">📍 ${location}, ${city}</span>
          </div>
        `);

      markerRef.current = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current  = null;
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Animate to new location when event changes ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ center: [lng, lat], duration: 500 });
    markerRef.current?.setLngLat([lng, lat]);
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="event-map"
      style={{ height: '260px', width: '100%', borderRadius: '12px', zIndex: 1, overflow: 'hidden' }}
    />
  );
};

export default EventMap;