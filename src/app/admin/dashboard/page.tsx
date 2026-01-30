"use client"
import { useState } from "react";
import { reportService } from "@/app/api/reportService";
import TotalBill from "@/app/components/TotalBill/page";
import RevenueBarChart from "@/app/components/RevenueChart/page";
import RevenuePieChart from "@/app/components/RevenuePieChart/page";

export default function DashboardAdmin() {
    const [fromDate, setFromDate] = useState("2025-01-01");
    const [toDate, setToDate] = useState("2025-12-31");

    const handleExportPDF = () => {
        reportService(fromDate, toDate);
    };

    return (
        <div className="h-200 flex flex-col overflow-hidden p-6 space-y-6">
            {/* Header + chọn ngày + nút xuất PDF */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 flex-shrink-0">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Báo cáo doanh thu
                </h1>

                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border px-3 py-2 rounded-lg"
                    />
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border px-3 py-2 rounded-lg"
                    />
                    <button
                        onClick={handleExportPDF}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
                    >
                        Xuất PDF
                    </button>
                </div>
            </div>

            {/* Tổng doanh thu */}
            <div className="flex-shrink-0">
                <TotalBill />
            </div>

            {/* Biểu đồ (chiếm phần còn lại của màn hình) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 h-full gap-6 flex-grow">
                <RevenueBarChart />
                <RevenuePieChart />
            </div>
        </div>
    );
}

