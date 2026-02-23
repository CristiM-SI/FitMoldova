import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Traseu, RouteType } from '../types/Route';

/* ---- Culori per tip de traseu ---- */
const TYPE_COLORS: Record<RouteType, string> = {
  alergare: '#FF6B00',
  ciclism:  '#0066FF',
  drumeție: '#00D084',
  trail:    '#FF4466',
};

const TYPE_WEIGHT = 4;
const SELECTED_WEIGHT = 7;

/* ---- Icon cerc colorat pentru punctul de start ---- */
function makeStartIcon(color: string, selected: boolean) {
  const size = selected ? 14 : 10;
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};border:2.5px solid #fff;
      box-shadow:0 0 0 ${selected ? '3px' : '2px'} ${color}55;
      transition:all .2s;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

interface MoldovaRoutesMapProps {
  trasee: Traseu[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const MoldovaRoutesMap: React.FC<MoldovaRoutesMapProps> = ({
  trasee,
  selectedId,
  onSelect,
}) => {
  /* Centrul geografic aproximativ al Moldovei */
  const CENTER: [number, number] = [47.2, 28.6];

  return (
    <MapContainer
      center={CENTER}
      zoom={8}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', minHeight: '500px', borderRadius: '16px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {trasee.map((traseu) => {
        const isSelected = traseu.id === selectedId;
        const color = TYPE_COLORS[traseu.type];
        const positions = traseu.path.map(
          (c) => [c.lat, c.lng] as [number, number]
        );

        return (
          <React.Fragment key={traseu.id}>
            {/* Polyline traseu */}
            <Polyline
              positions={positions}
              pathOptions={{
                color,
                weight: isSelected ? SELECTED_WEIGHT : TYPE_WEIGHT,
                opacity: isSelected ? 1 : 0.72,
              }}
              eventHandlers={{ click: () => onSelect(traseu.id) }}
            >
              <Tooltip sticky direction="top" offset={[0, -4]}>
                <span style={{ fontWeight: 600 }}>{traseu.icon} {traseu.name}</span>
                <br />
                <span style={{ fontSize: '0.82rem', color: '#555' }}>
                  {traseu.distance} km · {traseu.difficulty}
                </span>
              </Tooltip>
            </Polyline>

            {/* Marker start */}
            <Marker
              position={[traseu.startPoint.lat, traseu.startPoint.lng]}
              icon={makeStartIcon(color, isSelected)}
              eventHandlers={{ click: () => onSelect(traseu.id) }}
            />
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};

export default MoldovaRoutesMap;
