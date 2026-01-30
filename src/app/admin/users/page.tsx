"use client"
import { deleteUserService, getAllUserService } from "@/app/api/adminService"
import { Pagination } from "@/app/types/blogType"
import { useEffect, useState } from "react"
import { UserManger } from '@/app/types/adminType';
import { useDebounce } from "use-debounce";
import CreateUserForm from "./CreateUserForm";
import { Modal } from "antd";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import UpdateUserForm from "./UpdateUserForm";
import toast from "react-hot-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function UsersManager() {
    const [pagination, setPagination] = useState<Pagination>()
    const [page, setPage] = useState(1)
    const [fullName, setFullName] = useState("");
    const [user, setUser] = useState<UserManger[]>([]);
    const [showFormCreate, setShowFormCreate] = useState(false);
    const [showFormUpdate, setShowFormUpdate] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserManger | null>(null);
    const [deboundedFullName] = useDebounce(fullName, 500);
    const fetchAllUser = async () => {
        try {
            const res = await getAllUserService(page, deboundedFullName);
            setUser(res.data.data.users)
            setPagination(res.data.data.pagination)
            console.log('✌️res --->', res);
        } catch (error) {
            console.log('✌️error --->', error);
        }
    }
    const handleDeleteUser = async (id: number) => {
        try {
            await deleteUserService(id);
            toast.success("Xóa người dùng thành công");
            fetchAllUser();
        } catch (error) {
            console.log('✌️error --->', error);
            toast.error("Xóa người dùng thất bại")
        }
    }
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFullName(e.target.value);
        setPage(1);
    }
    const toggleFormCreate = () => {
        setShowFormCreate(prev => !prev);
    };
    const toggleFormUpdate = () => {
        setShowFormUpdate(prev => !prev);
    }
    useEffect(() => {
        fetchAllUser();
    }, [page, deboundedFullName])
    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-[#6246ea] tracking-tight">
                    Quản lý người dùng
                </h2>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={fullName}
                        onChange={handleSearchChange}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition"
                    />
                    <button
                        onClick={toggleFormCreate}
                        className="flex items-center gap-2 bg-[#7f5af0] hover:bg-[#6246ea] text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-[1.03] active:scale-95"
                    >
                        <FaPlus className="text-sm" />
                        <span>Tạo người dùng mới</span>
                    </button>
                </div>

                <Modal
                    title="Tạo người dùng mới"
                    open={showFormCreate}
                    onCancel={() => setShowFormCreate(false)}
                    footer={null}
                >
                    <CreateUserForm
                        onSuccess={() => {
                            setShowFormCreate(false);
                            fetchAllUser();
                        }}
                    />
                </Modal>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <table className="w-full text-sm text-gray-700">
                    <thead className="bg-gray-100 text-gray-800 text-left">
                        <tr>
                            <th className="p-3 border">Họ tên</th>
                            <th className="p-3 border">Email</th>
                            <th className="p-3 border">SĐT</th>
                            <th className="p-3 border">Giới tính</th>
                            <th className="p-3 border">Vai trò</th>
                            <th className="p-3 text-center border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-gray-50 border-t transition-colors"
                            >
                                <td className="p-3 border font-medium">{user.fullName}</td>
                                <td className="p-3 border">{user.email}</td>
                                <td className="p-3 border">
                                    {user.phone ? user.phone : <span className="font-medium">Chưa cập nhật SĐT</span>}
                                </td>
                                <td className="p-3 border">
                                    {user.gender === 'Nam'
                                        ? 'Nam'
                                        : user.gender === 'Nữ'
                                            ? 'Nữ'
                                            : 'Không xác định'}
                                </td>
                                <td className="p-3 border">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${user.role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-3 text-center border">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                toggleFormUpdate();
                                            }}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-[1.05] active:scale-95"
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
                                                    <AlertDialogTitle>Bạn có chắc khi xoá người dùng này không?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Hành động này sẽ không thể hoàn tác, xoá người dùng này vĩnh viễn.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteUser(user.id)}
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
            </div>

            {/* Modal Update */}
            <Modal
                title="Cập nhật người dùng"
                open={showFormUpdate}
                onCancel={() => setShowFormUpdate(false)}
                footer={null}
            >
                {selectedUser && (
                    <UpdateUserForm
                        user={selectedUser}
                        onSuccess={() => {
                            setShowFormUpdate(false);
                            fetchAllUser();
                        }}
                    />
                )}
            </Modal>

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

        </div>
    );

}