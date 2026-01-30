"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { verifyPaymentOnlineService } from "@/app/api/payment-onlineService";

export default function BookingSuccess() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

    useEffect(() => {
        if (sessionId) {
            verifyPaymentOnlineService(sessionId)
                .then((res) => {
                    if (res.data.data.paid) {
                        setStatus("success");
                        toast.success("Thanh toán thành công 🎉");
                    } else {
                        setStatus("failed");
                        toast.error("Thanh toán chưa được xác nhận.");
                    }

                    // 👉 Redirect về trang bookings để reload lại list
                    setTimeout(() => {
                        router.push("/profile/booking");
                    }, 2000);
                })
                .catch(() => {
                    setStatus("failed");
                    toast.error("Lỗi xác minh thanh toán.");
                    setTimeout(() => {
                        router.push("/profile/booking");
                    }, 2000);
                });
        }
    }, [sessionId, router]);

    if (status === "loading") return <p>Đang xác minh thanh toán...</p>;

    return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
            {status === "success" ? (
                <h1 className="text-3xl font-bold text-green-600">Thanh toán thành công 🎉</h1>
            ) : (
                <h1 className="text-3xl font-bold text-red-600">Thanh toán thất bại ❌</h1>
            )}
            <p className="mt-4 text-gray-500">Đang chuyển hướng về danh sách đặt phòng...</p>
        </div>
    );
}
