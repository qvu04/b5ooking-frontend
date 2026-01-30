"use client";

import { useState, useRef, useEffect } from "react";
import { putUpdateBlogService } from "@/app/api/adminService";
import { BlogDetailManager } from "@/app/types/adminType";
import toast from "react-hot-toast";
import { ImagePlus, X } from "lucide-react";

type Props = {
    onSuccess: () => void;
    blogId: number;
    blogData: BlogDetailManager;
};

export default function UpdateBlogForm({ onSuccess, blogId, blogData }: Props) {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [locationId, setLocationId] = useState<number>(1);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const MAX_IMAGES = 6;

    useEffect(() => {
        if (blogData) {
            setTitle(blogData.title || "");
            setSummary(blogData.summary || "");
            setContent(blogData.content || "");
            setAuthor(blogData.author || "");
            setLocationId(blogData.location?.id || 1);
        }
    }, [blogData]);

    const handleFilesSelected = (files: FileList | null) => {
        if (!files) return;
        const filesArray = Array.from(files);

        setImageFiles((prev) => {
            const existing = prev ?? [];
            const newOnes = filesArray.filter(
                (f) => !existing.some((e) => e.name === f.name && e.size === f.size)
            );
            const merged = [...existing, ...newOnes].slice(0, MAX_IMAGES);
            if (merged.length >= MAX_IMAGES) {
                toast.error(`Chỉ được chọn tối đa ${MAX_IMAGES} ảnh`);
            }
            return merged;
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("summary", summary);
        formData.append("content", content);
        formData.append("author", author);
        formData.append("locationId", locationId.toString());
        imageFiles.forEach((file) => formData.append("imageFile", file));

        try {
            await putUpdateBlogService(blogId, formData);
            toast.success("Cập nhật bài viết thành công");
            onSuccess();
            setImageFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("✌️ Update blog error:", error);
            toast.error("Cập nhật bài viết thất bại");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto"
        >
            <div className="flex flex-col md:flex-row gap-6">
                {/* CỘT TRÁI - THÔNG TIN BÀI VIẾT */}
                <div className="flex-1 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Thông tin cơ bản
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tiêu đề
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7f5af0]"
                            placeholder="Nhập tiêu đề bài viết"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mô tả ngắn
                        </label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full h-[120px] focus:ring-2 focus:ring-[#7f5af0]"
                            placeholder="Tóm tắt nội dung bài viết"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nội dung bài viết
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full h-[220px] focus:ring-2 focus:ring-[#7f5af0]"
                            placeholder="Nội dung chi tiết của bài viết"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tác giả
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7f5af0]"
                                placeholder="Tên tác giả"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Khu vực (locationId)
                            </label>
                            <input
                                type="number"
                                value={locationId}
                                onChange={(e) => setLocationId(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7f5af0]"
                            />
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI - HÌNH ẢNH */}
                <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                        Hình ảnh bài viết
                    </h3>

                    {/* Ô upload ảnh */}
                    <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#7f5af0] hover:bg-gray-50 transition relative">
                        <label className="cursor-pointer flex flex-col items-center justify-center space-y-3 h-full">
                            <div className="bg-[#f3f1ff] p-3 rounded-full">
                                <ImagePlus className="text-[#7f5af0]" size={36} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Kéo thả hoặc{" "}
                                    <span className="text-[#7f5af0]">chọn ảnh</span> để tải lên
                                </p>
                                <p className="text-xs text-gray-500">
                                    Hỗ trợ JPG, PNG (tối đa {MAX_IMAGES} ảnh)
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleFilesSelected(e.target.files)}
                                className="hidden"
                            />
                        </label>

                        {imageFiles.length > 0 && (
                            <p className="absolute top-2 right-3 text-xs text-gray-500">
                                {imageFiles.length} / {MAX_IMAGES} ảnh
                            </p>
                        )}
                    </div>

                    {/* Preview ảnh */}
                    {imageFiles.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            {imageFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Ảnh ${index + 1}`}
                                        className="w-full h-32 object-cover transform group-hover:scale-105 transition duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-6 text-right">
                <button
                    type="submit"
                    className="bg-[#7f5af0] hover:bg-[#684de0] text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                    Lưu
                </button>
            </div>
        </form>
    );
}
