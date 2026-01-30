'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUser, FaSuitcase, FaHeart } from 'react-icons/fa';
import { MdBedroomParent } from "react-icons/md";

export default function SidebarMenu() {
    const pathname = usePathname();
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;

    const menuItems = [
        { label: t("profile.label_1"), icon: <FaUser />, href: '/profile' },
        { label: t("profile.label_2"), icon: <FaSuitcase />, href: '/profile/booking' },
        { label: t("profile.label_3"), icon: <FaHeart />, href: '/profile/favorite' },
        { label: t("profile.label_4"), icon: <MdBedroomParent />, href: '/profile/room' }
    ];

    return (
        <>
            {/* Desktop / Tablet Sidebar */}
            <aside className="hidden sm:block w-64 p-6 border-r min-h-screen bg-white dark:bg-zinc-900 dark:border-zinc-700">
                <h2 className="text-2xl font-bold mb-8 text-black dark:text-white">{t("profile.text_1")}</h2>
                <ul className="space-y-4">
                    {menuItems.map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition
                                        ${isActive
                                            ? 'bg-black text-white dark:bg-white dark:text-black'
                                            : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-black dark:text-white'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            {/* Mobile Bottom Navbar */}
            <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-900 border-t dark:border-zinc-700 flex justify-between py-2 z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
                {menuItems.map(item => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex-1 flex flex-col items-center justify-center text-xs py-2 transition duration-200 ${isActive
                                ? 'text-[#6246ea] bg-gray-100 dark:bg-zinc-800 font-semibold'
                                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <span className="text-[20px] mb-1">{item.icon}</span>
                            <span className="text-[8px]">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
