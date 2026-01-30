"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaSun, FaMoon, FaUserAlt, FaBars } from "react-icons/fa";
import { MdTranslate } from "react-icons/md";
import { Drawer, Select, theme } from "antd";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useAppDispatch } from "@/redux/hook";
import { useSelector } from "react-redux";
import { setUserLogoutAction } from "@/redux/features/userSlice";
import toast from "react-hot-toast";
import { RootState } from "@/lib/store";
import { hideLoading, showLoading } from "@/redux/features/loadingSlice";
import { CheckDesktop, CheckMobilePhone, CheckTablet } from '@/app/components/HOC/ResponsiveCustom.';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";


const NavBarOnly = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const { i18n, t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const pathName = usePathname();
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.userSlice);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!mounted) return null;

    const handleLogout = () => {
        dispatch(showLoading());
        setTimeout(() => {
            dispatch(setUserLogoutAction());
            toast.success("Đăng xuất thành công");
            router.push("/");
            dispatch(hideLoading());
        }, 1000);
    };
    const handleLogin = () => {
        dispatch(showLoading());
        startTransition(() => {
            router.push("/login");
            dispatch(hideLoading());
        });
    };


    return (
        <>
            <CheckMobilePhone>
                <nav
                    className={`sticky top-0 z-50 w-full px-4 py-3 flex items-center justify-between transition-all duration-300 ${isScrolled
                        ? "bg-white dark:bg-black dark:text-white text-black shadow-md"
                        : "bg-black/30 dark:bg-black/30 dark:text-white backdrop-blur-md text-white"
                        }`}
                >
                    {/* Left: Logo + tên */}
                    <div className="flex items-center gap-2 basis-1/3">
                        <Link href="/" className="flex items-center justify-center gap-1">
                            <img src="/images/logo-b5ooking.png" alt="logo" className="w-20 h-8 object-contain" />
                            <span className="text-lg font-bold text-[#6246ea]">B5ooking</span>
                        </Link>
                    </div>

                    {/* Center: Ngôn ngữ + Dark mode */}
                    <div className="flex justify-center items-center gap-4 basis-1/3">
                        <button
                            onClick={() => {
                                i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
                                setOpen(false);
                            }}
                            className="text-xl"
                            title="Đổi ngôn ngữ"
                        >
                            <MdTranslate />
                        </button>
                        <button
                            onClick={() => {
                                dispatch(showLoading());
                                setTimeout(() => {
                                    setTheme(resolvedTheme === "dark" ? "light" : "dark");
                                    dispatch(hideLoading());
                                }, 500);
                            }}
                            className="text-xl hover:text-[#6246ea] transition"
                            title="Đổi giao diện"
                        >
                            {resolvedTheme === "dark" ? <FaSun /> : <FaMoon />}
                        </button>

                        {/* Right: Drawer */}
                        <button onClick={() => setOpen(true)}>
                            <FaBars className="text-xl" />
                        </button>
                    </div>
                    {/* Drawer menu */}
                    <Drawer
                        placement="right"
                        open={open}
                        onClose={() => setOpen(false)}
                        width={220}
                        title="Cài đặt"
                        styles={{
                            body: {
                                backgroundColor: "#fffffe", // nền sáng
                                color: "#2b2c34",           // chữ chính
                                padding: "16px",
                            },
                            header: {
                                backgroundColor: "#6246ea", // header nổi bật
                                color: "#fffffe",            // chữ trắng
                                borderBottom: "1px solid #d1d1e9",
                            },
                            footer: {
                                backgroundColor: "#d1d1e9", // footer nhẹ
                                borderTop: "1px solid #6246ea",
                            },
                        }}
                    >
                        <div className="flex flex-col gap-4">
                            {user ? (
                                <>
                                    <Link href={user?.role === "ADMIN" ? "/admin" : "/profile"} className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            {user?.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt="avatar"
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                                    <FaUserAlt className="text-sm" />
                                                </div>
                                            )}
                                            <span className="text-sm font-medium">{user?.fullName}</span>
                                        </div>
                                    </Link>

                                    {/* Alert Dialog Đăng xuất */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="px-3 py-1.5 cursor-pointer rounded-xl bg-[#6246ea] hover:bg-[#5135c8] text-white font-medium transition">
                                                {t("home.button_header_signout")}
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Bạn có chắc chắn muốn đăng xuất?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Hành động này sẽ đăng xuất bạn khỏi hệ thống.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleLogout}>Đăng xuất</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    disabled={isPending}
                                    className="ml-2 px-4 py-1.5 cursor-pointer rounded-xl bg-[#6246ea] hover:bg-[#5135c8] text-white font-medium transition"
                                >
                                    {isPending ? "Đang chuyển..." : "Đăng nhập"}
                                </button>
                            )}
                            <Link href="/" onClick={() => setOpen(false)}>{t("home.button_header_home")}</Link>
                            <Link href="/blog" onClick={() => setOpen(false)}>{t("home.button_header_article")}</Link>
                            <Link href="/about" onClick={() => setOpen(false)}>{t("home.button_header_about")}</Link>

                        </div>
                    </Drawer>
                </nav>
            </CheckMobilePhone>
            <CheckTablet>
                <nav
                    className={`sticky top-0 z-50 w-full px-6 py-3 flex items-center justify-between transition-all duration-300 ${isScrolled
                        ? "bg-white dark:bg-black dark:text-white text-black shadow-md"
                        : "bg-black/30 dark:bg-black/30 dark:text-white backdrop-blur-md text-white"
                        }`}
                >
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-1">
                            <img src="/images/logo-b5ooking.png" alt="logo" className="w-20 h-10   object-contain" />
                            <span className="text-lg font-bold text-[#6246ea]">B5ooking</span>
                        </Link>
                    </div>

                    {/* Nav menu căn giữa */}
                    <div className="flex-1 flex justify-center">
                        <nav className="flex gap-6">
                            {["/", "/blog", "/about"].map((href, index) => {
                                const isActive = pathName === href;
                                const labels = [t("home.button_header_home"), t("home.button_header_article"), t("home.button_header_about")];
                                const icons = ["/images/home.png", "/images/article.png", "/images/about.png"];
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`group relative flex flex-col items-center transition-all duration-300 ${isActive ? "text-[#6246ea]" : "hover:text-[#6246ea]"
                                            }`}
                                    >
                                        <img
                                            className={`w-5 h-5 object-cover transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"
                                                }`}
                                            src={icons[index]}
                                            alt={labels[index]}
                                        />
                                        <span className="text-sm font-medium">{labels[index]}</span>
                                        <span
                                            className={`mt-[2px] h-[2px] w-full bg-[#6246ea] transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                }`}
                                        />
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Icon right: translate, theme, drawer */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
                                setOpen(false);
                            }}
                            className="text-xl"
                            title="Đổi ngôn ngữ"
                        >
                            <MdTranslate />
                        </button>
                        <button
                            onClick={() => {
                                dispatch(showLoading());
                                setTimeout(() => {
                                    setTheme(resolvedTheme === "dark" ? "light" : "dark");
                                    dispatch(hideLoading());
                                }, 500);
                            }}
                            className="text-xl hover:text-[#6246ea] transition"
                            title="Đổi giao diện"
                        >
                            {resolvedTheme === "dark" ? <FaSun /> : <FaMoon />}
                        </button>
                        <button onClick={() => setOpen(true)}>
                            <FaBars className="text-xl" />
                        </button>
                    </div>

                    {/* Drawer giữ nguyên như cũ */}
                    <Drawer
                        placement="right"
                        open={open}
                        onClose={() => setOpen(false)}
                        width={280}
                        title="Cài đặt"
                        styles={{
                            body: {
                                backgroundColor: "#fffffe", // nền sáng
                                color: "#2b2c34",           // chữ chính
                                padding: "16px",
                            },
                            header: {
                                backgroundColor: "#6246ea", // header nổi bật
                                color: "#fffffe",            // chữ trắng
                                borderBottom: "1px solid #d1d1e9",
                            },
                            footer: {
                                backgroundColor: "#d1d1e9", // footer nhẹ
                                borderTop: "1px solid #6246ea",
                            },
                        }}
                    >
                        <div className="flex flex-col gap-4">
                            {user ? (
                                <>
                                    <Link href={user?.role === "ADMIN" ? "/admin" : "/profile"} className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            {user?.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt="avatar"
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                                    <FaUserAlt className="text-sm" />
                                                </div>
                                            )}
                                            <span className="text-sm font-medium">{user?.fullName}</span>
                                        </div>
                                    </Link>

                                    {/* Alert Dialog Đăng xuất */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="px-3 py-1.5 cursor-pointer rounded-xl bg-[#6246ea] hover:bg-[#5135c8] text-white font-medium transition">
                                                {t("home.button_header_signout")}
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Bạn có chắc chắn muốn đăng xuất?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Hành động này sẽ đăng xuất bạn khỏi hệ thống.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleLogout}>Đăng xuất</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        dispatch(showLoading());
                                        setTimeout(() => {
                                            router.push("/login");
                                            dispatch(hideLoading());
                                        }, 5000);
                                    }}
                                    className="ml-2 px-4 py-1.5 cursor-pointer rounded-xl bg-[#6246ea] hover:bg-[#5135c8] text-white font-medium transition"
                                >
                                    {t("home.button_header_signin")}
                                </button>
                            )}
                        </div>
                    </Drawer>
                </nav>
            </CheckTablet>
            <CheckDesktop>
                <nav
                    className={`
                            sticky top-0 z-50 w-full px-8 py-2 flex items-center justify-between
                            transition-all duration-300
                            ${isScrolled
                            ? "bg-white dark:bg-black text-black dark:text-white shadow-md"
                            : "bg-black/30 dark:bg-black/30 text-white backdrop-blur-md"}
    `}
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center justify-center gap-1">
                        <img
                            src="/images/logo-b5ooking.png"
                            alt="logo"
                            className="w-[80px] h-[60px] object-contain"
                        />
                        <span className="text-2xl font-bold text-[#6246ea]">B5ooking</span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex-1 flex justify-center">
                        <div className="flex gap-6">
                            {["/", "/blog", "/about"].map((href, index) => {
                                const isActive = pathName === href;
                                const labels = [
                                    t("home.button_header_home"),
                                    t("home.button_header_article"),
                                    t("home.button_header_about"),
                                ];
                                const icons = [
                                    "/images/home.png",
                                    "/images/article.png",
                                    "/images/about.png",
                                ];
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`group flex flex-col items-center transition duration-300 ${isActive ? "text-[#6246ea]" : "hover:text-[#6246ea]"
                                            }`}
                                    >
                                        <img
                                            src={icons[index]}
                                            alt={labels[index]}
                                            className={`w-8 h-6 object-contain mb-1 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"
                                                }`}
                                        />
                                        <span className="text-sm font-medium">{labels[index]}</span>
                                        <span
                                            className={`h-[2px] mt-1 w-full bg-[#6246ea] transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                }`}
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Theme toggle */}
                        <button
                            onClick={() => {
                                dispatch(showLoading());
                                setTimeout(() => {
                                    setTheme(resolvedTheme === "dark" ? "light" : "dark");
                                    dispatch(hideLoading());
                                }, 500);
                            }}
                            className="text-lg hover:text-[#6246ea] transition"
                            title="Đổi giao diện"
                        >
                            {resolvedTheme === "dark" ? <FaSun /> : <FaMoon />}
                        </button>

                        {/* Language */}
                        <div className="flex items-center gap-1">
                            <MdTranslate className="text-lg" />
                            <Select
                                value={i18n.language}
                                onChange={(val) => i18n.changeLanguage(val)}
                                className="w-[120px] text-black dark:text-white"
                                suffixIcon={null}
                                popupMatchSelectWidth={false}
                                options={[
                                    { value: "vi", label: "🇻🇳 Tiếng Việt" },
                                    { value: "en", label: "🇺🇸 English" },
                                ]}
                            />
                        </div>

                        {/* User Info */}
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={user.role === "ADMIN" ? "/admin" : "/profile"}
                                    className="flex items-center gap-2"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt="avatar"
                                            className="w-7 h-7 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                            <FaUserAlt className="text-xs" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium truncate max-w-[120px]">
                                        {user.fullName}
                                    </span>
                                </Link>

                                {/* Logout */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="px-3 py-1 rounded-md bg-[#6246ea] hover:bg-[#5135c8] text-white text-sm transition">
                                            {t("home.button_header_signout")}
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Bạn có chắc chắn muốn đăng xuất?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Hành động này sẽ đăng xuất bạn khỏi hệ thống.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleLogout}>Đăng xuất</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    dispatch(showLoading());
                                    setTimeout(() => {
                                        router.push("/login");
                                        dispatch(hideLoading());
                                    }, 1000);
                                }}
                                className="px-4 py-1.5 rounded-md bg-[#6246ea] hover:bg-[#5135c8] text-white text-sm font-medium transition"
                            >
                                {t("home.button_header_signin")}
                            </button>
                        )}
                    </div>
                </nav>
            </CheckDesktop>


        </>
    );
};

export default NavBarOnly;
