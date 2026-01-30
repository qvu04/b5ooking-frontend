"use client";
import { AiResponse } from "@/app/types/aiType";
import Link from "next/link";
import React from "react";

const AiResponseHotel: React.FC<AiResponse> = ({ data }) => {
    if (!data || data.length === 0)
        return (
            <div className="text-red-500 mt-3 text-sm font-medium italic">
                Hiện chưa có thông tin khách sạn.
            </div>
        );

    const hotel = data[0];
    const isList = data.length > 1;

    return (
        <div className="mt-3 text-sm text-gray-800 dark:text-gray-200 space-y-3">
            {isList ? (
                // --- Danh sách khách sạn ---
                <div className="bg-white/70 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all">
                    <h4 className="text-base font-semibold mb-2 text-blue-600 dark:text-blue-400">
                        Danh sách khách sạn
                    </h4>
                    <ul className="space-y-2">
                        {data.map((h) => (
                            <Link href={`/hotel/${h.id}`} key={h.id} className="px-2">
                                <li
                                    className="bg-gray-50 dark:bg-gray-800/70 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                        {h.name}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        📍 {h.location?.city}
                                    </div>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            ) : (
                // --- Thông tin chi tiết khách sạn ---
                <div className="bg-white/70 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all">
                    <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                        {hotel.name}
                    </h4>

                    <div className="space-y-1">
                        <p>
                            <strong>📍 Địa chỉ:</strong> {hotel.address}
                        </p>
                        <p>
                            <strong>🏙 Thành phố:</strong> {hotel.location?.city}
                        </p>
                        <p>
                            <strong>⭐ Đánh giá trung bình:</strong>{" "}
                            <span className="text-yellow-500 dark:text-yellow-400 font-medium">
                                {hotel.averageRating}
                            </span>
                        </p>
                        {hotel.description && (
                            <p className="mt-1 text-sm italic text-gray-600 dark:text-gray-400">
                                “{hotel.description}”
                            </p>
                        )}
                    </div>

                    {hotel.image && (
                        <div className="relative mt-3">
                            <img
                                src={hotel.image}
                                alt={hotel.name}
                                className="w-full h-36 object-cover rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200"
                            />
                            <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-gray-900/80 text-xs px-2 py-1 rounded-lg text-gray-800 dark:text-gray-200 shadow-sm">
                                {hotel.location?.city}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AiResponseHotel;
