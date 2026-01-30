"use client"
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
const PlanBanner = () => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    return (
        <div className="bg-[#d1d1e9] border-gray-300 rounded-2xl shadow-lg p-6 md:p-12 my-10 mx-4 md:mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Left bubble-style box */}
                <div className="bg-[#e0e7ff] rounded-[100px] px-10 py-8 shadow-md text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-[#2b2c34] mb-4 leading-snug">
                        {t("home.plan_banner_text_1")}<br />
                        {t("home.plan_banner_text_2")}
                    </h2>
                    <p className="text-sm md:text-base text-[#2b2c34] mb-6">
                        {t("home.plan_banner_text_3")}
                    </p>
                    <button className="bg-[#6246ea] hover:bg-[#503ac7] text-[#fffffe] px-6 py-2 rounded-full text-sm font-semibold shadow transition">
                        {t("home.plan_banner_button")}
                    </button>
                </div>
                <div className="flex justify-center">
                    <Image
                        src="/images/home_plan.png"
                        alt="home plan"
                        width={500}
                        height={300}
                        className="w-full max-w-sm object-contain"
                    />
                </div>
            </div>
        </div>
    )
}
export default PlanBanner