"use client"
import { hideLoading, showLoading } from '@/redux/features/loadingSlice';
import { useAppDispatch } from '@/redux/hook';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
// app/about/page.tsx
export default function AboutPage() {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const dispatch = useAppDispatch();
    const data = [
        {
            title: t("about.title_1"),
            desc: t("about.desc_1")
        },
        {
            title: t("about.title_2"),
            desc: t("about.desc_2")
        },
        {
            title: t("about.title_3"),
            desc: t("about.desc_3")
        },
        {
            title: t("about.title_4"),
            desc: t("about.desc_4")
        }
    ]
    useEffect(() => {
        dispatch(showLoading());
        const timeout = setTimeout(() => {
            dispatch(hideLoading());
        }, 2000);

        return () => clearTimeout(timeout);
    }, [dispatch]);
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    return (
        <div>
            {/* tên và logo */}
            <div className="pt-10 text-center ">
                <Link href="/" className="flex items-center justify-start">
                    <Image
                        src="/images/logo-b5ooking.png"
                        alt="logo"
                        width={500}
                        height={300}
                        className="w-[150px] h-[80px] object-contain mb-2"
                    />
                    <span className="text-3xl md:text-4xl font-bold ">
                        <span className='text-[#6246ea]'>B5ooking</span> - {t("about.text_1")}
                    </span>
                </Link>
            </div>
            {/* Content chính */}
            <div className="relative z-10 px-4 md:px-10 pt-8 text-gray-800">
                {/* 1. Giới thiệu */}
                <section className="mb-12 bg-white dark:bg-[#242629] border-gray-300 p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl text-[#2b2c34] dark:text-[#fffffe] font-bold mb-4">{t("about.text_2")} <span className="text-[#6246ea]">B5ooking</span></h2>
                    <p className="text-lg text-[#2b2c34] dark:text-[#94a1b2] leading-relaxed">
                        {t("about.text_23")}
                    </p>
                </section>

                {/* 2. Tại sao chọn */}
                <section className="mb-12 ">
                    <h2 className="text-2xl text-[#2b2c34] dark:text-[#fffffe] font-bold mb-6">{t("about.text_3")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.map((item, index) => (
                            <div key={index} className="bg-[#d1d1e9] dark:bg-[#242629] p-6 rounded-xl shadow-sm">
                                <h3 className="text-xl font-semibold mb-2 text-[#e45858] dark:text-[#7f5af0]">{item.title}</h3>
                                <p className="text-[#2b2c34] dark:text-[#94a1b2]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Dịch vụ */}
                <section className="mb-12 bg-white dark:bg-[#242629] p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl text-[#2b2c34] dark:text-[#fffffe] font-bold mb-4">{t("about.text_4")}</h2>
                    <ul className="list-disc text-[#2b2c34] dark:text-[#94a1b2] pl-6 space-y-2 text-lg">
                        <li>{t("about.text_5")}</li>
                        <li>{t("about.text_6")}</li>
                        <li>{t("about.text_7")}</li>
                        <li>{t("about.text_8")}</li>
                    </ul>
                </section>

                {/* 4. Liên hệ */}
                <section className="bg-white dark:bg-[#242629] p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl text-[#2b2c34] dark:text-[#fffffe] font-bold mb-4">{t("about.text_9")}</h2>
                    <div className="text-lg text-[#2b2c34] dark:text-[#94a1b2] leading-relaxed">
                        <p><strong>{t("about.text_10")}</strong></p>
                        <p>{t("about.text_11")}</p>
                        <p>{t("about.text_12")}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
