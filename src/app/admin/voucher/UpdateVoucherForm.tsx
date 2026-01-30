"use client";

import { useState } from "react";
import { updateVoucher } from "@/app/api/adminService";
import { message } from "antd";
import { Voucher } from "@/app/types/voucherType";
import toast from "react-hot-toast";

type Props = {
    voucher: Voucher;
    onSuccess: () => void;
};

export default function UpdateVoucherForm({ voucher, onSuccess }: Props) {
    const [formData, setFormData] = useState({
        expiresAt: voucher.expiresAt
            ? new Date(voucher.expiresAt).toISOString().split("T")[0]
            : "",
        usageLimit: voucher.usageLimit,
        perUserLimit: voucher.perUserLimit,
        isActive: voucher.isActive,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, // giữ nguyên value dạng chuỗi
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateVoucher(voucher.id, {
                ...formData,
                usageLimit: Number(formData.usageLimit),
                perUserLimit: Number(formData.perUserLimit),
            });
            toast.success("Cập nhật voucher thành công!");
            onSuccess();
        } catch (error) {
            console.error("Lỗi khi cập nhật voucher:", error);
            toast.error("Cập nhật voucher thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block mb-1 font-semibold">Ngày hết hạn</label>
                <input
                    type="date"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-semibold">
                    Giới hạn sử dụng toàn hệ thống
                </label>
                <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-semibold">
                    Giới hạn mỗi người dùng
                </label>
                <input
                    type="number"
                    name="perUserLimit"
                    value={formData.perUserLimit}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded w-full"
                />
            </div>

            <select
                name="isActive"
                value={formData.isActive ? "true" : "false"} // ✅ ép boolean sang string để hiển thị
                onChange={(e) =>
                    setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.value === "true", // ✅ convert lại sang boolean khi user chọn
                    }))
                }
                className="border p-2 rounded w-full"
            >
                <option value="true">Còn hiệu lực</option>
                <option value="false">Hết hiệu lực</option>
            </select>

            <button
                type="submit"
                disabled={loading}
                className="bg-[#7f5af0] text-[#fffffe] py-2 rounded hover:opacity-90 disabled:opacity-50"
            >
                {loading ? "Đang cập nhật..." : "Lưu"}
            </button>
        </form>
    );
}
