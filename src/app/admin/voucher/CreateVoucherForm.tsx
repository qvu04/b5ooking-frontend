"use client";

import { postVoucher } from "@/app/api/adminService";
import { useState } from "react";
import { message } from "antd";
import toast from "react-hot-toast";

type Props = {
    onSuccess: () => void;
};

export default function CreateVoucherForm({ onSuccess }: Props) {
    const [formData, setFormData] = useState({
        code: "",
        discount: "",
        expiresAt: "",
        usageLimit: "",
        perUserLimit: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                discount: Number(formData.discount),
                usageLimit: Number(formData.usageLimit),
                perUserLimit: Number(formData.perUserLimit),
            };

            await postVoucher(payload);
            toast.success("Tạo voucher thành công!");
            onSuccess();
        } catch (error) {
            console.error("Lỗi khi tạo voucher:", error);
            toast.error("Tạo voucher thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            <div>
                <label className="block mb-1 font-semibold">Mã voucher</label>
                <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-semibold">Giảm giá (%)</label>
                <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded w-full"
                />
            </div>

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
                    Giới hạn sử dụng mỗi người
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

            <button
                type="submit"
                disabled={loading}
                className="bg-[#7f5af0] text-[#fffffe] py-2 rounded hover:opacity-90 disabled:opacity-50"
            >
                {loading ? "Đang tạo..." : "Tạo voucher"}
            </button>
        </form>
    );
}
