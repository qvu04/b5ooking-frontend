"use client"

import { putUpdateUSerService } from "@/app/api/adminService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserManger } from '@/app/types/adminType';

type Props = {
    user: UserManger,
    onSuccess: () => void;
}

export default function UpdateUserForm({ user, onSuccess }: Props) {
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        gender: user.gender,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData
        };

        try {
            await putUpdateUSerService(user.id, payload);
            toast.success("Cập nhật người dùng thành công");
            onSuccess();
        } catch (error) {
            console.log('✌️error --->', error);
            toast.error("Cập nhật người dùng thất bại");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    useEffect(() => {
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            gender: user.gender,
        });
    }, [user]);
    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white max-w-md p-4 border rounded-xl shadow-md">
            <div>
                <label className="block text-sm font-medium mb-1">Họ</label>
                <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Nhập họ"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Tên</label>
                <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Nhập tên"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Vai trò</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Giới tính</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                </select>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-[#7f5af0] hover:bg-[#684de0] text-white font-semibold px-6 py-2 rounded-lg  transition duration-200"
                >
                    Lưu
                </button>
            </div>
        </form>
    );
}
