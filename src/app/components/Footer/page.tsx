'use client';
import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaArrowUp } from 'react-icons/fa';
import { MdTranslate } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { CheckDesktop, CheckMobilePhone, CheckTablet } from '../HOC/ResponsiveCustom.';

const Footer = () => {
    const { i18n, t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');
    };
    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    useEffect(() => {
        setMounted(true); // chỉ cho render ngôn ngữ khi đã mounted
    }, []);
    if (!mounted) return null;
    return (
        <>
            <CheckDesktop>
                <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-10 mt-20">
                    <div className="max-w-6xl mx-auto px-4 grid grid-cols-4 gap-8">

                        {/* Cột 1: Logo + mô tả + chuyển đổi ngôn ngữ */}
                        <div>
                            <Link href="/" className="flex items-center space-x-2 mb-2">
                                <img
                                    src="/images/logo-b5ooking.png"
                                    alt="logo"
                                    className="w-20 h-20 object-contain"
                                />
                                <span className="text-2xl font-bold text-[#6246ea] leading-tight">
                                    B5ooking
                                </span>
                            </Link>
                            <p className="text-sm">
                                {t("home.footer_text_1")}
                            </p>

                            {/* Chuyển đổi ngôn ngữ */}
                            {mounted && (
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition"
                                >
                                    <MdTranslate className="text-lg" />
                                    {i18n.language === 'vi' ? 'Tiếng Việt' : 'English'}
                                </button>
                            )}
                        </div>

                        {/* Cột 2: Điều hướng */}
                        <div>
                            <h4 className="font-semibold mb-2">{t("home.footer_text_2")}</h4>
                            <ul className="space-y-1 text-sm">
                                <li><a href="/" className="hover:text-[#6246ea]">{t("home.footer_text_3")}</a></li>
                                <li><a href="/places" className="hover:text-[#6246ea]">{t("home.footer_text_4")}</a></li>
                                <li><a href="/offers" className="hover:text-[#6246ea]">{t("home.footer_text_5")}</a></li>
                                <li><a href="/about" className="hover:text-[#6246ea]">{t("home.footer_text_6")}</a></li>
                            </ul>
                        </div>

                        {/* Cột 3: Hỗ trợ */}
                        <div>
                            <h4 className="font-semibold mb-2">{t("home.footer_text_7")}</h4>
                            <ul className="space-y-1 text-sm">
                                <li><a href="/support" className="hover:text-[#6246ea]">{t("home.footer_text_8")}</a></li>
                                <li><a href="/policy" className="hover:text-[#6246ea]">{t("home.footer_text_9")}</a></li>
                                <li><a href="/contact" className="hover:text-[#6246ea]">{t("home.footer_text_10")}</a></li>
                                <li><a href="/faq" className="hover:text-[#6246ea]">{t("home.footer_text_11")}</a></li>
                            </ul>
                        </div>

                        {/* Cột 4: Mạng xã hội */}
                        <div>
                            <h4 className="font-semibold mb-2">{t("home.footer_text_12")}</h4>
                            <div className="flex gap-4 mt-2 text-xl">
                                <a href="#" className="hover:text-indigo-600"><FaFacebookF /></a>
                                <a href="#" className="hover:text-pink-600"><FaInstagram /></a>
                                <a href="#" className="hover:text-red-600"><FaYoutube /></a>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} B5ooking. {t("home.footer_text_13")}
                    </div>
                    {showButton && (
                        <button
                            onClick={scrollToTop}
                            className="cursor-pointer fixed bottom-5 right-5 p-3 bg-[#6246ea] text-white rounded-full shadow-lg hover:bg-[#5135c8] transition duration-300"
                        >
                            <FaArrowUp />
                        </button>
                    )}
                </footer>
            </CheckDesktop>
            <CheckTablet>
                <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-10 mt-20">
                    <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 gap-8">

                        {/* Cột 1: Logo + mô tả + chuyển đổi ngôn ngữ */}
                        <div>
                            <Link href="/" className="flex items-center space-x-2 mb-2">
                                <img
                                    src="/images/logo-b5ooking.png"
                                    alt="logo"
                                    className="w-20 h-20 object-contain"
                                />
                                <span className="text-2xl font-bold text-[#6246ea] leading-tight">
                                    B5ooking
                                </span>
                            </Link>
                            <p className="text-sm">
                                {t("home.footer_text_1")}
                            </p>

                            {/* Chuyển đổi ngôn ngữ */}
                            {mounted && (
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition"
                                >
                                    <MdTranslate className="text-lg" />
                                    {i18n.language === 'vi' ? 'Tiếng Việt' : 'English'}
                                </button>
                            )}
                        </div>

                        {/* Cột 2: Điều hướng */}
                        <div>
                            <h4 className="font-semibold mb-2">{t("home.footer_text_2")}</h4>
                            <ul className="space-y-1 text-sm">
                                <li><a href="/" className="hover:text-[#6246ea]">{t("home.footer_text_3")}</a></li>
                                <li><a href="/places" className="hover:text-[#6246ea]">{t("home.footer_text_4")}</a></li>
                                <li><a href="/offers" className="hover:text-[#6246ea]">{t("home.footer_text_5")}</a></li>
                                <li><a href="/about" className="hover:text-[#6246ea]">{t("home.footer_text_6")}</a></li>
                            </ul>
                        </div>

                        {/* Cột 3: Hỗ trợ */}
                        <div>
                            <h4 className="font-semibold mb-2">{t("home.footer_text_7")}</h4>
                            <ul className="space-y-1 text-sm">
                                <li><a href="/support" className="hover:text-[#6246ea]">{t("home.footer_text_8")}</a></li>
                                <li><a href="/policy" className="hover:text-[#6246ea]">{t("home.footer_text_9")}</a></li>
                                <li><a href="/contact" className="hover:text-[#6246ea]">{t("home.footer_text_10")}</a></li>
                                <li><a href="/faq" className="hover:text-[#6246ea]">{t("home.footer_text_11")}</a></li>
                            </ul>
                        </div>

                        {/* Cột 4: Mạng xã hội */}
                        <div>
                            <h4 className="font-semibold mb-2">{t("home.footer_text_12")}</h4>
                            <div className="flex gap-4 mt-2 text-xl">
                                <a href="#" className="hover:text-indigo-600"><FaFacebookF /></a>
                                <a href="#" className="hover:text-pink-600"><FaInstagram /></a>
                                <a href="#" className="hover:text-red-600"><FaYoutube /></a>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} B5ooking. {t("home.footer_text_13")}
                    </div>
                    {showButton && (
                        <button
                            onClick={scrollToTop}
                            className="cursor-pointer fixed bottom-5 right-5 p-3 bg-[#6246ea] text-white rounded-full shadow-lg hover:bg-[#5135c8] transition duration-300"
                        >
                            <FaArrowUp />
                        </button>
                    )}
                </footer>
            </CheckTablet>
            <CheckMobilePhone>
                <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-8 px-4 mt-16 space-y-8">
                    {/* Logo + mô tả + đổi ngôn ngữ */}
                    <div className="text-center space-y-3">
                        <Link href="/" className="inline-flex items-center justify-center gap-2">
                            <img
                                src="/images/logo-b5ooking.png"
                                alt="logo"
                                className="w-16 h-16 object-contain"
                            />
                            <span className="text-xl font-bold text-[#6246ea] leading-tight">
                                B5ooking
                            </span>
                        </Link>
                        <p className="text-sm">{t("home.footer_text_1")}</p>

                        {mounted && (
                            <button
                                onClick={toggleLanguage}
                                className="inline-flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition"
                            >
                                <MdTranslate className="text-lg" />
                                {i18n.language === "vi" ? "Tiếng Việt" : "English"}
                            </button>
                        )}
                    </div>

                    {/* Điều hướng + Hỗ trợ + Giới thiệu */}
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-semibold mb-2">{t("home.footer_text_2")}</h4>
                            <ul className="space-y-1">
                                <li><a href="/" className="hover:text-[#6246ea]">{t("home.footer_text_3")}</a></li>
                                <li><a href="/places" className="hover:text-[#6246ea]">{t("home.footer_text_4")}</a></li>
                                <li><a href="/offers" className="hover:text-[#6246ea]">{t("home.footer_text_5")}</a></li>
                                <li><a href="/about" className="hover:text-[#6246ea]">{t("home.footer_text_6")}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">{t("home.footer_text_7")}</h4>
                            <ul className="space-y-1">
                                <li><a href="/support" className="hover:text-[#6246ea]">{t("home.footer_text_8")}</a></li>
                                <li><a href="/policy" className="hover:text-[#6246ea]">{t("home.footer_text_9")}</a></li>
                                <li><a href="/contact" className="hover:text-[#6246ea]">{t("home.footer_text_10")}</a></li>
                                <li><a href="/faq" className="hover:text-[#6246ea]">{t("home.footer_text_11")}</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Mạng xã hội */}
                    <div className="text-center">
                        <h4 className="font-semibold mb-2">{t("home.footer_text_12")}</h4>
                        <div className="flex justify-center gap-6 text-xl mt-2">
                            <a href="#" className="hover:text-indigo-600"><FaFacebookF /></a>
                            <a href="#" className="hover:text-pink-600"><FaInstagram /></a>
                            <a href="#" className="hover:text-red-600"><FaYoutube /></a>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-300 dark:border-gray-700">
                        © {new Date().getFullYear()} B5ooking. {t("home.footer_text_13")}
                    </div>

                    {/* Nút scroll top */}
                    {showButton && (
                        <button
                            onClick={scrollToTop}
                            className="fixed bottom-4 right-4 p-3 bg-[#6246ea] text-white rounded-full shadow-lg hover:bg-[#5135c8] transition duration-300"
                        >
                            <FaArrowUp />
                        </button>
                    )}
                </footer>
            </CheckMobilePhone>


        </>
    );
};

export default Footer;
