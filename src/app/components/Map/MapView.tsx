'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

type Props = {
    lat: number;
    lng: number;
    name: string;
};

L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
});

export default function MapView({ lat, lng, name }: Props) {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setReady(true);
        }, 1000); // 1s delay để test
        return () => clearTimeout(timer);
    }, []);

    if (!ready) return null;
    return (
        <div className="w-full h-full">
            <MapContainer
                center={[lat, lng]}
                zoom={13}
                scrollWheelZoom
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>{name}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
