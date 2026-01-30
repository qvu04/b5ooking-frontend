"use client";
import { useEffect, useState } from "react";
import { getTotalService } from "@/app/api/adminService";
import { FaHotel, FaDollarSign, FaDoorOpen, FaUsers } from "react-icons/fa";
import { TotalPayment } from "@/app/types/adminType";

export default function TotalBill() {
    const [data, setData] = useState<TotalPayment>({
        totalHotel: 0,
        totalRevenueBooking: 0,
        totalRoom: 0,
        totalUser: 0,
    });
    const getAllPayment = async () => {
        try {
            const res = await getTotalService();
            setData(res.data.data)
            console.log('✌️res --->', res);
        } catch (error) {
            console.log('✌️error --->', error);

        }
    }
    useEffect(() => {
        getAllPayment()
    }, [])
    const cardList = [
        {
            title: "Tổng số khách sạn",
            value: data.totalHotel,
            icon: <FaHotel className="text-blue-500 text-xl" />,
            change: "+1.23%",
        },
        {
            title: "Tổng số doanh thu",
            value: new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(data.totalRevenueBooking),
            icon: <FaDollarSign className="text-green-500 text-xl" />,
            change: "+3.45%",
        },
        {
            title: "Tổng số phòng ở",
            value: data.totalRoom,
            icon: <FaDoorOpen className="text-purple-500 text-xl" />,
            change: "+2.01%",
        },
        {
            title: "Tổng số người dùng",
            value: data.totalUser,
            icon: <FaUsers className="text-orange-500 text-xl" />,
            change: "+0.95%",
        },
    ];
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Tổng quan về B5ooking</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cardList.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition"
                    >
                        <div>
                            <p className="text-gray-500">{item.title}</p>
                            <h3 className="text-lg font-bold">{item.value}</h3>
                            <p className="text-green-500 text-sm">{item.change} ↑</p>
                        </div>
                        <div className="ml-4">{item.icon}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}