"use client";

import { postCreateHotelService } from "@/app/api/adminService";
import { AmenityType } from "@/app/types/amenityType";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Select } from "antd";
import { ImagePlus, X } from "lucide-react";

type Props = {
    onSuccess: () => void;
    amenities: AmenityType[];
};

export default function CreateHotelForm({ onSuccess, amenities }: Props) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [locationId, setLocationId] = useState<number>(1);
    const [defaultRating, setDefaultRating] = useState<number>(3);
    const [selectedAmenity, setSelectedAmenity] = useState<number[]>([]);
    const [imageFile, setImageFile] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const MAX_IMAGES = 8;

    const handleFilesSelected = (files: FileList | null) => {
        if (!files) return;
        const filesArray = Array.from(files);

        setImageFile((prev) => {
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
        setImageFile((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (imageFile.length === 0) {
            toast.error("Vui lòng chọn ít nhất một ảnh!");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("description", description);
        formData.append("locationId", locationId.toString());
        formData.append("defaultRating", defaultRating.toString());
        selectedAmenity.forEach((id) => formData.append("amenities", id.toString()));
        imageFile.forEach((file) => formData.append("imageFile", file));

        try {
            await postCreateHotelService(formData);
            toast.success("Tạo khách sạn thành công");

            setName("");
            setAddress("");
            setDescription("");
            setLocationId(1);
            setDefaultRating(3);
            setSelectedAmenity([]);
            setImageFile([]);

            onSuccess();
        } catch (error) {
            console.error("✌️error --->", error);
            toast.error("Tạo khách sạn thất bại");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto bg-white p-6 shadow-md rounded-xl"
        >
            {/* 2 cột chính */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cột trái: Thông tin cơ bản */}
                <div className="flex-1 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tên khách sạn
                            </label>
                            <input
                                type="text"
                                placeholder="Tên khách sạn"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7f5af0]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                placeholder="Địa chỉ"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7f5af0]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Khu vực (locationId)
                            </label>
                            <input
                                type="number"
                                placeholder="Khu vực"
                                value={locationId}
                                onChange={(e) => setLocationId(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7f5af0]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Rating mặc định
                            </label>
                            <input
                                type="number"
                                placeholder="Rating mặc định"
                                value={defaultRating}
                                onChange={(e) => setDefaultRating(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7f5af0]"
                            />
                        </div>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mô tả
                        </label>
                        <textarea
                            placeholder="Mô tả chi tiết về khách sạn"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7f5af0]"
                            rows={5}
                            required
                        />
                    </div>

                    {/* Tiện nghi */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Tiện nghi
                        </label>
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Chọn tiện nghi"
                            value={selectedAmenity}
                            onChange={(values) => setSelectedAmenity(values)}
                            className="w-full"
                            options={amenities.map((a) => ({ label: a.name, value: a.id }))}
                        />
                    </div>
                </div>

                {/* Cột phải: Upload ảnh */}
                <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                        Hình ảnh khách sạn
                    </h3>

                    {/* Ô upload ảnh */}
                    <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#7f5af0] hover:bg-gray-50 transition relative">
                        <label className="cursor-pointer flex flex-col items-center justify-center space-y-3 h-full">
                            <div className="bg-[#f3f1ff] p-3 rounded-full">
                                <ImagePlus className="text-[#7f5af0]" size={36} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Kéo thả hoặc <span className="text-[#7f5af0]">chọn ảnh</span> để tải lên
                                </p>
                                <p className="text-xs text-gray-500">Hỗ trợ định dạng JPG, PNG (tối đa 5MB)</p>
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

                        {/* Số lượng ảnh */}
                        {imageFile.length > 0 && (
                            <p className="absolute top-2 right-3 text-xs text-gray-500">
                                {imageFile.length} / {MAX_IMAGES} ảnh
                            </p>
                        )}
                    </div>

                    {/* Preview ảnh */}
                    {imageFile.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            {imageFile.map((file, index) => (
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

            {/* Nút tạo */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-[#7f5af0] hover:bg-[#684de0] text-white font-semibold px-6 py-2 rounded-lg  transition duration-200"
                >
                    Tạo mới
                </button>
            </div>
        </form>
    );
}
