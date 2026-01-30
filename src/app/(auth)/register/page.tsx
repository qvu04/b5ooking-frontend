"use client";

import { registerService } from "@/app/api/authService";
import { RegisterUser } from "@/app/types/authType";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

type FormData = {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormData>();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const fetchUserRegister = async (formValues: FormData) => {
        try {
            const payload: RegisterUser = {
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                gender: formValues.gender,
                email: formValues.email,
                password: formValues.password,
                confirmPassword: formValues.confirmPassword,
            };
            const res = await registerService(payload);
            const user = res.data;
            console.log("✌️userRegister thành công:", user);
            toast.success("Đăng ký thành công");
            router.push("/login")
        } catch (error) {
            console.log("✌️Lỗi đăng ký:", error);
            toast.error("Đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    const onSubmit = (data: FormData) => {
        fetchUserRegister(data);
    };
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* VIDEO BACKGROUND */}
            <video
                className="absolute inset-0 z-0 w-full h-full object-cover"
                src="/videos/intro.mp4"
                autoPlay
                muted
                loop
                preload="none"
                playsInline
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/50 z-10" />

            {/* FORM + TITLE */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full px-4">
                {/* TIÊU ĐỀ */}
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-6 text-center">
                    {t("register.title")} <span className="text-[#6246ea]">B5ooking</span>
                </h1>

                {/* FORM */}
                <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 shadow-xl rounded-2xl p-10 w-full max-w-md">
                    <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-6">
                        {t("register.form_title")}
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* First + Last Name */}
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-black">{t("register.form_text_1")}</label>
                                <input
                                    type="text"
                                    {...register("firstName", { required: "Họ không được để trống" })}
                                    className={`mt-1 w-full px-4 py-2 rounded-xl border ${errors.firstName ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-transparent dark:text-white`}
                                    placeholder="Nguyen"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-black">{t("register.form_text_2")}</label>
                                <input
                                    type="text"
                                    {...register("lastName", { required: "Tên không được để trống" })}
                                    className={`mt-1 w-full px-4 py-2 rounded-xl border ${errors.lastName ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-transparent dark:text-white`}
                                    placeholder="Van A"
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-black">{t("register.form_text_3")}</label>
                            <select
                                {...register("gender", { required: "Vui lòng chọn giới tính" })}
                                className={`mt-1 w-full px-4 py-2 rounded-xl border ${errors.gender ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-transparent dark:text-white`}
                                defaultValue=""
                            >
                                <option value="" disabled>{t("register.form_text_4")}</option>
                                <option value="male">{t("register.form_male")}</option>
                                <option value="female">{t("register.form_female")}</option>
                            </select>
                            {errors.gender && (
                                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-black">{t("register.form_text_5")}</label>
                            <input
                                type="email"
                                {...register("email", { required: "Email không được để trống" })}
                                className={`mt-1 w-full px-4 py-2 rounded-xl border ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-transparent dark:text-white`}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-black">{t("register.form_text_6")}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", { required: "Mật khẩu không được để trống" })}
                                    className={`mt-1 w-full px-4 py-2 rounded-xl border ${errors.password ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10 dark:bg-transparent dark:text-white`}
                                    placeholder="••••••••"
                                />
                                <div
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-black"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </div>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-black">{t("register.form_text_7")}</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword", {
                                        required: "Vui lòng xác nhận mật khẩu",
                                        validate: (value) =>
                                            value === watch("password") || "Mật khẩu xác nhận không khớp",
                                    })}
                                    className={`mt-1 w-full px-4 py-2 rounded-xl border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10 dark:bg-transparent dark:text-white`}
                                    placeholder="••••••••"
                                />
                                <div
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-black"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </div>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#6246ea] cursor-pointer hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition-all duration-200"
                        >
                            {t("register.form_button")}
                        </button>
                    </form>

                    <p className="text-sm text-black mt-4 text-center">
                        {t("register.form_text_8")}{" "}
                        <Link href="/login" className="text-[#6246ea] hover:underline">{t("register.form_text_9")}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
