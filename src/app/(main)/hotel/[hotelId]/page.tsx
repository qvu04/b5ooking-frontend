"use client";
import { getHotelsbyHotelId } from '@/app/api/hotelService';
import { Hotels } from '@/app/types/hotelTypes';
import HotelDetailClient from './HotelDetail';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { translateText } from "@/lib/translate";

export default function HotelDetailPage() {
    const { hotelId } = useParams();
    const { i18n } = useTranslation();
    const [hotel, setHotel] = useState<Hotels | null>(null);
    const [mounted, setMounted] = useState(false);

    const fetchHotel = async () => {
        try {
            const res = await getHotelsbyHotelId(Number(hotelId));
            let hotelData: Hotels = res.data.data;

            if (i18n.language !== "vi") {
                const name = await translateText(hotelData.name, "vi", i18n.language);
                const description = await translateText(hotelData.description, "vi", i18n.language);
                const address = await translateText(hotelData.address, "vi", i18n.language);

                const amenities = await Promise.all(
                    hotelData.amenities.map(async (item) => {
                        const translatedName = await translateText(item.amenity.name, "vi", i18n.language);
                        return { ...item, amenity: { ...item.amenity, name: translatedName } };
                    })
                );

                hotelData = { ...hotelData, name, description, address, amenities };
            }

            setHotel(hotelData);
        } catch (error) {
            console.error("Error fetching hotel:", error);
        }
    };

    useEffect(() => {
        fetchHotel();
    }, [hotelId, i18n.language]);

    useEffect(() => {
        setMounted(true);
    }, []);


    if (!mounted) return null;
    if (!hotel) {
        return <div className="p-6 text-xl text-red-500">Looking for hotel! Please wait a few minutes...</div>;
    }
    return <HotelDetailClient hotel={hotel} onRefetch={fetchHotel} />;
}
