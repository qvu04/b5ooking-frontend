"use client";

import {
    deleteImagesHotel,
    deleteImagesRoom,
    getAllImagesHotel,
    getAllImagesRoom,
    getAllHotelNames,
    getAllRoomNames,
} from "@/app/api/adminService";
import { useEffect, useState } from "react";
import { Select, Image } from "antd";
import toast from "react-hot-toast";
import {
    ImageItem,
    HotelOption,
    RoomOption,
} from "@/app/types/adminType";
import { Pagination } from "@/app/types/blogType";
import CreateImagesForm from "./CreateImagesForm";
import UpdateImagesForm from "./UpdateImagesForm";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const { Option } = Select;

export default function ImageManager() {
    const [filteredImages, setFilteredImages] = useState<ImageItem[]>([]);
    const [selectedHotelId, setSelectedHotelId] = useState<number | "all">("all");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination>();
    const [activeTab, setActiveTab] = useState<"hotel" | "room">("hotel");

    const [hotelOptions, setHotelOptions] = useState<HotelOption[]>([]);
    const [roomOptions, setRoomOptions] = useState<RoomOption[]>([]);

    // ✅ Fetch images
    const fetchImages = async (filterId: number | null = null, pageParam: number = 1) => {
        try {
            let res =
                activeTab === "hotel"
                    ? await getAllImagesHotel(filterId, pageParam)
                    : await getAllImagesRoom(filterId, pageParam);

            const imageData = res.data.data;
            setFilteredImages(imageData.hotelImages || imageData.roomImages || []);
            setPagination(imageData.pagination);
        } catch (err) {
            console.error("Lỗi khi lấy ảnh:", err);
            toast.error("Không thể lấy ảnh");
        }
    };

    // ✅ Fetch options
    const fetchOptions = async () => {
        try {
            if (activeTab === "hotel") {
                const res = await getAllHotelNames();
                setHotelOptions(res.data.data.hotelNames || []);
            } else {
                const res = await getAllRoomNames();
                setRoomOptions(res.data.data.roomName || []);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách:", error);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, [activeTab]);

    useEffect(() => {
        fetchImages(selectedHotelId === "all" ? null : selectedHotelId, page);
    }, [activeTab, page, selectedHotelId]);

    // ✅ Delete image
    const handleDelete = async (img: ImageItem) => {
        try {
            if (!img.id) return;

            if (activeTab === "hotel") {
                await deleteImagesHotel(img.id);
            } else {
                await deleteImagesRoom(img.id);
            }

            toast.success("Xóa ảnh thành công!");
            fetchImages(selectedHotelId === "all" ? null : selectedHotelId);
        } catch (error) {
            console.error("Lỗi khi xóa ảnh:", error);
            toast.error("Xóa ảnh thất bại!");
        }
    };
    const getPageNumbers = (): (number | string)[] => {
        if (!pagination) return [1];
        const total = pagination.totalPages;
        const current = page;
        const delta = 2; // số trang hiển thị xung quanh trang hiện tại
        const range: (number | string)[] = [];

        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
                range.push(i);
            } else if (range[range.length - 1] !== "...") {
                range.push("...");
            }
        }
        return range;
    };
    // ✅ Filter change
    const handleFilterChange = (value: number | "all") => {
        setSelectedHotelId(value);
        fetchImages(value === "all" ? null : value);
    };

    // ✅ Options for dropdown
    const filterOptions: [number, string][] =
        activeTab === "hotel"
            ? hotelOptions.map((h) => [h.id, h.name])
            : roomOptions.map((r) => [r.id, `${r.name} (${r.hotel.name})`]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex justify-center items-center sm:flex-row sm:items-center border-b-1 sm:justify-between mb-8 border-gray-200 pb-3">
                <h2 className="text-2xl font-semibold text-[#6246ea] tracking-tight mb-3 sm:mb-0">
                    Quản lý ảnh phụ
                </h2>

                <div className="flex gap-3">
                    {["hotel", "room"].map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 font-medium rounded-md border transition-all duration-200 ${activeTab === tab
                                ? "text-[#fff] bg-[#7f5af0] border-[#7f5af0]"
                                : "text-gray-600 bg-white border-gray-200 hover:bg-gray-50"
                                }`}
                            onClick={() => {
                                setActiveTab(tab as "hotel" | "room");
                                setSelectedHotelId("all");
                                setPage(1);
                            }}
                        >
                            {tab === "hotel" ? "Ảnh khách sạn" : "Ảnh phòng"}
                        </button>
                    ))}
                </div>
            </div>
            {/* Bộ lọc & Thêm ảnh */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 items-center">
                <Select
                    style={{ width: 350 }}
                    value={selectedHotelId}
                    onChange={handleFilterChange}
                    className="rounded-md"
                >
                    <Option value="all">
                        Tất cả {activeTab === "hotel" ? "khách sạn" : "phòng"}
                    </Option>
                    {filterOptions.map(([id, label]) => (
                        <Option key={id} value={id}>
                            {label}
                        </Option>
                    ))}
                </Select>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-[#7f5af0] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#6a46d7] transition-all"
                >
                    <FaPlus className="text-sm" />
                    <span>Thêm ảnh mới</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-center text-sm">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                        <tr>
                            <th className="p-4 border">
                                {activeTab === "hotel" ? "Tên khách sạn" : "Tên phòng"}
                            </th>
                            <th className="p-4 border">Ảnh</th>
                            <th className="p-4 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredImages.map((img) => (
                            <tr
                                key={img.id}
                                className="hover:bg-gray-50 transition-all duration-150"
                            >
                                <td className="p-4 border text-gray-700">
                                    {activeTab === "hotel" ? img.hotel?.name : img.room?.name}
                                </td>
                                <td className="p-4 border">
                                    <div className="flex justify-center">
                                        <Image
                                            src={img.imageUrl}
                                            width={120}
                                            height={70}
                                            alt="image"
                                            className="rounded-md shadow-sm object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="p-3 border">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedImage(img);
                                                setShowUpdateModal(true);
                                            }}
                                            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                                        >
                                            <FaEdit className="text-sm" />
                                            <span>Sửa</span>
                                        </button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition">
                                                    <FaTrash className="text-sm" />
                                                    <span>Xóa</span>
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Bạn có chắc muốn xoá ảnh này không?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Hành động này không thể hoàn tác.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(img)}
                                                    >
                                                        Đồng ý
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex gap-3 mt-6 justify-center items-center">
                    {/* Trang trước */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        className="px-3 py-1 rounded-lg bg-[#7f5af0] text-white disabled:opacity-50"
                    >
                        ← Trước
                    </button>

                    {/* Số trang */}
                    {getPageNumbers().map((p, idx) =>
                        typeof p === "number" ? (
                            <button
                                key={idx}
                                className={`px-3 py-1 rounded-lg ${p === page ? "bg-[#7f5af0] text-white" : "bg-gray-100"
                                    }`}
                                onClick={() => setPage(p)}
                            >
                                {p}
                            </button>
                        ) : (
                            <span key={idx} className="px-2">...</span>
                        )
                    )}

                    {/* Trang sau */}
                    <button
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage(p => Math.min(p + 1, pagination.totalPages))}
                        className="px-3 py-1 rounded-lg bg-[#7f5af0] text-white disabled:opacity-50"
                    >
                        Sau →
                    </button>
                </div>
            )}


            {/* ✅ Modal Create */}
            <CreateImagesForm
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                activeTab={activeTab}
                filterOptions={filterOptions}
                onSuccess={() =>
                    fetchImages(selectedHotelId === "all" ? null : selectedHotelId)
                }
            />

            {/* ✅ Modal Update */}
            <UpdateImagesForm
                open={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                activeTab={activeTab}
                filterOptions={filterOptions}
                selectedImage={selectedImage}
                onSuccess={() =>
                    fetchImages(selectedHotelId === "all" ? null : selectedHotelId)
                }
            />
        </div>
    );
}
