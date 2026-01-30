'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaUser, FaSuitcase, FaImage, FaChartBar
} from 'react-icons/fa';
import {
    MdBedroomParent, MdMeetingRoom, MdArticle
} from 'react-icons/md';
import { RiDiscountPercentFill } from "react-icons/ri";

const menuItems = [
    { label: 'Tổng quan hệ thống', icon: <FaChartBar />, href: '/admin/dashboard' },
    { label: 'Quản lý người dùng', icon: <FaUser />, href: '/admin/users' },
    { label: 'Quản lý khách sạn', icon: <FaSuitcase />, href: '/admin/hotels' },
    { label: 'Quản lý chỗ ở', icon: <MdMeetingRoom />, href: '/admin/rooms' },
    { label: 'Quản lý bài viết', icon: <MdArticle />, href: '/admin/blogs' },
    { label: 'Quản lý ảnh', icon: <FaImage />, href: '/admin/images' },
    { label: 'Quản lý đặt phòng', icon: <MdBedroomParent />, href: '/admin/bookings' },
    { label: 'Quản lý voucher', icon: <RiDiscountPercentFill />, href: '/admin/voucher' }
];

export default function SidebarMenuAdmin() {
    const pathname = usePathname();

    return (
        <aside className="fixed w-80 min-h-screen mt-5 p-6 border-r bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-xl flex flex-col">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-12">
                <img
                    src="/images/logo-b5ooking.png"
                    alt="logo"
                    className="w-[70px] h-[55px] object-contain drop-shadow-md"
                />
                <span className="text-2xl font-extrabold text-[#6246ea] tracking-tight">
                    B5ooking
                </span>
            </Link>

            {/* Menu */}
            <ul className="space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group
                ${isActive
                                        ? 'bg-[#6246ea] text-white shadow-lg shadow-[#6246ea]/30 scale-[1.02]'
                                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:shadow-md hover:scale-[1.01]'
                                    }`}
                            >
                                <span
                                    className={`text-xl transition-all duration-300 ${isActive
                                        ? 'text-white drop-shadow-sm'
                                        : 'text-[#6246ea] group-hover:text-[#6246ea]'
                                        }`}
                                >
                                    {item.icon}
                                </span>
                                <span className="truncate">{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Footer */}
            <div className="mt-auto pt-8 text-sm text-center text-zinc-500 dark:text-zinc-400 border-t dark:border-zinc-800">
                © 2025 B5ooking Admin
            </div>
        </aside>
    );
}
