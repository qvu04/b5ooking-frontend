// src/app/components/Map/MapByCity.tsx
'use client';

import { useEffect, useState } from 'react';
import { geocodeAddress } from '@/lib/geocode';
import MapView from '@/app/components/Map/MapViewWrapper'; // giống như HotelDetailClient đang dùng

type Props = {
    city: string;
};

export default function MapByCity({ city }: Props) {
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (city) {
            geocodeAddress(city).then((res) => {
                if (res) setCoords(res);
            });
        }
    }, [city]);

    if (!coords) return <p className="text-gray-500">Đang tải bản đồ...</p>;

    return (
        <div className="w-full h-full">
            <MapView lat={coords.lat} lng={coords.lng} name={city} />
        </div>
    )
}