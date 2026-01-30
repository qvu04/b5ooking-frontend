"use client";
import { useEffect, useState } from 'react';
import { use } from 'react';
import { getAllLocation } from '@/app/api/locationService';
import { getHotelsByLocation } from '@/app/api/hotelService';
import { Hotels } from '@/app/types/hotelTypes';
import { Locations } from '@/app/types/locationTypes';
import { toSlug } from '@/utils/slug';
import MapByCity from '@/app/components/Map/MapByCity';
import HotelListClient from './HotelList';
import { useTranslation } from 'react-i18next';
import { translateText } from "@/lib/translate";

type Props = {
    params: Promise<{ slug: string }>
};

export default function LocationPage({ params }: Props) {
    const { slug } = use(params);
    const { i18n, t } = useTranslation();
    const [hotels, setHotels] = useState<Hotels[] | null>(null);
    const [matchedCity, setMatchedCity] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await getAllLocation();
                const locations: Locations[] = res.data.data.locations;
                const matchedLocation = locations.find((loc) => toSlug(loc.city) === slug);
                console.log("Slug:", slug);
                console.log("All cities slugs:", locations.map((loc) => ({ city: loc.city, slug: toSlug(loc.city) })));

                if (!matchedLocation) {
                    setHotels(null);
                    return;
                }

                setMatchedCity(matchedLocation.city);

                const hotelRes = await getHotelsByLocation(matchedLocation.id);
                let hotels: Hotels[] = hotelRes.data.data.hotels;

                if (i18n.language !== 'vi') {
                    hotels = await Promise.all(
                        hotels.map(async (hotel) => {
                            const name = await translateText(hotel.name, "vi", i18n.language);
                            const description = await translateText(hotel.description, "vi", i18n.language);
                            const address = await translateText(hotel.address, "vi", i18n.language);
                            return { ...hotel, name, description, address };
                        })
                    );
                }

                setHotels(hotels);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };

        fetchHotels();
    }, [slug, i18n.language]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!hotels) {
        return <div className="p-6 text-xl text-red-500">Looking for location! Please wait a few minutes...</div>;
    }

    return (
        <div>
            <div className="text-center text-2xl font-bold mt-6">
                {t("locationId.title_1")} {matchedCity} - {t("locationId.title_2")} {hotels.length} {t("locationId.title_3")}
            </div>

            <div className="flex max-w-[2000px] mx-auto px-4 relative mt-6">
                <HotelListClient hotels={hotels} />

                <div className="hidden lg:block w-full lg:w-[30%] sticky top-20 h-[calc(100vh-100px)]">
                    <div className="rounded-2xl overflow-hidden shadow-lg h-full">
                        {matchedCity && <MapByCity city={matchedCity} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
