"use client";
import { useEffect, useState } from "react";
import { getAllBookingService } from "@/app/api/adminService";
import { BookingStatusEnum } from "@/app/types/bookingType";
import { BookingManger } from "@/app/types/adminType";
import { Pagination } from "@/app/types/blogType";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import Image from 'next/image';

export default function BookingsManager() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<BookingStatusEnum | "ALL">("ALL");
    const [booking, setBooking] = useState<BookingManger[]>([]);
    const [pagination, setPagination] = useState<Pagination>();

    const fetchAllBooking = async () => {
        try {
            const res = await getAllBookingService(page, status);
            setBooking(res.data.data.bookings);
            setPagination(res.data.data.pagination);
        } catch (error) {
            console.log("Error fetching bookings:", error);
        }
    };

    useEffect(() => {
        fetchAllBooking();
    }, [page, status]);


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
                {/* Header */}
                <h2 className="text-2xl font-bold text-[#6246ea] mb-6">Quản lý phòng đã đặt</h2>

                {/* Filter */}
                <div className="flex flex-col sm:flex-row justify-start items-center mb-6 gap-4">
                    <Select
                        value={status}
                        onValueChange={(value) => {
                            setPage(1); // reset page
                            setStatus(value as BookingStatusEnum | "ALL");
                        }}
                    >
                        <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL" className="hover:bg-purple-100 transition-colors">Tất cả</SelectItem>
                            <SelectItem value="CANCELED" className="hover:bg-purple-100 transition-colors">Đã hủy</SelectItem>
                            <SelectItem value="FINISHED" className="hover:bg-purple-100 transition-colors">Hoàn tất</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-100">
                <table className="min-w-[900px] w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-center text-gray-700">
                            <th className="p-4 border">Ảnh phòng</th>
                            <th className="p-4 border">Tên phòng</th>
                            <th className="p-4 border">Giá</th>
                            <th className="p-4 border">Loại phòng</th>
                            <th className="p-4 border">Số lượng khách</th>
                            <th className="p-4 border">Tên người đặt</th>
                            <th className="p-4 border">Ngày đến</th>
                            <th className="p-4 border">Ngày đi</th>
                            <th className="p-4 border">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {booking.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-3 border">
                                    <Image
                                        src={b.room.image ?? ""}
                                        alt={b.room.name}
                                        width={500}
                                        height={300}
                                        className="w-40 h-28 object-cover rounded-lg shadow-md transition-transform hover:scale-105"
                                    />
                                </td>
                                <td className="p-3 border">{b.room.name}</td>
                                <td className="p-3 border">{b.totalPrice.toLocaleString()}₫</td>
                                <td className="p-3 border truncate max-w-[200px]">{b.room.type}</td>
                                <td className="p-3 border">{b.guests}</td>
                                <td className="p-3 border">{b.user.fullName}</td>
                                <td className="p-3 border">{new Date(b.checkIn).toLocaleDateString('vi-VN')}</td>
                                <td className="p-3 border">{new Date(b.checkOut).toLocaleDateString('vi-VN')}</td>
                                <td className="p-3 border">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white font-medium ${b.status === "PENDING" ? "bg-yellow-500" :
                                            b.status === "CONFIRMED" ? "bg-blue-500" :
                                                b.status === "CANCELED" ? "bg-red-500" :
                                                    b.status === "FINISHED" ? "bg-green-500" : "bg-gray-400"
                                            }`}
                                    >
                                        {b.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-40"
                    >
                        ← Trước
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        const isActive = pageNumber === pagination.page;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className={`w-9 h-9 rounded-lg border transition font-medium ${isActive
                                    ? "bg-[#7f5af0] text-white border-[#7f5af0]"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-40"
                    >
                        Sau →
                    </button>
                </div>
            )}
        </div>
    );
}
