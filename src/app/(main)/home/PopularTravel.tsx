'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
const PopularTravel = () => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold text-[#2b2c34] dark:text-[#fffffe] mb-6">{t("home.popular_travel_tile")}</h2>

            {/* Box Đăng nhập */}
            <div className="bg-[#d1d1e9] dark:bg-[#242629] border border-gray-300 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                {/* Text */}
                <div className="flex-1">
                    <h3 className="text-lg text-[#2b2c34] dark:text-[#fffffe] font-semibold mb-1">
                        {t("home.popular_travel_text_1")}
                    </h3>
                    <p className="text-[#2b2c34] dark:text-[#94a1b2]">
                        {t("home.popular_travel_text_2")}{' '}
                        <span className="text-[#e45858] dark:text-[#7f5af0] font-semibold">
                            {t("home.popular_travel_text_discount")}
                        </span>{' '}
                        {t("home.popular_travel_text_2_1")}
                    </p>
                </div>

                {/* Nút đăng nhập + đăng ký */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Link
                        href="/login"
                        className="bg-[#6246ea] hover:bg-[#5135c8] text-white px-5 py-2 rounded-full text-sm font-medium text-center w-full sm:w-auto transition"
                    >
                        {t("home.popular_travel_button_1")}
                    </Link>
                    <Link
                        href="/register"
                        className="border border-[#6246ea] text-[#6246ea] hover:bg-gray-100 px-5 py-2 rounded-full text-sm font-medium text-center w-full sm:w-auto transition"
                    >
                        {t("home.popular_travel_button_2")}
                    </Link>
                </div>
            </div>

            {/* Grid lợi ích */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Item 1 */}
                <div className="bg-[#d1d1e9] dark:bg-[#242629] border border-gray-300 rounded-xl p-6 shadow-sm text-center ">
                    <Image
                        src="/images/calendar.png"
                        alt="calendar"
                        width={500}
                        height={300}
                        className="w-15 h-15 mx-auto mb-4" />
                    <h4 className="font-semibold text-[#2b2c34] dark:text-[#fffffe] text-base mb-2">{t("home.popular_travel_text_3")}</h4>
                    <p className="text-sm text-[#2b2c34] dark:text-[#94a1b2]">
                        <span className="text-[#e45858] dark:text-[#7f5af0] font-semibold">{t("home.popular_travel_free")}</span> {t("home.popular_travel_text_4")}
                    </p>
                </div>

                {/* Item 2 */}
                <div className="bg-[#d1d1e9] dark:bg-[#242629] border border-gray-300 rounded-xl p-6 shadow-sm text-center ">
                    <Image
                        src="/images/world.png"
                        alt="world"
                        width={500}
                        height={300}
                        className="w-12 h-15 mx-auto mb-4" />
                    <h4 className="font-semibold text-[#2b2c34] dark:text-[#fffffe] text-base mb-2">{t("home.popular_travel_text_5")}</h4>
                    <p className="text-sm text-[#2b2c34] dark:text-[#94a1b2]">{t("home.popular_travel_text_6")}</p>
                </div>

                {/* Item 3 */}
                <div className="bg-[#d1d1e9] dark:bg-[#242629] border border-gray-300 rounded-xl p-6 shadow-sm text-center ">
                    <Image
                        src="/images/hotline.png"
                        alt="hotline"
                        width={500}
                        height={300}
                        className="w-15 h-15 mx-auto mb-4" />
                    <h4 className="font-semibold text-[#2b2c34] dark:text-[#fffffe] text-base mb-2">{t("home.popular_travel_text_7")}</h4>
                    <p className="text-sm text-[#2b2c34] dark:text-[#94a1b2]">{t("home.popular_travel_text_8")}</p>
                </div>
            </div>
        </div>
    );
};

export default PopularTravel;
