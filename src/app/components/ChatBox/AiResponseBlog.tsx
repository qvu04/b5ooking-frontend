"use client";
import { AiResponse } from "@/app/types/aiType";
import React from "react";

const AiResponseBlog: React.FC<AiResponse> = ({ data }) => {
    if (!data || data.length === 0) return <div className="text-red-500 mt-2">Hiện chưa có thông tin</div>;
    return (
        <div className="p-4">

            <ul className="gap-4">
                {data.map((blog, index) => {
                    return (
                        <li
                            key={index}
                            className="bg-white m-3 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
                        >
                            <img
                                src={blog.image}
                                alt={blog.content}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-3">
                                <h3 className="font-semibold text-gray-800 text-sm">Tác giả: {blog.author}</h3>
                                <p className="text-gray-500 text-xs mt-1">Thành phố: {blog.location.city}</p>
                                {blog.summary && (
                                    <p className="text-gray-500 text-xs mt-1">
                                        {blog.summary}
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
export default AiResponseBlog;