"use client";

import { useState } from "react";
import { Modal, Select } from "antd";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { https } from "@/app/api/configService";
import { FaCloudUploadAlt } from "react-icons/fa";

const { Option } = Select;

type Props = {
    open: boolean;
    onClose: () => void;
    activeTab: "hotel" | "room";
    filterOptions: [number, string][];
    onSuccess: () => void;
};

export default function CreateImagesForm({
    open,
    onClose,
    activeTab,
    filterOptions,
    onSuccess,
}: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const maxImages = activeTab === "hotel" ? 30 : 5;

    // 🟣 React Dropzone setup
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [] },
        multiple: true,
        onDrop: (acceptedFiles) => {
            if (imageFiles.length + acceptedFiles.length > maxImages) {
                toast.error(`Chỉ được chọn tối đa ${maxImages} ảnh`);
                return;
            }
            setImageFiles((prev) => [...prev, ...acceptedFiles]);
        },
    });

    const handleRemoveImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedId) {
            toast.error("Vui lòng chọn khách sạn hoặc phòng");
            return;
        }

        if (imageFiles.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 ảnh");
            return;
        }

        const formData = new FormData();
        imageFiles.forEach((file) => formData.append("imageFile", file));

        const endpoint =
            activeTab === "hotel"
                ? `/api/admin/addHotelImage/${selectedId}`
                : `/api/admin/addRoomImage/${selectedId}`;

        try {
            setLoading(true);
            await https.post(endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Thêm ảnh thành công!");
            setImageFiles([]);
            setSelectedId(null);
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Không thể thêm ảnh");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            className="rounded-xl"
            title={
                <div className="flex items-center gap-2">
                    <FaCloudUploadAlt className="text-[#7f5af0] text-2xl" />
                    <h2 className="text-lg font-semibold text-gray-800">
                        Thêm ảnh phụ {activeTab === "hotel" ? "khách sạn" : "phòng"}
                    </h2>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6 p-2">
                {/* Grid chia 2 cột */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bên trái: chọn khách sạn/phòng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {activeTab === "hotel" ? "Chọn khách sạn" : "Chọn phòng"}
                        </label>
                        <Select
                            className="w-full"
                            placeholder={`Chọn ${activeTab}`}
                            value={selectedId || undefined}
                            onChange={(value) => setSelectedId(value)}
                        >
                            {filterOptions.map(([id, name]) => (
                                <Option key={id} value={id}>
                                    {name}
                                </Option>
                            ))}
                        </Select>

                        <p className="text-xs text-gray-500 mt-2">
                            Vui lòng chọn {activeTab === "hotel" ? "khách sạn" : "phòng"} muốn thêm ảnh.
                        </p>
                    </div>

                    {/* Bên phải: upload ảnh */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tải lên ảnh ({imageFiles.length}/{maxImages})
                        </label>

                        {/* Drag & Drop zone */}
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition 
                            ${isDragActive
                                    ? "border-[#7f5af0] bg-[#f5f3ff]"
                                    : "border-gray-300 hover:border-[#7f5af0]"}`}
                        >
                            <input {...getInputProps()} />
                            <p className="text-gray-600 text-sm">
                                {isDragActive
                                    ? "Thả ảnh vào đây..."
                                    : "Kéo & thả ảnh hoặc nhấn để chọn ảnh"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Hỗ trợ JPG, PNG, JPEG
                            </p>
                        </div>

                        {/* Preview ảnh */}
                        {imageFiles.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {imageFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative group rounded-md overflow-hidden border border-gray-200"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview-${index}`}
                                            className="w-full h-24 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-black/50 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center gap-2 bg-[#7f5af0] text-white py-2.5 rounded-lg hover:bg-[#6f4ae0] transition font-medium ${loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                >
                    {loading && (
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                    )}
                    {loading ? "Đang tải..." : "Thêm ảnh"}
                </button>
            </form>
        </Modal>
    );
}
