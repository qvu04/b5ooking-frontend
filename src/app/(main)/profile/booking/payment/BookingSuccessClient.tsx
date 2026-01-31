"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { verifyPaymentOnlineService } from "@/app/api/payment-onlineService";

export default function BookingSuccessClient() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

    // 1. Dùng useRef để chặn việc gọi API 2 lần (quan trọng)
    const hasRan = useRef(false);

    useEffect(() => {
        // 2. Nếu không có session_id thì đá về trang chủ ngay
        if (!sessionId) {
            toast.error("Không tìm thấy thông tin thanh toán!");
            router.push("/");
            return;
        }

        // Nếu đã chạy rồi thì không chạy lại nữa
        if (hasRan.current) return;
        hasRan.current = true;

        const verifyPayment = async () => {
            try {
                const res = await verifyPaymentOnlineService(sessionId);

                if (res.data.data.paid) {
                    setStatus("success");
                    toast.success("Thanh toán thành công 🎉");
                } else {
                    setStatus("failed");
                    toast.error("Thanh toán chưa được xác nhận.");
                }
            } catch (error) {
                console.error(error);
                setStatus("failed");
                toast.error("Lỗi xác minh thanh toán.");
            } // ... bên trong finally
            finally {
                setTimeout(() => {
                    // CÁCH CŨ: router.push("/profile/booking"); 
                    // -> Dễ bị lỗi trên Vercel nếu router chưa sẵn sàng

                    // CÁCH MỚI: Ép trình duyệt chuyển hướng cứng
                    window.location.href = "/profile/booking";
                }, 2000);
            }
        };

        verifyPayment();

    }, [sessionId, router]);

    if (status === "loading") return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
            <p className="text-xl animate-pulse">⏳ Đang xác minh thanh toán...</p>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
            {status === "success" ? (
                <h1 className="text-3xl font-bold text-green-600 animate-bounce">
                    Thanh toán thành công 🎉
                </h1>
            ) : (
                <h1 className="text-3xl font-bold text-red-600">
                    Thanh toán thất bại ❌
                </h1>
            )}
            <p className="mt-4 text-gray-500">
                Đang chuyển hướng về danh sách đặt phòng...
            </p>
        </div>
    );
}