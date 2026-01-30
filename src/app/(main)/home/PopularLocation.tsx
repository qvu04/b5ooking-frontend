"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import { Locations } from '@/app/types/locationTypes';
import Link from 'next/link';
import { fetchTranslateLocation } from '@/app/api/locationService';
import { toSlug } from '@/utils/slug';
import { useTranslation } from 'react-i18next';
import Image from "next/image";

const PopularLocation = () => {
    const [locations, setLocations] = useState<Locations[] | null>(null);
    const { i18n, t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const translatedLocations = await fetchTranslateLocation(i18n.language);
            setLocations(translatedLocations);
        };
        fetchData();
    }, [i18n.language]);
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
                {t("home.popular_location")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {locations?.map((location) => (
                    <Link
                        key={location.id}
                        href={`/location/${toSlug(location.city)}`}
                        className="relative group rounded-lg overflow-hidden shadow-md border"
                    >
                        <Image
                            src={location.imageLocation ?? ""}
                            alt={location.city ?? ""}
                            width={500}
                            height={300}
                            className="w-full h-48 object-cover transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center gap-2 mb-4">
                                <Image
                                    className="w-5 h-5 object-cover rounded-sm"
                                    width={500}
                                    height={300}
                                    src="/images/icon_co_VN.png"
                                    alt="co_VN"
                                />
                                <h3 className="text-white text-lg font-semibold text-center">
                                    {location.city}
                                </h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PopularLocation