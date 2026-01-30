"use client";
import React, { useEffect, useState } from "react";
import { fetchHotelByLocation } from "@/app/api/hotelService";
import { Locations } from "@/app/types/locationTypes";
import { Hotels } from "@/app/types/hotelTypes";
import { Carousel, Rate } from "antd";
import { useTranslation } from "react-i18next";
import { fetchTranslateLocation } from "@/app/api/locationService";
import Link from "next/link";
import Image from "next/image";
const PopularHotel = () => {
    const [locations, setLocations] = useState<Locations[] | null>(null);
    const [hotels, setHotels] = useState<Hotels[] | null>(null);
    const [activeLocationId, setActiveLocationId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const { i18n, t } = useTranslation();

    useEffect(() => {
        const fetch = async () => {
            const translateLocs = await fetchTranslateLocation(i18n.language);
            setLocations(translateLocs);
            if (translateLocs.length > 0) setActiveLocationId(translateLocs[0].id);
        }
        fetch();
    }, [i18n.language]);

    useEffect(() => {
        const fetch = async () => {
            if (activeLocationId !== null) {
                const translateHotel = await fetchHotelByLocation(activeLocationId, i18n.language);
                setHotels(translateHotel)
            }
        }
        fetch();
    }, [activeLocationId, i18n.language]);

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;
    return (
        <div className="px-2 md:px-10 py-10 max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 pl-4 md:pl-6 ">
                {t("home.popularHotels")}
            </h2>

            {/* Tabs địa điểm */}
            <div className="flex flex-wrap gap-3 mb-6 items-center">
                {locations?.map((location) => (
                    <button
                        key={location.id}
                        onClick={() => setActiveLocationId(location.id)}
                        className={`px-4 py-2 rounded-full border transition cursor-pointer 
              ${activeLocationId === location.id
                                ? "bg-[#6246ea] text-[#fffffe]"
                                : "bg-gray-100 text-gray-800 hover:bg-[#e0e0ff] hover:text-[#6246ea] hover:border-[#6246ea]"
                            }`}
                    >
                        {location.city}
                    </button>
                ))}
                <div className="ml-auto">
                    <button className="text-2xl font-bold text-black hover:text-[#6246ea] transition dark:text-[#fffffe]">
                        {t("home.seeMoreHotels")} &gt;
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <Carousel
                dots={false}
                infinite={false}
                swipeToSlide
                arrows
                slidesToShow={3}
                responsive={[
                    { breakpoint: 1024, settings: { slidesToShow: 2 } },
                    { breakpoint: 640, settings: { slidesToShow: 1 } },
                ]}
            >
                {hotels?.map((hotel) => (
                    <Link href={`/hotel/${hotel.id}`} key={hotel.id} className="px-2">
                        <div className="border rounded-xl text-black hover:text-gray-500 transition overflow-hidden flex flex-col h-full dark:bg-[#16161a] dark:border dark:border-gray-300">
                            <Image
                                src={hotel.image}
                                alt={hotel.name}
                                width={500}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 flex flex-col justify-between flex-1">
                                <div>
                                    <h3 className="text-lg dark:text-[#fffffe] font-semibold mb-1 line-clamp-2 min-h-[48px]">
                                        {hotel.name}
                                    </h3>
                                    <p className="text-sm dark:text-[#94a1b2] mb-2 line-clamp-2 min-h-[40px]">
                                        {hotel.address}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Rate
                                        disabled
                                        allowHalf
                                        value={hotel.averageRating || hotel.defaultRating}
                                    />
                                    <span className="text-sm text-[#94a1b2]">
                                        ({hotel.averageRating || hotel.defaultRating})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </Carousel>
        </div>
    );
};

export default PopularHotel;