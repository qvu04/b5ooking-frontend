"use client";
import { deleteRoomService, getAllAmenitiesService, getAllRoomService } from "@/app/api/adminService";
import { RoomManager } from "@/app/types/adminType";
import { Pagination } from "@/app/types/blogType";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Modal, Tooltip, Spin } from "antd";
import CreateRoomForm from "@/app/admin/rooms/CreateRoomForm";
import UpdateRoomForm from "./UpdateRoomForm";
import toast from "react-hot-toast";
import { FaDoorOpen, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { AmenityType } from "@/app/types/amenityType";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';

export default function RoomsManager() {
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination>();
    const [room, setRoom] = useState<RoomManager[]>([]);
    const [hotelId, setHotelId] = useState<number | null>(null);
    const [showFormCreate, setShowFormCreate] = useState(false);
    const [showFormUpdate, setShowFormUpdate] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<RoomManager | null>(null);
    const [amenities, setAmenities] = useState<AmenityType[]>([]);
    const [roomName, setRoomName] = useState("");
    const [debouncedRoomName] = useDebounce(roomName, 500);
    const [loading, setLoading] = useState(false);

    const fetchAllRoom = async () => {
        try {
            setLoading(true);
            const res = await getAllRoomService(page, hotelId ?? 0, debouncedRoomName);
            setPagination(res.data.data.pagination);
            setRoom(res.data.data.rooms);
        } catch (error) {
            console.log("Lỗi tải danh sách phòng:", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchAllAmennities = async () => {
        try {
            const res = await getAllAmenitiesService();
            setAmenities(res.data.data.amenities);
        } catch (error) {
            console.log(error);
        }
    }
    const handleDeleteRoom = async (id: number) => {
        try {
            await deleteRoomService(id);
            toast.success("Xóa phòng thành công");
            fetchAllRoom();
        } catch (error) {
            console.log(error);
            toast.error("Xóa phòng thất bại");
        }
    };

    useEffect(() => {
        fetchAllRoom();
    }, [page, hotelId, debouncedRoomName]);
    useEffect(() => {
        fetchAllAmennities();
    }, [])
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-semibold text-[#6246ea] tracking-tight">
                    Quản lý phòng ở
                </h2>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Tìm kiếm phòng..."
                            value={roomName}
                            onChange={(e) => {
                                setRoomName(e.target.value);
                                setPage(1);
                            }}
                            className="border border-gray-300 p-2 rounded w-full sm:w-64"
                        />

                        <select
                            value={hotelId ?? ""}
                            onChange={(e) => {
                                const id = e.target.value ? Number(e.target.value) : null;
                                setHotelId(id);
                                setPage(1);
                            }}
                            className="border border-gray-300 p-2 rounded w-full sm:w-48"
                        >
                            <option value="">Tất cả khách sạn</option>
                            <option value="3">Crab Bui Vien Homestay</option>
                            <option value="4">The Cozy Inn Hotel Ho Chi Minh</option>
                            <option value="5">Elite SOFEA Saigon Hotel and Spa</option>
                            <option value="6">Rosa May Hotel</option>
                            <option value="7">FIVITEL King</option>
                            <option value="8">Ocean Star Da Nang Bay Hote</option>
                            <option value="9">MOONLIGHT Hotel Suites & Spa - near Dragon Bridge,...</option>
                            <option value="10">Hadana Boutique Hotel Danang</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setShowFormCreate(true)}
                        className="flex items-center gap-2 bg-[#7f5af0] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#6a46d7] transition-all"
                    >
                        <FaPlus className="text-sm" />
                        <span>Tạo phòng mới</span>
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
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-center text-gray-700">
                                <th className="p-4 border">Ảnh</th>
                                <th className="p-4 border">Tên phòng</th>
                                <th className="p-4 border">Giá</th>
                                <th className="p-4 border">Mô tả</th>
                                <th className="p-4 border">Loại phòng</th>
                                <th className="p-4 border">Khách sạn</th>
                                <th className="p-4 border">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {room.map((r) => (
                                <tr
                                    key={r.id}
                                    className="hover:bg-gray-50 text-center transition"
                                >
                                    <td className="p-3 border">
                                        <Image
                                            src={r.image ?? ""}
                                            alt={r.name}
                                            width={500}
                                            height={300}
                                            className="w-32 h-20 object-cover rounded shadow-sm"
                                        />
                                    </td>
                                    <td className="p-3 border font-medium">{r.name}</td>
                                    <td className="p-3 border text-green-600 font-semibold">
                                        {r.price.toLocaleString()}₫
                                    </td>
                                    <td className="p-3 border max-w-[200px] truncate">
                                        <Tooltip
                                            title={r.description}
                                            placement="top"
                                            overlayStyle={{
                                                maxWidth: 400, // Giới hạn chiều rộng tooltip
                                                whiteSpace: "normal", // Cho phép xuống dòng
                                                wordWrap: "break-word",
                                            }}
                                        >
                                            <span className="block truncate cursor-help text-gray-700">
                                                {r.description}
                                            </span>
                                        </Tooltip>
                                    </td>
                                    <td className="p-3 border">{r.type}</td>
                                    <td className="p-3 border">
                                        {r.hotel.name}
                                    </td>
                                    <td className="p-3 border">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedRoom(r);
                                                    setShowFormUpdate(true);
                                                }}
                                                className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                                            >
                                                <FaEdit />
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
                                                        <AlertDialogTitle>Bạn có chắc khi xoá phòng này không?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Hành động này sẽ không thể hoàn tác, xoá phòng này vĩnh viễn.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteRoom(r.id)}
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
                        <FaDoorOpen className="text-[#7f5af0]" />
                        <span>Tạo mới phòng ở</span>
                    </div>
                }
                open={showFormCreate}
                onCancel={() => setShowFormCreate(false)}
                footer={null}
                width={900}
            >
                <CreateRoomForm
                    onSuccess={() => {
                        setShowFormCreate(false);
                        fetchAllRoom();
                    }}
                    amenities={amenities}
                />
            </Modal>

            {/* Modal Update */}
            {selectedRoom && (
                <Modal
                    title={
                        <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-800">
                            <FaDoorOpen className="text-[#7f5af0]" />
                            <span>Cập nhật phòng ở</span>
                        </div>
                    }
                    open={showFormUpdate}
                    onCancel={() => setShowFormUpdate(false)}
                    footer={null}
                    width={800}
                >
                    <UpdateRoomForm
                        onSuccess={() => {
                            setShowFormUpdate(false);
                            fetchAllRoom();
                        }}
                        roomId={selectedRoom.id}
                        roomData={selectedRoom}
                    />
                </Modal>
            )}
        </div>
    );
}
