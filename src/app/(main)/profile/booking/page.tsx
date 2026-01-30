"use client";

import { useEffect, useState } from "react";
import { deleteBookingRoom, getBookingByStatus } from "@/app/api/bookingService";
import { BookingItem, BookingStatusEnum } from "@/app/types/bookingType";
import { useTranslation } from 'react-i18next';
import { translateText } from '@/lib/translate';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { CheckDesktop, CheckMobilePhone, CheckTablet } from "@/app/components/HOC/ResponsiveCustom";
import { paymentOnlineService } from '@/app/api/payment-onlineService';
import Image from 'next/image';

export default function Booking() {
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [filteredStatus, setFilteredStatus] = useState<BookingStatusEnum | "ALL">("ALL");
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { i18n, t } = useTranslation();

    const fetchBookings = async () => {
        try {
            const [resPending, resConfirmed, resCanceled] = await Promise.all([
                getBookingByStatus(BookingStatusEnum.PENDING),
                getBookingByStatus(BookingStatusEnum.CONFIRMED),
                getBookingByStatus(BookingStatusEnum.CANCELED),
            ]);

            let allBookings = [
                ...resPending.data.data.bookings,
                ...resConfirmed.data.data.bookings,
                ...resCanceled.data.data.bookings,
            ];
            if (i18n.language !== "vi") {
                allBookings = await Promise.all(
                    allBookings.map(async (item) => {
                        const translatedHotelName = await translateText(item.room.hotel.name, "vi", i18n.language);
                        const translatedRoomName = await translateText(item.room.name, "vi", i18n.language);

                        return {
                            ...item,
                            room: {
                                ...item.room,
                                name: translatedRoomName,
                                hotel: {
                                    ...item.room.hotel,
                                    name: translatedHotelName,
                                },
                            },
                        };
                    })
                );
            }

            setBookings(allBookings);
        } catch (err) {
            console.error("Lỗi lấy booking:", err);
        }
    };

    const handleOpenCancelDialog = (id: number) => {
        setSelectedBookingId(id);
        setIsCancelDialogOpen(true);
    };
    const handleOpenPaymentDialog = (id: number) => {
        setSelectedBookingId(id);
        setIsPaymentDialogOpen(true);
    };
    const confirmCancelBooking = async () => {
        if (!selectedBookingId) return;

        try {
            await deleteBookingRoom(selectedBookingId);
            setBookings(prev => prev.filter(b => b.id !== selectedBookingId));
            setIsCancelDialogOpen(false);
            toast.success("Huỷ đặt phòng thành công.");
            fetchBookings();
        } catch (err) {
            console.error("Lỗi khi huỷ đặt phòng:", err);
            toast.error("Huỷ đặt phòng thất bại.");
        }
    };
    const confirmPaymentBooking = async () => {
        if (!selectedBookingId) return;

        try {
            const res = await paymentOnlineService(selectedBookingId, i18n.language);
            console.log("res:", res);
            const { url } = res.data.data;
            window.location.href = url;
        } catch (error) {
            console.log("✌️error --->", error);
            toast.error("Thanh toán thất bại.");
        }
    };

    const filteredBookings = filteredStatus === "ALL"
        ? bookings
        : bookings.filter(b => b.status === filteredStatus);
    useEffect(() => {
        fetchBookings();
    }, [i18n.language]);
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    const getStatusClasses = (status: BookingStatusEnum) => {
        switch (status) {
            case BookingStatusEnum.PENDING:
                return "bg-[#6246ea] text-white border-[#6246ea]";
            case BookingStatusEnum.CONFIRMED:
                return "bg-green-500 text-white border-green-600";
            case BookingStatusEnum.CANCELED:
                return "bg-red-500 text-white border-red-600";
            default:
                return "bg-gray-200 text-gray-700 border-gray-300";
        }
    };

    const renderBookingList = () => (
        <section className="mt-6">
            {filteredBookings.length === 0 ? (
                <p className="text-gray-600 dark:text-[#fffffe] italic">{t("booking.text_1")}</p>
            ) : (
                <ul className="space-y-6">
                    {filteredBookings.map((item) => (
                        <li key={item.id} className="p-5 border dark:bg-[#242629] rounded-xl shadow-md flex gap-4">
                            <Image
                                src={item.room.image ?? ""}
                                alt={item.room.name}
                                width={500}
                                height={300}
                                className="w-36 h-28 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <p className="text-xl font-bold text-[#333] dark:text-[#94a1b2]">{item.room.hotel.name}</p>
                                <p className="text-lg font-semibold text-[#6246ea]">{item.room.name}</p>
                                <div className="mt-1 text-sm text-gray-600 dark:text-[#94a1b2]">
                                    <p>{t("booking.text_2")} {new Date(item.checkIn).toLocaleDateString()} - {new Date(item.checkOut).toLocaleDateString()}</p>
                                    <p>{t("booking.text_3")} {item.guests} | {t("booking.text_4")} {item.nights}</p>
                                </div>
                                <p className="mt-2 text-base font-medium text-[#111] dark:text-[#94a1b2]">
                                    {t("booking.text_16")}: {" "}
                                    <span className="text-[#f43f5e] font-bold">
                                        {item.totalPrice.toLocaleString()}₫
                                    </span>
                                </p>
                                <span
                                    className={`inline-block mt-2 text-sm px-3 py-1 rounded-full border font-semibold 
  ${getStatusClasses(item.status)}`}
                                >
                                    {t("booking.text_5")} {t(`booking_status.${item.status}`)}
                                </span>


                                {/* 👇 Thêm phần này nếu trạng thái là PENDING */}
                                {item.status === BookingStatusEnum.PENDING && (
                                    <div className="mt-4 flex gap-3">
                                        <button
                                            onClick={() => handleOpenPaymentDialog(item.id)}
                                            className="px-4 py-2 cursor-pointer rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition"
                                        >
                                            {t("booking.text_6")}
                                        </button>
                                        <button
                                            onClick={() => handleOpenCancelDialog(item.id)}
                                            className="px-4 py-2 cursor-pointer rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
                                        >
                                            {t("booking.text_7")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
    const renderFilterButtons = () => (
        <div className="flex flex-wrap gap-3 mb-6">
            {[
                { label: t("booking_status.ALL"), value: "ALL" },
                { label: t("booking_status.PENDING"), value: BookingStatusEnum.PENDING },
                { label: t("booking_status.CONFIRMED"), value: BookingStatusEnum.CONFIRMED },
                { label: t("booking_status.CANCELED"), value: BookingStatusEnum.CANCELED }
            ].map(({ label, value }) => (
                <button
                    key={value}
                    onClick={() => setFilteredStatus(value as BookingStatusEnum | "ALL")}
                    className={`px-4 py-2 shadow-sm rounded-full text-sm font-medium transition ${filteredStatus === value
                        ? "bg-[#6246ea] text-white"
                        : "bg-white text-[#6246ea] border border-[#6246ea]"
                        } hover:bg-[#6246ea] hover:text-white`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
    return (
        <>
            <CheckDesktop>
                <div className="max-w-5xl mx-auto mt-6 px-4">
                    <h1 className="text-3xl font-bold mb-6 text-[#222] dark:text-[#fffffe]">{t("booking.text_8")}</h1>
                    {renderFilterButtons()}
                    {renderBookingList()}
                    <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("booking.text_9")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t("booking.text_10")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t("booking.text_14")}</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmCancelBooking}>
                                    {t("booking.text_11")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("booking.text_12")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t("booking.text_13")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t("booking.text_14")}</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmPaymentBooking}>
                                    {t("booking.text_15")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CheckDesktop>
            <CheckTablet>
                <div className="max-w-5xl mx-auto mt-6 px-4">
                    <h1 className="text-3xl font-bold mb-6 text-[#222] dark:text-[#fffffe]">{t("booking.text_8")}</h1>
                    {renderFilterButtons()}
                    {renderBookingList()}
                    <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("booking.text_9")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t("booking.text_10")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t("booking.text_14")}</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmCancelBooking}>
                                    {t("booking.text_11")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("booking.text_12")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t("booking.text_13")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t("booking.text_14")}</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmPaymentBooking}>
                                    {t("booking.text_15")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CheckTablet>
            <CheckMobilePhone>
                <div className="mt-4 px-4">
                    <h1 className="text-2xl font-bold mb-4 text-[#222] dark:text-[#fffffe] text-center">
                        {t("booking.text_8")}
                    </h1>
                    {renderFilterButtons()}
                    {filteredBookings.length === 0 ? (
                        <p className="text-gray-600 italic text-center">
                            {t("booking.text_1")}
                        </p>
                    ) : (
                        <ul className="space-y-4">
                            {filteredBookings.map((item) => (
                                <li
                                    key={item.id}
                                    className="p-4 border dark:bg-[#242629] rounded-lg shadow-sm flex flex-col"
                                >
                                    <Image
                                        src={item.room.image ?? ""}
                                        alt={item.room.name}
                                        width={500}
                                        height={300}
                                        className="w-full h-40 object-cover rounded-md mb-3"
                                    />
                                    <p className="text-lg font-bold text-[#333] dark:text-[#94a1b2]">{item.room.hotel.name}</p>
                                    <p className="text-base font-semibold text-[#6246ea]">{item.room.name}</p>
                                    <div className="mt-1 text-sm text-gray-600 dark:text-[#94a1b2]">
                                        <p>
                                            {t("booking.text_2")} {new Date(item.checkIn).toLocaleDateString()} -{" "}
                                            {new Date(item.checkOut).toLocaleDateString()}
                                        </p>
                                        <p>
                                            {t("booking.text_3")} {item.guests} | {t("booking.text_4")} {item.nights}
                                        </p>
                                    </div>
                                    <p className="mt-2 text-base font-medium text-[#111] dark:text-[#94a1b2]">
                                        {t("booking.text_16")}: {" "}
                                        <span className="text-[#f43f5e] font-bold">
                                            {item.totalPrice.toLocaleString()}₫
                                        </span>
                                    </p>
                                    <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-gray-100 border text-[#6246ea] font-semibold">
                                        {t("booking.text_5")} {t(`booking_status.${item.status}`)}
                                    </span>

                                    {item.status === BookingStatusEnum.PENDING && (
                                        <div className="mt-3 grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleOpenPaymentDialog(item.id)}
                                                className="py-2 text-xs rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition"
                                            >
                                                {t("booking.text_6")}
                                            </button>
                                            <button
                                                onClick={() => handleOpenCancelDialog(item.id)}
                                                className="py-2 text-xs rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition"
                                            >
                                                {t("booking.text_7")}
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Cancel Dialog */}
                    <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("booking.text_9")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t("booking.text_10")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t("booking.text_14")}</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmCancelBooking}>
                                    {t("booking.text_11")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Payment Dialog */}
                    <AlertDialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("booking.text_12")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t("booking.text_13")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t("booking.text_14")}</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmPaymentBooking}>
                                    {t("booking.text_15")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CheckMobilePhone>

        </>
    );
}
