'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { getRevenueChartService } from '@/app/api/adminService';
import { PaymentRevenue } from '@/app/types/adminType';

export default function RevenueBarChart() {
    const [type, setType] = useState<'day' | 'week' | 'month'>('month');
    const [data, setData] = useState<PaymentRevenue[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getRevenueChartService(type);
                setData(res.data.data || []);
            } catch (err) {
                console.error(err);
                setData([]);
            }
        };
        fetchData();
    }, [type]);

    return (
        <Card className="flex flex-col h-120 shadow-sm rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <CardHeader className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <CardTitle className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                    Thống kê doanh thu
                </CardTitle>
                <Select value={type} onValueChange={(value: 'day' | 'week' | 'month') => setType(value)}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="day">Theo ngày</SelectItem>
                        <SelectItem value="week">Theo tuần</SelectItem>
                        <SelectItem value="month">Theo tháng</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="flex-1 h-full p-0">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}tr`} />
                            <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} VND`} />
                            <Bar dataKey="revenue" fill="#6246ea" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-sm">Không có dữ liệu doanh thu</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
