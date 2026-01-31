"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation"; // Bỏ useRouter vì dùng window.location
import toast from "react-hot-toast";
import { verifyPaymentOnlineService } from "@/app/api/payment-onlineService";

export default function BookingSuccessClient() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

    // Chặn gọi 2 lần
    const hasRan = useRef(false);

    useEffect(() => {
        // --- 1. KÍCH HOẠT BOM HẸN GIỜ (SAFETY REDIRECT) ---
        // Dù API có bị treo, đúng 4 giây sau nó sẽ tự chuyển trang.
        const safetyTimer = setTimeout(() => {
            console.log("⏰ Hết giờ! Ép buộc chuyển trang...");
            window.location.href = "/profile/booking";
        }, 4000);

        // --- 2. KIỂM TRA SESSION ID ---
        if (!sessionId) {
            toast.error("Không tìm thấy thông tin thanh toán!");
            // Không cần redirect ở đây nữa vì safetyTimer sẽ lo
            return;
        }

        if (hasRan.current) return;
        hasRan.current = true;

        const verifyPayment = async () => {
            try {
                console.log("🚀 Bắt đầu gọi API verify...");
                const res = await verifyPaymentOnlineService(sessionId);
                console.log("✅ API trả về:", res);

                if (res.data.data.paid) {
                    setStatus("success");
                    toast.success("Thanh toán thành công 🎉");
                } else {
                    setStatus("failed");
                    toast.error("Thanh toán chưa được xác nhận.");
                }
            } catch (error) {
                console.error("❌ Lỗi gọi API:", error);
                setStatus("failed");
                toast.error("Lỗi xác minh thanh toán.");
            }
            // Lưu ý: Không cần finally redirect nữa vì safetyTimer ở trên đã chạy rồi.
            // Nếu API chạy xong sớm hơn 4s, ta có thể clear timer cũ và redirect ngay lập tức (tuỳ chọn),
            // nhưng để an toàn cứ để safetyTimer lo liệu là chắc nhất.
        };

        verifyPayment();

        // Cleanup function: Nếu component bị unmount thì xóa timer (tránh memory leak)
        return () => clearTimeout(safetyTimer);

    }, [sessionId]);

    if (status === "loading") return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
            <p className="text-xl animate-pulse">⏳ Đang xác minh thanh toán...</p>
            <p className="text-sm text-gray-400 mt-2">Sẽ tự động chuyển trang sau vài giây...</p>
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