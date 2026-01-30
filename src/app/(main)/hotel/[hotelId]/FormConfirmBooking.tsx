'use client';
import { DatePicker, Modal, Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarDays, Users, BedDouble, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { checkVoucherService } from "@/app/api/checkVoucherService";
import { RootState } from '@/lib/store';
import toast from 'react-hot-toast';
type OnConfirmType = (
    nights: number,
    checkInDate: string,
    checkOutDate: string,
    voucherCode: string,
    finalPrice: number
) => void;
interface ShowConfirmProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: OnConfirmType;
    guests: number;
    pricePerNight: number;
    checkIn: string;
    checkOut: string;
    discount?: number;
    roomId: number | string;
}
export default function ShowConfirm({
    visible,
    onCancel,
    onConfirm,
    guests,
    pricePerNight,
    checkIn,
    checkOut,
    discount,
    roomId,
}: ShowConfirmProps) {
    const [selectedDates, setSelectedDates] = useState<[Dayjs, Dayjs] | null>(
        checkIn && checkOut ? [dayjs(checkIn), dayjs(checkOut)] : null
    );
    const [voucherCode, setVoucherCode] = useState("");
    const [voucherInfo, setVoucherInfo] = useState<any>(null);
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const user = useSelector((state: RootState) => state.userSlice.user);

    const nights =
        selectedDates && selectedDates[0] && selectedDates[1]
            ? selectedDates[1].diff(selectedDates[0], 'day')
            : 0;

    const discountedPrice = discount && discount > 0
        ? pricePerNight * (1 - discount / 100)
        : pricePerNight;

    const total = nights * discountedPrice;

    const handleConfirm = () => {
        if (selectedDates) {
            onConfirm(
                nights,
                selectedDates[0].format('YYYY-MM-DD'),
                selectedDates[1].format('YYYY-MM-DD'),
                voucherCode || "", // ✅ truyền thêm voucherCode
                voucherInfo?.finalPrice || total
            );
        }
    };

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return toast.error("Vui lòng nhập mã voucher");
        if (!selectedDates || !selectedDates[0] || !selectedDates[1])
            return toast.error("Vui lòng chọn ngày nhận và trả phòng!");
        try {
            const userId = user?.id
            const res = await checkVoucherService(
                Number(userId!),
                Number(roomId),
                selectedDates[0].format("YYYY-MM-DD"),
                selectedDates[1].format("YYYY-MM-DD"),
                voucherCode
            );
            setVoucherInfo(res.data.data);
            console.log("Áp dụng voucher: ", res);
            toast.success("Áp dụng mã giảm giá thành công!");
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Có lỗi xảy ra khi áp dụng voucher";

            toast.error(message);
            setVoucherInfo(null);
        }
    };

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            onOk={handleConfirm}
            okText={t("hotelId.text_77")}
            cancelText={t("hotelId.text_78")}
            width={800}
            className="rounded-xl"
        >
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 text-center">{t("hotelId.text_70")}</h3>

                {/* Ngày đặt */}
                <div>
                    <label className="block mb-1 text-gray-700 font-semibold">{t("hotelId.text_71")}</label>
                    <DatePicker.RangePicker
                        className="w-full"
                        format="YYYY-MM-DD"
                        value={selectedDates}
                        onChange={(dates) => setSelectedDates(dates as [Dayjs, Dayjs])}
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                </div>

                {/* Nhập mã voucher */}
                <div>
                    <label className="block mb-1 text-gray-700 font-semibold">{t("voucher.discount")}</label>
                    <div className="flex gap-2">
                        <Input
                            placeholder={t("voucher.voucherCode")}
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                        />
                        <Button type="primary" onClick={handleApplyVoucher}>
                            {t("voucher.voucherButton")}
                        </Button>
                    </div>
                </div>

                {/* Thông tin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                        <Users className="text-blue-500" size={20} />
                        <span><strong>{t("hotelId.text_72")}</strong> {guests}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BedDouble className="text-purple-500" size={20} />
                        <span><strong>{t("hotelId.text_73")}</strong> {nights}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-green-600" size={20} />
                        <span><strong>{t("hotelId.text_74")}</strong> {pricePerNight.toLocaleString()} VND</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-green-600" size={20} />
                        <span><strong>{t("hotelId.text_75")}</strong> {discountedPrice.toLocaleString()} VND</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wallet className="text-red-500" size={20} />
                        {voucherInfo ? (
                            <span className="font-bold">
                                <strong>{t("voucher.totalPrice")}</strong> {voucherInfo.finalPrice.toLocaleString()} VND
                            </span>
                        ) : (
                            <span className="font-bold text-lg">
                                <strong>{t("hotelId.text_76")}</strong> {total.toLocaleString()} VND
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
