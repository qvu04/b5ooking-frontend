"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { loginGoogleService } from "@/app/api/authService";
import { setUserLoginAction } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function LoginWithGoogle() {
    const dispatch = useDispatch();
    const router = useRouter();
    const handleGoogleSuccess = async (credentialRes: any) => {
        const credential = credentialRes?.credential;
        if (!credential) return;

        try {
            const res = await loginGoogleService(credential);
            const { User, token_access } = res.data.data;

            const userData = {
                ...User,
                token_access,
            };

            // Lưu vào redux + localStorage
            dispatch(setUserLoginAction(userData));
            localStorage.setItem("user", JSON.stringify(userData));

            toast.success("Đăng nhập thành công");
            router.push("/");
        } catch (error) {
            toast.error("Đăng nhập thất bại");
            console.error("Google Login Failed!", error);
        }
    };


    return (
        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Google Login Failed!")}
        />
    );
}
