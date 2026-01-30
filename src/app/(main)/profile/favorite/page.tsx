"use client";

import { getFavoriteList, removeFavorite } from "@/app/api/favoriteService";
import { useEffect, useState } from "react";
import { FaHeart, FaStar } from "react-icons/fa";
import { FavoriteItem } from "@/app/types/favoriteType";
import { useTranslation } from "react-i18next";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { translateText } from "@/lib/translate";
import Image from 'next/image';

export default function Favorite() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { i18n, t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const fetchFavoriteList = async () => {
        try {
            const res = await getFavoriteList();
            let favorites = res?.data?.data.favorites || [];

            if (i18n.language !== "vi") {
                favorites = await Promise.all(
                    favorites.map(async (item: any) => {
                        const name = await translateText(item.hotel.name, "vi", i18n.language);
                        const address = await translateText(item.hotel.address, "vi", i18n.language);

                        return {
                            ...item,
                            hotel: {
                                ...item.hotel,
                                name,
                                address,
                            },
                        };
                    })
                );
            }

            setFavorites(favorites);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách yêu thích:", error);
        }
    };

    const handleDeleteFavorite = async () => {
        if (!selectedId) return;
        try {
            await removeFavorite(selectedId);
            toast.success("Đã xoá khỏi danh sách yêu thích");
            fetchFavoriteList();
            setSelectedId(null);
        } catch (err) {
            console.error("Lỗi xoá yêu thích:", err);
            toast.error("Xoá thất bại");
        }
    };

    useEffect(() => {
        fetchFavoriteList();
    }, [i18n.language]);
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6 text-center dark:text-[#fffffe]">
                {t("favorite.text_1")}
            </h1>

            {favorites.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-[#fffffe]">
                    {t("favorite.text_2")}
                </p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {favorites.map((item) => {
                        const hotel = item.hotel;
                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl overflow-hidden dark:bg-[#242629] shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative w-full h-48">
                                    <Image
                                        src={hotel.image ?? ""}
                                        alt={hotel.name}
                                        width={500}
                                        height={300}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button
                                                onClick={() => setSelectedId(item.hotelId)}
                                                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                                            >
                                                <FaHeart className="text-red-500" />
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    {t("favorite.text_3")}
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {t("favorite.text_4")}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>{t("favorite.text_5")}</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeleteFavorite}>
                                                    {t("favorite.text_6")}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <div className="p-4 space-y-1">
                                    <h2 className="text-lg font-semibold truncate dark:text-[#94a1b2]">
                                        {hotel.name}
                                    </h2>
                                    <p className="text-gray-600 dark:text-[#94a1b2] text-sm">{hotel.address}</p>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <FaStar /> {hotel.averageRating ?? 5}/5
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
