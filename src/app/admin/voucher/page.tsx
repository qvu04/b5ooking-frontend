"use client";

import { useEffect, useState } from "react";
import { Modal, Input } from "antd";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { TbRosetteDiscountFilled } from "react-icons/tb";

import { getAllVoucher, getAllUserUseVoucher } from "@/app/api/adminService";
import { Voucher } from "@/app/types/voucherType";
import { Pagination } from "@/app/types/blogType";

import CreateVoucherForm from "./CreateVoucherForm";
import UpdateVoucherForm from "./UpdateVoucherForm";
import { FaPlus, FaEdit, FaHotel } from 'react-icons/fa';

export default function VoucherManager() {
    const [activeTab, setActiveTab] = useState<'voucher' | 'user'>('voucher');
    const [page, setPage] = useState(1);

    // Voucher tab
    const [voucher, setVoucher] = useState<Voucher[]>([]);
    const [voucherSearch, setVoucherSearch] = useState("");
    const [deboundedVoucher] = useDebounce(voucherSearch, 500);
    const [showFormCreate, setShowFormCreate] = useState(false);
    const [showFormUpdate, setShowFormUpdate] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

    // User tab
    const [userVoucher, setUserVoucher] = useState<any[]>([]);

    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        totalPages: 1,
        limit: 5, // số item mặc định
    });

    // -------------------- Fetch API --------------------
    const fetchAllVoucher = async () => {
        try {
            const res = await getAllVoucher(page, deboundedVoucher);
            setVoucher(res.data.data.vouchers);
            setPagination(res.data.data.pagination);
        } catch (error) {
            console.log(error);
            toast.error("Lấy danh sách voucher thất bại");
        }
    };

    const fetchAllVoucherUserUse = async (pageParam: number = 1) => {
        try {
            const res = await getAllUserUseVoucher(pageParam);
            setUserVoucher(res.data.data.userVoucher);
            setPagination(res.data.data.pagination);
        } catch (error) {
            console.log(error);
            toast.error("Lấy danh sách người dùng voucher thất bại");
        }
    };

    // -------------------- Effects --------------------
    useEffect(() => {
        if (activeTab === 'voucher') {
            fetchAllVoucher();
        } else {
            fetchAllVoucherUserUse(page);
        }
    }, [activeTab, page, deboundedVoucher]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVoucherSearch(e.target.value.trim());
        setPage(1);
    };

    const toggleFormCreate = () => setShowFormCreate(prev => !prev);
    const toggleFormUpdate = () => setShowFormUpdate(prev => !prev);

    // -------------------- Render --------------------
    return (
        <div className="p-4 max-w-7xl mx-auto">
            <div className="flex justify-center items-center sm:flex-row sm:items-center border-b-1 sm:justify-between mb-8 border-gray-200 pb-3">
                <h2 className="text-2xl font-semibold text-[#6246ea] tracking-tight mb-3 sm:mb-0">
                    Quản lý voucher
                </h2>

                {/* Tabs */}
                <div className="flex gap-6 ">
                    <button
                        className={`font-semibold ${activeTab === 'voucher' ? 'border-b-2 border-[#7f5af0]' : ''}`}
                        onClick={() => { setActiveTab('voucher'); setPage(1); }}
                    >
                        Quản lý Voucher
                    </button>
                    <button
                        className={`font-semibold ${activeTab === 'user' ? 'border-b-2 border-[#7f5af0]' : ''}`}
                        onClick={() => { setActiveTab('user'); setPage(1); }}
                    >
                        Người dùng đã sử dụng voucher
                    </button>
                </div>
            </div>
            {/* Voucher Tab */}
            {activeTab === 'voucher' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <Input
                            placeholder="Tìm kiếm vouchers..."
                            value={voucherSearch}
                            onChange={handleSearchChange}
                            className="max-w-sm"
                        />
                        <button
                            onClick={toggleFormCreate}
                            className="flex items-center gap-2 bg-[#7f5af0] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#6a46d7] transition-all"
                        >
                            <FaPlus className="text-sm" />
                            <span>Tạo voucher</span>
                        </button>
                    </div>

                    {/* Table voucher */}
                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-100">
                        <table className="min-w-[900px] w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-center text-gray-700">
                                    <th className="border p-2">Code</th>
                                    <th className="border p-2">Giảm giá (%)</th>
                                    <th className="border p-2">Số lần người dùng</th>
                                    <th className="border p-2">Số lần hệ thống cấp</th>
                                    <th className="border p-2">Ngày hết hạn</th>
                                    <th className="border p-2">Hiệu lực</th>
                                    <th className="border p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voucher.map((v) => (
                                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="border p-2">{v.code}</td>
                                        <td className="border p-2">{v.discount}</td>
                                        <td className="border p-2">{v.perUserLimit}</td>
                                        <td className="border p-2">{v.usageLimit}</td>
                                        <td className="border p-2">{new Date(v.expiresAt).toLocaleDateString("vi-VN")}</td>
                                        <td className="border p-2">
                                            {v.isActive
                                                ? <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">Còn hiệu lực</span>
                                                : <span className="text-red-600 font-semibold bg-red-100 px-3 py-1 rounded-full">Hết hiệu lực</span>
                                            }
                                        </td>
                                        <td className="border p-2 flex items-center justify-center">
                                            <button
                                                onClick={() => { setSelectedVoucher(v); toggleFormUpdate(); }}
                                                className="flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                                            >
                                                <FaEdit className="text-sm" />
                                                <span>Sửa</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Modal create/update */}
                    <Modal
                        title={
                            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-800">
                                <TbRosetteDiscountFilled className="text-[#7f5af0]" />
                                <span>Tạo mới voucher</span>
                            </div>
                        }
                        open={showFormCreate}
                        onCancel={() => setShowFormCreate(false)}
                        footer={null}
                    >
                        <CreateVoucherForm
                            onSuccess={() => { setShowFormCreate(false); fetchAllVoucher(); }}
                        />
                    </Modal>

                    <Modal
                        title={
                            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-800">
                                <TbRosetteDiscountFilled className="text-[#7f5af0]" />
                                <span>Cập nhật voucher</span>
                            </div>
                        }
                        open={showFormUpdate}
                        onCancel={() => setShowFormUpdate(false)}
                        footer={null}
                    >
                        {selectedVoucher && (
                            <UpdateVoucherForm
                                voucher={selectedVoucher}
                                onSuccess={() => { setShowFormUpdate(false); fetchAllVoucher(); }}
                            />
                        )}
                    </Modal>
                </div>
            )}

            {/* User tab */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-100">
                {activeTab === 'user' && (
                    <table className="w-full border border-collapse">
                        <thead>
                            <tr className=" bg-gray-100 text-center text-gray-700">
                                <th className="border p-2">Tên người dùng</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Role</th>
                                <th className="border p-2">Voucher đã dùng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userVoucher.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="border p-2">{user.fullName}</td>
                                    <td className="border p-2">{user.email}</td>
                                    <td className="border p-2">{user.role}</td>
                                    <td className="border p-2">
                                        {user.bookings.map((b: any) => (
                                            <div key={b.Voucher.id}>
                                                {b.Voucher.code} ({b.Voucher.discount}%)
                                            </div>
                                        ))}
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
        </div>
    );
}
