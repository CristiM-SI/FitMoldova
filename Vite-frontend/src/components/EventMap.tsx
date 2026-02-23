import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icon path pentru Vite/bundlers
const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Componentă helper — resetează view-ul când se schimbă evenimentul
const FlyTo = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 15, { animate: true });
    }, [lat, lng, map]);
    return null;
};

interface EventMapProps {
    lat: number;
    lng: number;
    name: string;
    location: string;
    city: string;
}

const EventMap: React.FC<EventMapProps> = ({ lat, lng, name, location, city }) => {
    return (
        <MapContainer
            center={[lat, lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '260px', width: '100%', borderRadius: '12px', zIndex: 1 }}
            className="event-map"
        >
            <FlyTo lat={lat} lng={lng} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]} icon={markerIcon}>
                <Popup>
                    <div style={{ fontFamily: 'sans-serif', minWidth: '160px' }}>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>{name}</strong>
                        <span style={{ fontSize: '0.85rem', color: '#555' }}>
                            📍 {location}, {city}
                        </span>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default EventMap;
