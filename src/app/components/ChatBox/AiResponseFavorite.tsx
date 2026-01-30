"use client"
import React from "react"
import { AiResponse } from "@/app/types/aiType"

const AiResponseFavorite: React.FC<AiResponse> = ({ data }) => {
    if (!data || data.length === 0) return <div className="text-red-500 mt-2">Hiện chưa có phòng được bạn yêu thích</div>;



    return (
        <div className="p-4">

            <ul className="gap-4">
                {data.map((favorite, index) => {
                    const hotel = favorite.hotel || favorite // fallback nếu API trả trực tiếp hotel
                    return (
                        <li
                            key={index}
                            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
                        >
                            <img
                                src={hotel.image || hotel.img || "/no-image.jpg"}
                                alt={hotel.name}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-3">
                                <h3 className="font-semibold text-gray-800 text-sm">{hotel.name}</h3>
                                <p className="text-xs text-gray-500">
                                    {hotel.city || hotel.address || "Không rõ địa chỉ"}
                                </p>
                                {hotel.rating && (
                                    <p className="text-yellow-500 text-xs mt-1">
                                        ⭐ {hotel.rating}
                                    </p>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default AiResponseFavorite
