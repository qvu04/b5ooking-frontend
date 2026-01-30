"use client";
import React from "react";
import { AiResponseBooking as AiBookingType } from "@/app/types/aiType";

const AiResponseBooking: React.FC<{ data: AiBookingType['data'] }> = ({ data }) => {
    // Nếu data là mảng (không hợp lệ ở đây) hoặc rỗng thì không render
    if (!data || Array.isArray(data)) return <div className="text-red-500 mt-2">Hiện bạn chưa có lịch sử đặt phòng nào</div>;

    // Kiểm tra bookings có tồn tại không
    const bookings = data.bookings || [];
    const totalAmount = data.totalAmount;
    const text = data.text;

    if (bookings.length === 0) {
        return (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
                {text || "Bạn chưa có đơn đặt phòng nào."}
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            {text && <p className="text-gray-700 mb-3">{text}</p>}

            <ul className="space-y-4">
                {bookings.map((b: any) => (
                    <li key={b.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-gray-800">
                                {b.room?.name || "Tên phòng không rõ"}
                            </h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${b.status === "FINISHED" ? "bg-green-100 text-green-700" :
                                b.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                    b.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                                        "bg-red-100 text-red-700"
                                }`}>
                                {b.status}
                            </span>
                        </div>

                        <p className="text-xs text-gray-600 mb-1">
                            Khách sạn: <span className="font-medium">{b.room?.hotel?.name}</span>
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                            Địa chỉ: {b.room?.hotel?.address || "Không rõ"}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                            Trạng thái thanh toán:{" "}
                            <span className={`font-medium ${b.paymentStatus === "PAID" ? "text-green-600" : "text-red-500"}`}>
                                {b.paymentStatus}
                            </span>
                        </p>
                        <p className="text-xs text-gray-800 font-semibold">
                            Tổng giá: {b.totalPrice?.toLocaleString()} VND
                        </p>
                    </li>
                ))}
            </ul>

            {totalAmount && (
                <div className="mt-4 border-t pt-2 text-sm text-gray-700">
                    <strong>Tổng cộng: </strong>{totalAmount.toLocaleString()} VND
                </div>
            )}
        </div>
    );
};

export default AiResponseBooking;
