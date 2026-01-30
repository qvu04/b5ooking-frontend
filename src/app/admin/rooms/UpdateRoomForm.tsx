"use client";

import { RoomDetailManager } from "@/app/types/adminType";
import { useState, useRef, useEffect } from "react";
import { AmenityType } from "@/app/types/amenityType";
import {
    getAllAmenitiesService,
    putUpdateRoomService,
} from "@/app/api/adminService";
import toast from "react-hot-toast";
import { Select } from 'antd';
import { ImagePlus, X } from 'lucide-react';

type Props = {
    roomData: RoomDetailManager;
    roomId: number;
    onSuccess: () => void;
};

export default function UpdateRoomForm({ roomData, roomId, onSuccess }: Props) {
    const [name, setName] = useState("");
    const [hotelId, setHotelId] = useState<number>(1);
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState<number>(0);
    const [maxGuests, setMaxGuests] = useState<number>(0);
    const [selectedAmenity, setSelectedAmenity] = useState<number[]>([]);
    const [imageFile, setImageFile] = useState<File[]>([]);
    const [allAmenities, setAllAmenities] = useState<AmenityType[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const res = await getAllAmenitiesService();
                setAllAmenities(res.data.data.amenities);
            } catch (error) {
                console.log("✌️error --->", error);
            }
        };
        fetchAmenities();
    }, []);

    useEffect(() => {
        if (roomData) {
            setName(roomData.name || "");
            setType(roomData.type || "");
            setDescription(roomData.description || "");
            setPrice(roomData.price || 0);
            setDiscount(roomData.discount || 0);
            setMaxGuests(roomData.maxGuests || 0);
            setSelectedAmenity(roomData.amenities?.map((a) => a.amenityId) || []);
            setHotelId(roomData.hotelId || 3);
        }
    }, [roomData]);
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
        setImageFile(prev => prev.filter((_, i) => i !== index));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("hotelId", hotelId.toString());
        formData.append("type", type);
        formData.append("description", description);
        formData.append("price", price.toString());
        formData.append("discount", discount.toString());
        formData.append("maxGuests", maxGuests.toString());
        selectedAmenity.forEach((id) => {
            formData.append("amenities", id.toString());
        });
        imageFile.forEach(file => formData.append("imageFile", file));

        try {
            await putUpdateRoomService(roomId, formData);
            toast.success("Cập nhật phòng thành công!");
            onSuccess();
            if (fileInputRef.current) fileInputRef.current.value = "";
            setImageFile([]);
        } catch (error) {
            console.log("✌️error --->", error);
            toast.error("Cập nhật phòng thất bại!");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto"
        >
            <div className="flex flex-col md:flex-row gap-6">
                {/* CỘT TRÁI - THÔNG TIN PHÒNG */}
                <div className="flex-1 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Thông tin phòng
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tên phòng
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                            placeholder="Nhập tên phòng..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Loại phòng
                        </label>
                        <input
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                            placeholder="Loại phòng..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mô tả
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                            placeholder="Nhập mô tả về phòng..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Giá phòng
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Giảm giá (%)
                            </label>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Số khách tối đa
                            </label>
                            <input
                                type="number"
                                value={maxGuests}
                                onChange={(e) => setMaxGuests(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Hotel ID
                            </label>
                            <input
                                type="number"
                                value={hotelId}
                                onChange={(e) => setHotelId(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#7f5af0]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Tiện nghi</label>
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Chọn tiện nghi"
                            value={selectedAmenity}
                            onChange={(values) => setSelectedAmenity(values)}
                            className="w-full"
                            options={allAmenities.map(a => ({ label: a.name, value: a.id }))}
                        />
                    </div>
                </div>

                {/* CỘT PHẢI - UPLOAD HÌNH ẢNH */}
                <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                        Hình ảnh phòng
                    </h3>

                    {/* Ô upload */}
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
                                {imageFile.length} / 6 ảnh
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
