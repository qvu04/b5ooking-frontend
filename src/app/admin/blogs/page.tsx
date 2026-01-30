"use client";
import { useEffect, useState } from "react";
import { Pagination } from "@/app/types/blogType";
import { deleteBlogService, getAllBlogService } from "@/app/api/adminService";
import { BlogManager } from "@/app/types/adminType";
import { Modal, Tooltip, Spin } from "antd";
import { FaPlus, FaEdit, FaTrash, FaRegNewspaper } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import CreateBlogForm from "./CreateBlogForm";
import UpdateBlogForm from "./UpdateBlogForm";
import toast from "react-hot-toast";
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
import Image from 'next/image';

export default function Blogs() {
    const [page, setPage] = useState(1);
    const [locationId, setLocationId] = useState<number | null>(null);
    const [pagination, setPagination] = useState<Pagination>();
    const [showFormCreate, setShowFormCreate] = useState(false);
    const [showFormUpdate, setShowFormUpdate] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<BlogManager | null>(null);
    const [blog, setBlog] = useState<BlogManager[]>([]);
    const [blogTitle, setBlogTitle] = useState("");
    const [debouncedBlogTitle] = useDebounce(blogTitle, 500);
    const [loading, setLoading] = useState(false);

    const fetchAllBlog = async () => {
        try {
            setLoading(true);
            const res = await getAllBlogService(page, locationId ?? 0, debouncedBlogTitle);
            setBlog(res.data.data.blogs);
            setPagination(res.data.data.pagination);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách bài viết");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (id: number) => {
        try {
            await deleteBlogService(id);
            toast.success("Xóa bài viết thành công");
            fetchAllBlog();
        } catch {
            toast.error("Không thể xóa bài viết này");
        }
    };

    useEffect(() => {
        fetchAllBlog();
    }, [page, locationId, debouncedBlogTitle]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-semibold text-[#6246ea] tracking-tight">
                    Quản lý bài viết
                </h2>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={blogTitle}
                            onChange={(e) => {
                                setBlogTitle(e.target.value);
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
                        <span>Tạo bài viết mới</span>
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
                                <th className="p-4 border">Tiêu đề</th>
                                <th className="p-4 border">Mô tả</th>
                                <th className="p-4 border">Khu vực</th>
                                <th className="p-4 border">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blog.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50 text-center">
                                    <td className="p-3 border">
                                        <Image
                                            src={b.image ?? ""}
                                            alt={b.title}
                                            width={500}
                                            height={300}
                                            className="w-48 h-20 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-3 border font-medium">{b.title}</td>
                                    <td className="p-3 border max-w-[200px] truncate">
                                        <Tooltip
                                            title={b.summary}
                                            placement="top"
                                            overlayStyle={{
                                                maxWidth: 400,
                                                whiteSpace: "normal",
                                                wordWrap: "break-word",
                                            }}
                                        >
                                            <span className="block truncate cursor-help text-gray-700">
                                                {b.summary}
                                            </span>
                                        </Tooltip>
                                    </td>
                                    <td className="p-3 border">{b.location.city}</td>
                                    <td className="border p-2">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedBlog(b);
                                                    setShowFormUpdate(true);
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
                                                            Bạn có chắc chắn muốn xóa bài viết này?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Hành động này không thể hoàn tác và sẽ xóa bài viết vĩnh viễn.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteBlog(b.id)}>
                                                            Đồng ý
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {blog.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-500 py-8">
                                        Không có bài viết nào
                                    </td>
                                </tr>
                            )}
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
                        <FaRegNewspaper className="text-[#7f5af0]" />
                        <span>Tạo bài viết mới</span>
                    </div>
                }
                open={showFormCreate}
                onCancel={() => setShowFormCreate(false)}
                footer={null}
                width={800}
            >
                <CreateBlogForm
                    onSuccess={() => {
                        setShowFormCreate(false);
                        fetchAllBlog();
                    }}
                />
            </Modal>

            {/* Modal Update */}
            <Modal
                title={
                    <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-800">
                        <FaRegNewspaper className="text-[#7f5af0]" />
                        <span>Cập nhật bài viết</span>
                    </div>
                }
                open={showFormUpdate}
                onCancel={() => setShowFormUpdate(false)}
                footer={null}
                width={800}
            >
                {selectedBlog && (
                    <UpdateBlogForm
                        blogId={selectedBlog.id}
                        blogData={selectedBlog}
                        onSuccess={() => {
                            setShowFormUpdate(false);
                            fetchAllBlog();
                        }}
                    />
                )}
            </Modal>
        </div>
    );
}
