"use client";
import React from "react";
import { AiResponse } from "@/app/types/aiType";

const AiResponseRoom: React.FC<AiResponse> = ({ data }) => {
    if (!data || data.length === 0)
        return (
            <div className="text-red-500 mt-3 text-sm font-medium italic">
                Hiện chưa có thông tin phòng.
            </div>
        );

    const isList = data.length > 1;
    const room = data[0];

    return (
        <div className="mt-3 text-sm text-gray-800 dark:text-gray-200 space-y-3">
            {isList ? (
                // --- Danh sách phòng ---
                <div className="bg-white/60 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h4 className="text-base font-semibold mb-2 text-blue-600 dark:text-blue-400">
                        Danh sách phòng
                    </h4>
                    <ul className="space-y-2">
                        {data.map((r) => (
                            <li
                                key={r.id}
                                className="bg-gray-50 dark:bg-gray-800/70 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow transition-all"
                            >
                                <div className="font-semibold text-gray-900 dark:text-white">
                                    {r.name}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {r.type}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                // --- Chi tiết 1 phòng ---
                <div className="bg-white/70 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all">
                    <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                        {room.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                        <p>
                            <strong>Giá:</strong>{" "}
                            <span className="text-green-600 dark:text-green-400 font-semibold">
                                {room.price.toLocaleString()} VNĐ
                            </span>
                        </p>
                        <p>
                            <strong>Khách tối đa:</strong> {room.maxGuests}
                        </p>
                        <p>
                            <strong>Loại phòng:</strong> {room.type}
                        </p>
                        {room.discount === 0 ? (
                            <p className="col-span-2 text-gray-600 dark:text-gray-400">
                                <strong>Không có chương trình giảm giá</strong>
                            </p>
                        ) : (
                            <p className="col-span-2">
                                <strong>Giảm giá:</strong>{" "}
                                <span className="text-red-500 dark:text-red-400 font-semibold">
                                    {room.discount}%
                                </span>
                            </p>
                        )}
                    </div>

                    {room.description && (
                        <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-400">
                            “{room.description}”
                        </p>
                    )}

                    {room.image && (
                        <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-36 object-cover rounded-lg mt-3 shadow-sm hover:scale-[1.02] transition-transform duration-200"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default AiResponseRoom;
