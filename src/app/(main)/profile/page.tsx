"use client";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { FaUserAlt } from 'react-icons/fa';
import EditProfileUser from "./EditProfileUser";
import { useState, useEffect } from 'react';
import { hideLoading, showLoading } from '@/redux/features/loadingSlice';
import { useAppDispatch } from '@/redux/hook';
import { useTranslation } from "react-i18next";
import { CheckDesktop, CheckMobilePhone, CheckTablet } from "../components/HOC/ResponsiveCustom.";
import Image from 'next/image';

export default function Profile() {
    const { user } = useSelector((state: RootState) => state.userSlice);
    const [isEditing, setIsEditing] = useState(false);
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(showLoading());
        const timeout = setTimeout(() => {
            dispatch(hideLoading());
        }, 2000);

        return () => clearTimeout(timeout);
    }, [dispatch]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <CheckDesktop>
                <div className="max-w-4xl mx-auto  mt-6 px-4 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                            {t("profile.text_2")}
                        </h1>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition duration-200"
                        >
                            {t("profile.text_3")}
                        </button>
                    </div>

                    {/* Form chỉnh sửa */}
                    {isEditing && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <EditProfileUser
                                isOpen={isEditing}
                                onClose={() => setIsEditing(false)}
                                defaultValues={{
                                    firstName: user?.firstName || "", // Thêm ?. và || ""
                                    lastName: user?.lastName || "",
                                    phone: user?.phone || "",
                                    gender: user?.gender || "",
                                }}
                            />
                        </div>
                    )}

                    {/* Thông tin người dùng */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white dark:bg-[#242629] p-6 rounded-xl shadow-md">
                        {user?.avatar ? (
                            <Image
                                src={user.avatar ?? ""}
                                alt="avatar"
                                width={500}
                                height={300}
                                className="w-20 h-20 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-[#242629] flex items-center justify-center text-white">
                                <FaUserAlt className="text-2xl" />
                            </div>
                        )}

                        <div className="text-center sm:text-left">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-[#94a1b2]">{user?.fullName}</h2>
                            <p className="text-gray-600 dark:text-[#94a1b2] text-sm mb-1">{t("profile.text_4")}</p>
                            <span className="inline-block mt-1 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Phần hoàn tất hồ sơ */}
                    <div className="bg-white dark:bg-[#242629] rounded-xl p-6 shadow-md">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-[#94a1b2] mb-2">{t("profile.text_5")}</h3>
                        <p className="text-gray-600 dark:text-[#94a1b2] mb-4">{t("profile.text_6")}</p>
                        <button className="bg-[#6246ea] hover:bg-[#5135c8] text-white font-semibold px-6 py-2 rounded-lg transition duration-200">
                            {t("profile.text_7")}
                        </button>
                    </div>
                </div>
            </CheckDesktop>
            <CheckTablet>
                <div className="max-w-4xl mx-auto mt-6 px-4 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                            {t("profile.text_2")}
                        </h1>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition duration-200"
                        >
                            {t("profile.text_3")}
                        </button>
                    </div>

                    {/* Form chỉnh sửa */}
                    {isEditing && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <EditProfileUser
                                isOpen={isEditing}
                                onClose={() => setIsEditing(false)}
                                defaultValues={{
                                    firstName: user?.firstName || "", // Thêm ?. và || ""
                                    lastName: user?.lastName || "",
                                    phone: user?.phone || "",
                                    gender: user?.gender || "",
                                }}
                            />
                        </div>
                    )}

                    {/* Thông tin người dùng */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white dark:bg-[#242629] p-6 rounded-xl shadow-md">
                        {user?.avatar ? (
                            <Image
                                src={user.avatar ?? ""}
                                alt="avatar"
                                width={500}
                                height={300}
                                className="w-20 h-20 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                <FaUserAlt className="text-2xl" />
                            </div>
                        )}

                        <div className="text-center sm:text-left">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-[#94a1b2]">{user?.fullName}</h2>
                            <p className="text-gray-600 dark:text-[#94a1b2] text-sm mb-1">{t("profile.text_4")}</p>
                            <span className="inline-block mt-1 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Phần hoàn tất hồ sơ */}
                    <div className="bg-white dark:bg-[#242629] rounded-xl p-6 shadow-md">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-[#94a1b2] mb-2">{t("profile.text_5")}</h3>
                        <p className="text-gray-600 dark:text-[#94a1b2] mb-4">{t("profile.text_6")}</p>
                        <button className="bg-[#6246ea] hover:bg-[#5135c8] text-white font-semibold px-6 py-2 rounded-lg transition duration-200">
                            {t("profile.text_7")}
                        </button>
                    </div>
                </div>
            </CheckTablet>
            <CheckMobilePhone>
                <div className="p-4 space-y-6">
                    {/* Avatar + Tên */}
                    <div className="flex flex-col items-center dark:bg-[#242629] text-center space-y-3">
                        {user?.avatar ? (
                            <Image
                                src={user.avatar ?? ""}
                                alt="avatar"
                                width={500}
                                height={300}
                                className="w-24 h-24 rounded-full object-cover border shadow-md"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white shadow-md">
                                <FaUserAlt className="text-3xl" />
                            </div>
                        )}

                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-[#94a1b2]">{user?.fullName}</h2>
                            <p className="text-gray-500 dark:text-[#94a1b2] text-sm">{t("profile.text_4")}</p>
                            <span className="inline-block mt-1 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Nút chỉnh sửa */}
                    <div className="text-center">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-white font-medium px-4 py-2 rounded-lg transition"
                        >
                            {t("profile.text_3")}
                        </button>
                    </div>

                    {/* Chỉnh sửa hồ sơ */}
                    {isEditing && (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                            <EditProfileUser
                                isOpen={isEditing}
                                onClose={() => setIsEditing(false)}
                                defaultValues={{
                                    firstName: user?.firstName || "", // Thêm ?. và || ""
                                    lastName: user?.lastName || "",
                                    phone: user?.phone || "",
                                    gender: user?.gender || "",
                                }}
                            />
                        </div>
                    )}

                    {/* Hoàn tất hồ sơ */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md space-y-2">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            {t("profile.text_5")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{t("profile.text_6")}</p>
                        <button className="w-full bg-[#6246ea] hover:bg-[#5135c8] text-white font-semibold py-2 rounded-lg">
                            {t("profile.text_7")}
                        </button>
                    </div>
                </div>
            </CheckMobilePhone>


        </>
    );
}
