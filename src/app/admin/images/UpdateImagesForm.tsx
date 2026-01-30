"use client";
import { useState } from "react";
import { Modal, Select } from "antd";
import toast from "react-hot-toast";
import { putUpdateImagesHotel, putUpdateImagesRoom } from "@/app/api/adminService";
import { ImageItem } from "@/app/types/adminType";
import { ImagePlus } from "lucide-react";

const { Option } = Select;

type Props = {
    open: boolean;
    onClose: () => void;
    activeTab: "hotel" | "room";
    selectedImage: ImageItem | null;
    filterOptions: [number, string][];
    onSuccess: () => void;
};

export default function UpdateImagesForm({
    open,
    onClose,
    activeTab,
    filterOptions,
    onSuccess,
}: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // 🔹 Khi người dùng chọn ảnh mới
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setImageFiles(files);

        // Hiển thị preview ảnh
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(previews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedId || imageFiles.length === 0) {
            toast.error("Vui lòng chọn đối tượng và ít nhất một ảnh để cập nhật!");
            return;
        }

        const formData = new FormData();
        imageFiles.forEach((file) => {
            formData.append("imageFile", file);
        });

        try {
            if (activeTab === "hotel") {
                await putUpdateImagesHotel(selectedId, formData);
            } else {
                await putUpdateImagesRoom(selectedId, formData);
            }

            toast.success("Cập nhật ảnh thành công!");
            onClose();
            onSuccess();

            // Reset state
            setSelectedId(null);
            setImageFiles([]);
            setPreviewUrls([]);
        } catch (error) {
            console.error(error);
            toast.error("Không thể cập nhật ảnh");
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center justify-center gap-2 text-lg font-semibold">
                    <ImagePlus className="text-[#7f5af0]" />
                    <span>Cập nhật ảnh {activeTab === "hotel" ? "khách sạn" : "phòng"}</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            centered
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Chọn khách sạn hoặc phòng */}
                <div>
                    <label className="block font-medium mb-1">
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
                </div>

                {/* Upload ảnh */}
                <div>
                    <label className="block font-medium mb-1">Chọn ảnh mới</label>

                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#f5a623] transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Nhấn để chọn ảnh (có thể chọn nhiều ảnh)</p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    {/* Preview ảnh */}
                    {previewUrls.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={url}
                                        alt={`preview-${index}`}
                                        className="w-full h-24 object-cover rounded-md border border-gray-200"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="text-sm text-gray-500 mt-1">
                        Ảnh mới sẽ thay thế ảnh cũ.{" "}
                        {activeTab === "hotel" ? "Tối đa 30 ảnh." : "Tối đa 5 ảnh."}
                    </p>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="bg-[#7f5af0] hover:bg-[#6f4ae0] text-white px-4 py-2 rounded w-full"
                >
                    Cập nhật ảnh
                </button>
            </form>
        </Modal>
    );
}
