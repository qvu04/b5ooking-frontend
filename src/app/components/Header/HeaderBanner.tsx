"use client"
import { AutoComplete, InputNumber, Button, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { fetchAllLocation, fetchTranslateAllLocation } from '@/app/api/locationService';
import { Locations } from '@/app/types/locationTypes';
import { toSlug } from '@/utils/slug';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { CheckDesktop, CheckMobilePhone, CheckTablet } from '@/app/components/HOC/ResponsiveCustom';
export default function HeaderBanner() {
    const [location, setLocation] = useState("");
    const [guestCount, setGuestCount] = useState(1);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
    const [options, setOptions] = useState<{ value: string; label: React.ReactNode }[]>([]);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { RangePicker } = DatePicker;
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const loadLocations = async () => {
            const locations = await fetchTranslateAllLocation(i18n.language); // dùng API dịch
            if (!locations) return;

            const formatted = locations.map((loc: Locations) => ({
                value: loc.city, // tên đã dịch
                label: (
                    <div className="flex justify-between items-center">
                        <span>{loc.city}</span>
                        <img
                            src={loc.imageLocation}
                            alt={loc.city}
                            className="w-10 h-6 object-cover rounded-md ml-2"
                        />
                    </div>
                )
            }));

            setOptions(formatted);
        };
        loadLocations();
    }, [i18n.language]); // mỗi khi đổi ngôn ngữ thì load lại

    const handleSearch = async () => {
        if (!location.trim()) {
            toast.error("Vui lòng nhập địa điểm!");
            return;
        }

        const locations = await fetchAllLocation();
        const search = locations.find((loc: Locations) => loc.city === location);

        if (search) {
            // Chuyển trang
            router.push(`/location/${toSlug(search.city)}`);

            // Reset lại form
            setTimeout(() => {
                setLocation("");
                setGuestCount(1); // có thể để về 1 mặc định
                setDateRange(null);
            }, 300); // để reset sau khi router.push hoạt động
        } else {
            toast.error("Không tìm thấy địa điểm bạn đã nhập.");
        }
    };
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null
    return (
        <>
            <CheckDesktop>
                <header className="relative w-full h-[600px] overflow-hidden text-white">
                    <video
                        autoPlay
                        muted
                        loop
                        preload="none"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        src="/videos/header.mp4" />
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <div className="relative z-20 mt-28 px-10 flex flex-col items-start justify-center h-[150px] text-white">
                        <h1 className="text-5xl font-extrabold mb-3">
                            <span className="text-[#6246ea]">B5ooking</span> - {t("home.greeting")}
                        </h1>
                        <p className="text-xl">{t("home.slogan")}</p>
                    </div>

                    <div className="relative z-20 px-10 mt-6">
                        <div className="flex items-center justify-between gap-6 bg-white/20 backdrop-blur-md text-white px-6 py-4 rounded-full w-full max-w-5xl mx-auto shadow-lg">
                            {/* Địa điểm */}
                            <div className="flex flex-col flex-1">
                                <span className="text-sm font-semibold mb-1">{t("home.search_bar_location")}</span>
                                <AutoComplete
                                    value={location}
                                    options={options}
                                    variant="borderless"
                                    placeholder={t("home.search_bar_text")}
                                    className="text-white bg-transparent placeholder-white placeholder:font-semibold"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        borderBottom: "1px solid white",
                                    }}
                                    onChange={(value) => setLocation(value)}
                                />
                            </div>

                            {/* Ngày */}
                            <div className="flex-1 min-w-[150px]">
                                <span className="text-xs md:text-sm font-semibold mb-1 block">{t("home.search_bar_date")}</span>
                                <RangePicker
                                    variant="borderless"
                                    format="DD/MM/YYYY"
                                    value={dateRange || undefined}
                                    onChange={(value) => setDateRange(value)}
                                    className="w-full text-white font-medium"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        borderBottom: "1px solid white",
                                    }}
                                    placeholder={[t("home.search_bar_checkIn"), t("home.search_bar_checkOut")]}
                                />
                            </div>

                            {/* Số khách */}
                            <div className="min-w-[100px]">
                                <span className="text-xs md:text-sm font-semibold mb-1 block">{t("home.search_bar_guest")}</span>
                                <InputNumber
                                    min={1}
                                    max={100}
                                    value={guestCount}
                                    onChange={(value) => setGuestCount(Number(value))}
                                    variant="borderless"
                                    className="w-full text-white font-medium"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        borderBottom: "1px solid white",
                                    }}
                                />
                            </div>

                            {/* Nút tìm kiếm */}
                            <Button
                                onClick={handleSearch}
                                type="default"
                                shape="circle"
                                icon={<SearchOutlined />}
                                className="!bg-[#6246ea] hover:!bg-[#5135c8] !text-white !border-none w-12 h-12 flex items-center justify-center shadow-md"
                            />
                        </div>

                    </div>
                </header>
            </CheckDesktop>
            <CheckTablet>
                <header className="relative w-full h-[600px] overflow-hidden text-white">
                    <video
                        autoPlay
                        muted
                        loop
                        preload="none"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        src="/videos/header.mp4" />
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <div className="relative z-20 mt-28 px-10 flex flex-col items-start justify-center h-[150px] text-white">
                        <h1 className="text-5xl font-extrabold mb-3">
                            <span className="text-[#6246ea]">B5ooking</span> - {t("home.greeting")}
                        </h1>
                        <p className="text-xl">{t("home.slogan")}</p>
                    </div>

                    <div className="relative z-20 px-10 mt-6">
                        <div className="flex items-center justify-between gap-6 bg-white/20 backdrop-blur-md text-white px-6 py-4 rounded-full w-full max-w-5xl mx-auto shadow-lg">
                            {/* Địa điểm */}
                            <div className="flex flex-col flex-1">
                                <span className="text-sm font-semibold mb-1">{t("home.search_bar_location")}</span>
                                <AutoComplete
                                    value={location}
                                    options={options}
                                    variant="borderless"
                                    placeholder={t("home.search_bar_text")}
                                    className="text-white bg-transparent placeholder-white placeholder:font-semibold"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        borderBottom: "1px solid white",
                                    }}
                                    onChange={(value) => setLocation(value)}
                                />
                            </div>

                            {/* Ngày */}
                            <div className="flex-1 min-w-[150px]">
                                <span className="text-xs md:text-sm font-semibold mb-1 block">{t("home.search_bar_date")}</span>
                                <RangePicker
                                    variant="borderless"
                                    format="DD/MM/YYYY"
                                    value={dateRange || undefined}
                                    onChange={(value) => setDateRange(value)}
                                    className="w-full text-white font-medium"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        borderBottom: "1px solid white",
                                    }}
                                    placeholder={[t("home.search_bar_checkIn"), t("home.search_bar_checkOut")]}
                                />
                            </div>

                            {/* Số khách */}
                            <div className="min-w-[100px]">
                                <span className="text-xs md:text-sm font-semibold mb-1 block">{t("home.search_bar_guest")}</span>
                                <InputNumber
                                    min={1}
                                    max={100}
                                    value={guestCount}
                                    onChange={(value) => setGuestCount(Number(value))}
                                    variant="borderless"
                                    className="w-full text-white font-medium"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        borderBottom: "1px solid white",
                                    }}
                                />
                            </div>

                            {/* Nút tìm kiếm */}
                            <Button
                                onClick={handleSearch}
                                type="default"
                                shape="circle"
                                icon={<SearchOutlined />}
                                className="!bg-[#6246ea] hover:!bg-[#5135c8] !text-white !border-none w-12 h-12 flex items-center justify-center shadow-md"
                            />
                        </div>

                    </div>
                </header>
            </CheckTablet>
            <CheckMobilePhone>
                <header className="relative w-full h-[600px] overflow-hidden text-white">
                    <video
                        autoPlay
                        muted
                        loop
                        preload="none"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        src="/videos/header.mp4" />
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <div className="relative z-20 mt-28 px-6 flex flex-col items-start justify-center h-[150px] text-white">
                        <h1 className="text-4xl font-extrabold mb-2">
                            <span className="text-[#6246ea]">B5ooking</span> - {t("home.greeting")}
                        </h1>
                        <p className="text-base">{t("home.slogan")}</p>
                    </div>

                    <div className="relative z-20 px-6 mt-6">
                        <div className="flex flex-col gap-4 bg-white/20 backdrop-blur-md text-white px-4 py-6 rounded-2xl w-full mx-auto shadow-lg">
                            {/* Địa điểm */}
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold mb-1">{t("home.search_bar_location")}</span>
                                <AutoComplete
                                    value={location}
                                    options={options}
                                    variant="borderless"
                                    placeholder={t("home.search_bar_text")}
                                    className="text-white bg-transparent placeholder-white placeholder:font-semibold"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        borderBottom: "1px solid white",
                                    }}
                                    onChange={(value) => setLocation(value)}
                                />
                            </div>

                            {/* Ngày */}
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold mb-1">{t("home.search_bar_date")}</span>
                                <RangePicker
                                    variant="borderless"
                                    format="DD/MM/YYYY"
                                    value={dateRange || undefined}
                                    onChange={(value) => setDateRange(value)}
                                    className="w-full text-white font-medium"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        borderBottom: "1px solid white",
                                    }}
                                    placeholder={[t("home.search_bar_checkIn"), t("home.search_bar_checkOut")]}
                                />
                            </div>

                            {/* Số khách */}
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold mb-1">{t("home.search_bar_guest")}</span>
                                <InputNumber
                                    min={1}
                                    max={100}
                                    value={guestCount}
                                    onChange={(value) => setGuestCount(Number(value))}
                                    variant="borderless"
                                    className="w-full text-white font-medium"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        borderBottom: "1px solid white",
                                    }}
                                />
                            </div>

                            {/* Nút tìm kiếm */}
                            <div className="mt-2">
                                <Button
                                    onClick={handleSearch}
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    className="!bg-[#6246ea] hover:!bg-[#5135c8] !text-white !border-none w-full h-12 flex items-center justify-center shadow-md"
                                >
                                    {t("home.search_button") || "Tìm kiếm"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>
            </CheckMobilePhone>


        </>
    )
}