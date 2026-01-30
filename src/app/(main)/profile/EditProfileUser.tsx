'use client';

import { useForm } from "react-hook-form";
import { updateUserService } from "@/app/api/userService";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setUserLoginAction } from "@/redux/features/userSlice";
import { FormDataUpdateUser } from '@/app/types/userType';
import { useEffect, useState } from "react";
import { FaCamera, FaUserAlt } from "react-icons/fa";
import { RootState } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { CheckDesktop, CheckMobilePhone, CheckTablet } from "@/app/components/HOC/ResponsiveCustom";
import Image from 'next/image';

export default function EditProfileUser({
    defaultValues,
    onClose,
    isOpen,
}: {
    defaultValues: FormDataUpdateUser;
    onClose: () => void;
    isOpen: boolean;
}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm<FormDataUpdateUser>({
        defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const dispatch = useAppDispatch();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const { user } = useAppSelector((state: RootState) => state.userSlice)
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const handleAvatarChange = (file: File) => {
        const imageUrl = URL.createObjectURL(file);
        setAvatarFile(file);
        setPreviewAvatar(imageUrl);
    };
    useEffect(() => {
        if (avatarFile) {
            const imageUrl = URL.createObjectURL(avatarFile);
            setPreviewAvatar(imageUrl);
        } else if (user?.avatar) {
            setPreviewAvatar(user.avatar);
        } else {
            setPreviewAvatar(null);
        }
    }, [avatarFile, user?.avatar]);
    useEffect(() => {
        if (!isOpen) {
            setAvatarFile(null);
            setPreviewAvatar(null);
        }
    }, [isOpen]);
    const onSubmit = async (data: FormDataUpdateUser) => {
        try {
            const formData = new FormData();
            const oldUser = JSON.parse(localStorage.getItem("user") || "{}");
            const token = oldUser?.token_access;

            formData.append('userId', oldUser.id);
            if (avatarFile) formData.append('avatar', avatarFile);
            if (data.firstName) formData.append('firstName', data.firstName);
            if (data.lastName) formData.append('lastName', data.lastName);
            if (data.phone) formData.append('phone', data.phone);
            if (data.gender) formData.append('gender', data.gender);

            const res = await updateUserService(formData);
            const updateUser = res.data.data.updateUser;

            const userWithToken = {
                ...updateUser,
                token_access: token,
            };

            dispatch(setUserLoginAction(userWithToken));
            localStorage.setItem("user", JSON.stringify(userWithToken));
            toast.success("Cập nhật thành công");
            onClose();
        } catch (error) {
            toast.error("Cập nhật thất bại");
        }
    };

    if (!isOpen) return null;
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    return (
        <>
            <CheckDesktop>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-4xl relative">
                        {/* Nút đóng */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white text-xl"
                        >
                            ❌
                        </button>

                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                            {t("profile.text_8")}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Avatar bên trái */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative w-32 h-32">
                                    {previewAvatar ? (
                                        <Image
                                            src={previewAvatar ?? ""}
                                            alt="preview"
                                            width={500}
                                            height={300}
                                            className="w-full h-full rounded-full object-cover border" />
                                    ) : defaultValues.avatar ? (
                                        <img
                                            src={defaultValues.avatar}
                                            alt="avatar"
                                            className="w-full h-full rounded-full object-cover border" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-white">
                                            <FaUserAlt className="text-3xl" />
                                        </div>
                                    )}
                                    <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100">
                                        <FaCamera className="text-gray-600" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleAvatarChange(file);
                                            }}
                                        />
                                    </label>
                                </div>
                                <p className="text-sm text-gray-500 text-center">{t("profile.text_9")}</p>
                            </div>

                            {/* Thông tin bên phải */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("profile.text_10")}</label>
                                        <input
                                            {...register("firstName")}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("profile.text_11")}</label>
                                        <input
                                            {...register("lastName")}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("profile.text_12")}</label>
                                    <input
                                        {...register("phone")}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("profile.text_13")}</label>
                                    <select
                                        {...register("gender")}
                                        className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                    >
                                        <option value="" disabled>{t("profile.text_14")}</option>
                                        <option value="Nam">{t("profile.text_15")}</option>
                                        <option value="Nữ">{t("profile.text_16")}</option>
                                    </select>
                                </div>

                                {/* Nút hành động */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 border rounded-lg text-gray-700 dark:text-white dark:border-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                                    >
                                        {t("profile.text_17")}
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-lg text-white font-semibold transition bg-blue-600 hover:bg-blue-700"
                                    >
                                        {t("profile.text_18")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </CheckDesktop>
            <CheckTablet>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-4xl relative">
                        {/* Nút đóng */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white text-xl"
                        >
                            ❌
                        </button>

                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                            {t("profile.text_8")}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Avatar bên trái */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative w-32 h-32">
                                    {previewAvatar ? (
                                        <Image
                                            src={previewAvatar ?? ""}
                                            alt="preview"
                                            width={500}
                                            height={300}
                                            className="w-full h-full rounded-full object-cover border" />
                                    ) : defaultValues.avatar ? (
                                        <img
                                            src={defaultValues.avatar}
                                            alt="avatar"
                                            className="w-full h-full rounded-full object-cover border" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-white">
                                            <FaUserAlt className="text-3xl" />
                                        </div>
                                    )}
                                    <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100">
                                        <FaCamera className="text-gray-600" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleAvatarChange(file);
                                            }}
                                        />
                                    </label>
                                </div>
                                <p className="text-sm text-gray-500 text-center">{t("profile.text_9")}</p>
                            </div>

                            {/* Thông tin bên phải */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("profile.text_10")}</label>
                                        <input
                                            {...register("firstName")}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("profile.text_11")}</label>
                                        <input
                                            {...register("lastName")}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("profile.text_12")}</label>
                                    <input
                                        {...register("phone")}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{t("profile.text_13")}</label>
                                    <select
                                        {...register("gender")}
                                        className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                    >
                                        <option value="" disabled>{t("profile.text_14")}</option>
                                        <option value="male">{t("profile.text_15")}</option>
                                        <option value="female">{t("profile.text_16")}</option>
                                    </select>
                                </div>

                                {/* Nút hành động */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 border rounded-lg text-gray-700 dark:text-white dark:border-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                                    >
                                        {t("profile.text_17")}
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-lg text-white font-semibold transition bg-blue-600 hover:bg-blue-700"
                                    >
                                        {t("profile.text_18")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </CheckTablet>
            <CheckMobilePhone>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm relative flex flex-col max-h-[90vh] overflow-y-auto p-4">
                        {/* Nút đóng */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black dark:hover:text-white text-xl"
                        >
                            ❌
                        </button>

                        <h2 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-white">
                            {t("profile.text_8")}
                        </h2>

                        {/* Avatar */}
                        <div className="flex flex-col items-center space-y-3 mb-4 mt-4">
                            <div className="relative w-28 h-28">
                                {previewAvatar ? (
                                    <img
                                        src={previewAvatar}
                                        alt="preview"
                                        className="w-full h-full rounded-full object-cover border"
                                    />
                                ) : defaultValues.avatar ? (
                                    <img
                                        src={defaultValues.avatar}
                                        alt="avatar"
                                        className="w-full h-full rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-white">
                                        <FaUserAlt className="text-3xl" />
                                    </div>
                                )}
                                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100">
                                    <FaCamera className="text-gray-600" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleAvatarChange(file);
                                        }}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                {t("profile.text_9")}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 flex-1 overflow-y-auto pb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                    {t("profile.text_10")}
                                </label>
                                <input
                                    {...register("firstName")}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                    {t("profile.text_11")}
                                </label>
                                <input
                                    {...register("lastName")}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                    {t("profile.text_12")}
                                </label>
                                <input
                                    {...register("phone")}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                    {t("profile.text_13")}
                                </label>
                                <select
                                    {...register("gender")}
                                    className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                                >
                                    <option value="" disabled>
                                        {t("profile.text_14")}
                                    </option>
                                    <option value="male">{t("profile.text_15")}</option>
                                    <option value="female">{t("profile.text_16")}</option>
                                </select>
                            </div>


                            {/* Nút hành động nằm cố định bên dưới */}
                            <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 pt-3 pb-4 z-10">
                                <div className="flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full px-4 py-2 border rounded-lg text-gray-700 dark:text-white dark:border-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                                    >
                                        {t("profile.text_17")}
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full px-5 py-2.5 rounded-lg text-white font-semibold transition bg-blue-600 hover:bg-blue-700"
                                    >
                                        {t("profile.text_18")}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </CheckMobilePhone>

        </>
    );
}
