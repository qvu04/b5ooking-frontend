"use client";

import { useEffect, useState } from "react";
import { getBookedRoom } from "@/app/api/bookingService";
import { BookedRoom } from "@/app/types/roomType";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translate";
import Image from 'next/image';

export default function Room() {
    const [rooms, setRooms] = useState<BookedRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { i18n, t } = useTranslation();
    const fetchBookedRoom = async () => {
        try {
            const res = await getBookedRoom();
            let bookings = res.data.data.bookings;

            if (i18n.language !== "vi") {
                bookings = await Promise.all(
                    bookings.map(async (booking: any) => {
                        const roomName = await translateText(booking.room.name, "vi", i18n.language);
                        const roomDesc = await translateText(booking.room.description, "vi", i18n.language);
                        const hotelName = await translateText(booking.room.hotel.name, "vi", i18n.language);
                        const hotelAddr = await translateText(booking.room.hotel.address, "vi", i18n.language);

                        return {
                            ...booking,
                            room: {
                                ...booking.room,
                                name: roomName,
                                description: roomDesc,
                                hotel: {
                                    ...booking.room.hotel,
                                    name: hotelName,
                                    address: hotelAddr,
                                },
                            },
                        };
                    })
                );
            }

            setRooms(bookings);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phòng đã đặt:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookedRoom();
    }, [i18n.language]);
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold mb-6 text-center dark:text-[#fffffe]">{t("room.text_1")}</h2>

            {loading ? (
                <p className="text-center text-gray-500 dark:text-[#fffffe]">{t("room.text_2")}</p>
            ) : rooms.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-[#fffffe]">{t("room.text_3")}</p>
            ) : (
                <div className="space-y-6">
                    {rooms.map((booking) => (
                        <div
                            key={booking.roomId}
                            className="border border-gray-200 dark:bg-[#242629] rounded-xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 bg-white"
                        >
                            {/* Ảnh phòng */}
                            <Image
                                src={booking.room.image ?? ""}
                                alt={booking.room.name}
                                width={500}
                                height={300}
                                className="w-full h-48 object-cover rounded-lg col-span-1"
                            />

                            {/* Thông tin phòng */}
                            <div className="col-span-2 space-y-2">
                                <div className="flex flex-wrap justify-between dark:text-[#94a1b2] items-center">
                                    <h3 className="text-xl font-semibold dark:text-[#94a1b2]">{booking.room.name}</h3>
                                    <span className="px-3 mt-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                        {t(`booking_status.${booking.status}`)}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2 dark:text-[#94a1b2]">{booking.room.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm dark:text-[#94a1b2] text-gray-700">
                                    <p><strong>{t("room.text_4")}</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                                    <p><strong>{t("room.text_5")}</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
                                    <p><strong>{t("room.text_6")}</strong> {booking.nights}</p>
                                    <p><strong>{t("room.text_7")}</strong> {booking.guests}</p>
                                    <p><strong>{t("room.text_8")}</strong> {booking.pricePerNight.toLocaleString()}₫</p>
                                    <p>
                                        <strong>{t("room.text_9")}</strong>{" "}
                                        <span className="text-red-600 font-semibold">
                                            {booking.totalPrice.toLocaleString()}₫
                                        </span>
                                    </p>
                                </div>

                                {/* Thông tin khách sạn */}
                                <div className="flex items-start gap-3 mt-3 border-t pt-3">
                                    <Image
                                        src={booking.room.hotel.image ?? ""}
                                        alt={booking.room.hotel.name}
                                        width={500}
                                        height={300}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="text-sm text-gray-700 dark:text-[#94a1b2]">
                                        <p className="font-medium">{booking.room.hotel.name}</p>
                                        <p>{booking.room.hotel.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
