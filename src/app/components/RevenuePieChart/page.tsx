'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HotelRevenue } from '@/app/types/adminType';
import { getRevenuePieChart } from '@/app/api/adminService';

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
    '#FF4444', '#8884d8', '#A569BD', '#F5B041', '#58D68D',
    '#5DADE2', '#DC7633', '#7FB3D5', '#AAB7B8', '#E74C3C',
    '#2ECC71', '#F1C40F', '#7D3C98', '#1ABC9C', '#34495E'
];

export default function RevenuePieChart() {
    const [data, setData] = useState<HotelRevenue[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await getRevenuePieChart("month");
                setData(res.data.data || []);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <Card className="flex flex-col h-120 shadow-sm rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <CardTitle className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                    Biểu đồ phần trăm doanh thu theo khách sạn
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col h-full p-4">
                {data.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">Không có dữ liệu khách sạn để hiển thị</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="precent"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="80%"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-3 max-h-[150px] overflow-y-auto space-y-1 px-2 text-sm">
                            {data.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-sm"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-muted-foreground truncate">
                                        {entry.name}: {entry.precent.toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
