"use client";
import { useEffect, useState } from "react";
import { getAllHotelService, deleteHotelService, getAllAmenitiesService } from "@/app/api/adminService";
import { HotelManager } from "@/app/types/adminType";
import { Pagination } from "@/app/types/blogType";
import { useDebounce } from "use-debounce";
import { Modal, Tooltip, Spin } from "antd";
import { FaPlus, FaEdit, FaTrash, FaHotel } from "react-icons/fa";
import toast from "react-hot-toast";
import CreateHotelForm from "./CreateHotelForm";
import UpdateHotelForm from "./UpdateHotelForm";
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
} from "@/components/ui/alert-dialog"
import { AmenityType } from "@/app/types/amenityType";
import Image from 'next/image';
export default function HotelsManager() {
    const [page, setPage] = useState(1);
    const [locationId, setLocationId] = useState<number | null>(null);
    const [hotel, setHotel] = useState<HotelManager[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [loading, setLoading] = useState(false);
    const [amenities, setAmenities] = useState<AmenityType[]>([]);
    const [showFormCreate, setShowFormCreate] = useState(false);
    const [showFormUpdate, setShowFormUpdate] = useState(false);
    const [hotelName, setHotelName] = useState("");
    const [selectedHotel, setSelectedHotel] = useState<HotelManager | null>(null);
    const [debouncedHotelName] = useDebounce(hotelName, 500);

    const fetchAllHotel = async () => {
        try {
            setLoading(true);
            const res = await getAllHotelService(page, locationId ?? 0, debouncedHotelName);
            setHotel(res.data.data.hotels);
            setPagination(res.data.data.pagination);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách khách sạn");
        } finally {
            setLoading(false);
        }
    };
    const fetchAllAmennities = async () => {
        try {
            const res = await getAllAmenitiesService();
            console.log("Lấy danh sách tiện nghi thành công: ", res);
            setAmenities(res.data.data.amenities);
        } catch (error) {
            console.log(error);
        }
    }
    const handleDeleteHotel = async (id: number) => {
        try {
            await deleteHotelService(id);
            toast.success("Xóa khách sạn thành công");
            fetchAllHotel();
        } catch {
            toast.error("Không thể xóa khách sạn này");
        }
    };

    useEffect(() => {
        fetchAllHotel();
    }, [page, locationId, debouncedHotelName]);
    useEffect(() => {
        fetchAllAmennities();
    }, [])
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-semibold text-[#6246ea] tracking-tight">
                    Quản lý khách sạn
                </h2>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Tìm kiếm khách sạn..."
                            value={hotelName}
                            onChange={(e) => {
                                setHotelName(e.target.value);
                                setPage(1);
                            }}
                            className="border border-gray-300 p-2 rounded w-full sm:w-64"
                        />

                        <select
                            value={locationId ?? ""}
                            onChange={(e) => {
                                const id = e.target.value ? Number(e.target.value) : null;
                                setLocationId(id);
                                setPage(1);
                            }}
                            className="border border-gray-300 p-2 rounded w-full sm:w-48"
                        >
                            <option value="">Tất cả khu vực</option>
                            <option value="1">TP.HCM</option>
                            <option value="2">Đà Nẵng</option>
                            <option value="3">Đà Lạt</option>
                            <option value="4">Vũng Tàu</option>
                            <option value="5">Hà Nội</option>
                            <option value="6">Nha Trang</option>
                            <option value="7">Cần Thơ</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setShowFormCreate(true)}
                        className="flex items-center gap-2 bg-[#7f5af0] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#6a46d7] transition-all"
                    >
                        <FaPlus className="text-sm" />
                        <span>Tạo khách sạn mới</span>
                    </button>
                </div>
            </div>


            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Spin size="large" />
                    </div>
                ) : (
                    <table className="w-full table-fixed border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="p-4 border">Ảnh</th>
                                <th className="p-4 border">Tên khách sạn</th>
                                <th className="p-4 border">Địa chỉ</th>
                                <th className="p-4 border">Mô tả</th>
                                <th className="p-4 border">Khu vực</th>
                                <th className="p-4 border">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotel.map((h) => (
                                <tr key={h.id} className="hover:bg-gray-50 text-center">
                                    <td className="p-3 border">
                                        <Image
                                            src={h.image ?? ""}
                                            alt={h.name}
                                            width={500}
                                            height={300}
                                            className="w-48 h-20 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-3 border font-medium">{h.name}</td>
                                    <td className="p-3 border">{h.address}</td>
                                    <td className="p-3 border max-w-[200px] truncate">
                                        <Tooltip
                                            title={h.description}
                                            placement="top"
                                            overlayStyle={{
                                                maxWidth: 400, // Giới hạn chiều rộng tooltip
                                                whiteSpace: "normal", // Cho phép xuống dòng
                                                wordWrap: "break-word",
                                            }}
                                        >
                                            <span className="block truncate cursor-help text-gray-700">
                                                {h.description}
                                            </span>
                                        </Tooltip>
                                    </td>
                                    <td className="p-5 border">
                                        {h.location.city}
                                    </td>
                                    <td className="border p-2">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedHotel(h);
                                                    setShowFormUpdate(true);
                                                }}
                                                className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                                            >
                                                <FaEdit className="text-sm" />
                                                <span>Sửa</span>
                                            </button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                                                    >
                                                        <FaTrash className="text-sm" />
                                                        <span>Xóa</span>
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Bạn có chắc khi xoá khách sạn này không?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Hành động này sẽ không thể hoàn tác, xoá khách sạn này vĩnh viễn.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteHotel(h.id)}
                                                        >Đồng ý</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex justify-center items-center gap-3 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-40"
                    >
                        ← Trước
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        const isActive = pageNumber === pagination.page;
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => setPage(pageNumber)}
                                className={`w-9 h-9 rounded-lg border transition font-medium ${isActive
                                    ? "bg-[#7f5af0] text-white border-[#7f5af0]"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-40"
                    >
                        Sau →
                    </button>
                </div>
            )}


            {/* Modal Create */}
            <Modal
                title={
                    <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-800">
                        <FaHotel className="text-[#7f5af0]" />
                        <span>Tạo mới khách sạn</span>
                    </div>
                }
                open={showFormCreate}
                onCancel={() => setShowFormCreate(false)}
                footer={null}
                width={900}

            >
                <CreateHotelForm
                    onSuccess={() => {
                        setShowFormCreate(false);
                        fetchAllHotel();
                    }}
                    amenities={amenities}
                />
            </Modal>

            {/* Modal Update */}
            <Modal
                title={
                    <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-800">
                        <FaHotel className="text-[#7f5af0]" />
                        <span>Cập nhật khách sạn</span>
                    </div>
                }
                open={showFormUpdate}
                onCancel={() => setShowFormUpdate(false)}
                footer={null}
                width={900}
            >
                {selectedHotel && (
                    <UpdateHotelForm
                        onSuccess={() => {
                            setShowFormUpdate(false);
                            fetchAllHotel();
                        }}
                        hotelId={selectedHotel.id}
                        hotelData={selectedHotel}
                    />
                )}
            </Modal>
        </div>
    );
}
