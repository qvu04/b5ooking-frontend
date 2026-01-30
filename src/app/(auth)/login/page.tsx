"use client";
import { loginService } from "@/app/api/authService";
import { LoginUser } from "@/app/types/authType";
import { setUserLoginAction } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hook";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import LoginWithGoogle from "./google-login/LoginWithGoogle";

type FormData = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const fetchUserLogin = async (formValues: { taiKhoan: string; matKhau: string }) => {
        try {
            const payLoad: LoginUser = {
                email: formValues.taiKhoan,
                password: formValues.matKhau
            };
            const res = await loginService(payLoad);
            console.log('✌️resDataLogin --->', res);
            const { User, token_access } = res.data.data;
            const userData = {
                ...User,
                token_access,
            };
            localStorage.setItem('user', JSON.stringify(userData));
            dispatch(setUserLoginAction(userData));
            toast.success("Đăng nhập thành công");
            router.push("/");
        } catch (error) {
            console.log('Lỗi đăng nhập:', error);
            toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        }
    };

    const onSubmit = (data: FormData) => {
        fetchUserLogin({
            taiKhoan: data.email,
            matKhau: data.password
        });
    };
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* VIDEO BACKGROUND */}
            <div>
                <video
                    src="/videos/intro.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            </div>
            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/50 z-10" />
            {/* LOGIN FORM CENTERED */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 ">
                {/* Chào mừng */}
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-6">
                    {t("login.title")} <span className="text-[#6246ea]">B5ooking</span>
                </h1>

                {/* FORM LOGIN */}
                <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-white/20">
                    <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-6">
                        {t("login.form_title")}
                    </h2>

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-black">{t("login.form_email")}</label>
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
                            <label className="block text-sm font-medium text-black">{t("login.form_password")}</label>
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

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full bg-[#6246ea] cursor-pointer mb-5 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition-all duration-200"
                        >
                            {t("login.form_button")}
                        </button>
                    </form>
                    <LoginWithGoogle />
                    <p className="text-sm text-black mt-4 text-center">
                        {t("login.form_text_1")}{" "}
                        <Link href="/register" className="text-[#6246ea] hover:underline">
                            {t("login.form_text_2")}
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    );
}
