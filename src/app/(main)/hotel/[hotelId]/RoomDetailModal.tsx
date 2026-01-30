'use client';
import { Modal } from 'antd';
import { RoomAvailable } from '@/app/types/hotelTypes';
import { AiOutlineCheck } from 'react-icons/ai';
import { getRoomByRoomId } from '@/app/api/roomService';
import { useEffect, useState } from 'react';
import { RoomType } from '@/app/types/roomType';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper/types';
import { postBookingRoom } from '@/app/api/bookingService';
import toast from 'react-hot-toast';
import ShowConfirm from '@/app/hotel/[hotelId]/FormConfirmBooking';
import { useTranslation } from 'react-i18next';
import { translateText } from "@/lib/translate";
import { CheckMobilePhone } from '@/app/components/HOC/ResponsiveCustom.';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Image from 'next/image';
type Props = {
    open: boolean;
    onClose: () => void;
    room: RoomAvailable | null;
    checkIn: string;
    checkOut: string;
};


export default function RoomDetailModal({ open, onClose, room, checkIn, checkOut }: Props) {
    const [fullRoom, setFullRoom] = useState<RoomType | null>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { t, i18n } = useTranslation();
    const { user } = useSelector((state: RootState) => state.userSlice);
    const router = useRouter();
    const handleBooking = async (nights: number, checkInDate: string, checkOutDate: string, voucherCode: string, finalPrice: number) => {
        if (!room) return
        setIsBooking(true);
        try {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const payload = {
                roomId: room.id,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                guests: 2,
                voucherCode: voucherCode,
                finalPrice: finalPrice
            }
            const res = await postBookingRoom(payload);
            toast.success("Đặt phòng thành công");
            setShowConfirm(false);
            router.push("/profile/booking")
            onClose();
        } catch (error) {
            console.log('✌️error --->', error);
            toast.error("Phòng đã được đặt trong thời gian này");
        } finally {
            setIsBooking(false);
        }
    }
    useEffect(() => {
        if (!room || !open) return;

        const fetchRoomDetail = async () => {
            try {
                const res = await getRoomByRoomId(room.id);
                let roomData = res.data.data.room;

                // Dịch nếu ngôn ngữ không phải tiếng Việt
                if (i18n.language !== 'vi') {
                    const translatedName = await translateText(roomData.name, 'vi', i18n.language);
                    const translatedDescription = await translateText(roomData.description, 'vi', i18n.language);
                    roomData = {
                        ...roomData,
                        name: translatedName,
                        description: translatedDescription,
                    };
                }

                setFullRoom(roomData);
            } catch (error) {
                console.error('❌ Lỗi khi lấy chi tiết phòng:', error);
            }
        };
        fetchRoomDetail();
    }, [room, open, i18n.language]);

    if (!room || !fullRoom) return null;

    const discountedPrice = room.discount
        ? room.price * (1 - room.discount / 100)
        : room.price;
    const handleConfirmBooking = () => {
        if (user === null) {
            toast.error("Vui lòng đăng nhập để đặt phòng");
            return;
        }
        setShowConfirm(true);
    };
    if (!fullRoom || !fullRoom.images || fullRoom.images.length === 0) {
        return <div>Loading images...</div>;
    }
    return (
        <Modal open={open}
            onCancel={onClose}
            footer={null}
            width="80vw"
            centered
            style={{
                top: 20,
            }}>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-4 px-2 sm:px-4 md:px-6">
                {/* BÊN TRÁI: Hình ảnh */}
                {/* BÊN TRÁI: Hình ảnh */}
                <div className="space-y-4">
                    {/* 🖼️ Swiper ảnh chính - chỉ hiện ở tablet/desktop */}
                    <div className="hidden sm:block">
                        {fullRoom && (
                            <>
                                <Swiper
                                    modules={[Thumbs]}
                                    thumbs={{
                                        swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                                    }}
                                    loop={true}
                                    spaceBetween={10}
                                    className="rounded-lg overflow-hidden mb-2 h-[250px] sm:h-[320px] md:h-[400px]"
                                >
                                    <SwiperSlide>
                                        <Image
                                            src={fullRoom.image ?? ""}
                                            alt="main-room"
                                            width={500}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                    </SwiperSlide>
                                    {Array.isArray(fullRoom.images) &&
                                        fullRoom.images.map((img, i) => (
                                            <SwiperSlide key={i}>
                                                <Image
                                                    src={img.imageUrl ?? ""}
                                                    alt={`room-${i}`}
                                                    width={500}
                                                    height={300}
                                                    className="w-full h-full object-cover"
                                                />
                                            </SwiperSlide>
                                        ))}
                                </Swiper>

                                <Swiper
                                    modules={[Thumbs]}
                                    onSwiper={(swiper) => {
                                        if (!swiper.destroyed) setThumbsSwiper(swiper);
                                    }}
                                    watchSlidesProgress
                                    loop={false}
                                    spaceBetween={8}
                                    breakpoints={{
                                        640: { slidesPerView: 4, spaceBetween: 8 },
                                        1024: { slidesPerView: 5, spaceBetween: 10 },
                                    }}
                                    className="h-[70px] sm:h-[80px]"
                                >
                                    <SwiperSlide>
                                        <Image
                                            src={fullRoom.image ?? ""}
                                            alt="thumb-main"
                                            width={500}
                                            height={300}
                                            className="w-full h-full object-cover rounded border cursor-pointer hover:opacity-80 transition"
                                        />
                                    </SwiperSlide>
                                    {Array.isArray(fullRoom.images) &&
                                        fullRoom.images.map((img, i) => (
                                            <SwiperSlide key={i}>
                                                <Image
                                                    src={img.imageUrl ?? ""}
                                                    alt={`thumb-${i}`}
                                                    width={500}
                                                    height={300}
                                                    className="w-full h-full object-cover rounded border cursor-pointer hover:opacity-80 transition"
                                                />
                                            </SwiperSlide>
                                        ))}
                                </Swiper>
                            </>
                        )}
                        {/* 🧩 Tiện nghi — luôn hiển thị ở mọi kích thước */}
                        <div className='mt-3'>
                            <h3 className="text-lg font-semibold">{t("hotelId.text_47")}</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
                                {room.amenities.map((item, i) => (
                                    <li key={i} className="flex items-center gap-1">
                                        <AiOutlineCheck className="text-green-500" />
                                        {item.amenity.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* 🖼️ Carousel chỉ dành cho mobile */}
                    <div className="block sm:hidden">
                        <CheckMobilePhone>
                            <Carousel>
                                <CarouselContent>
                                    {fullRoom.images.map((img, i) => (
                                        <CarouselItem key={i}>
                                            <Image
                                                src={img.imageUrl ?? ""}
                                                alt={`room-${i}`}
                                                width={500}
                                                height={300}
                                                className="w-full h-[350px] object-cover"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </CheckMobilePhone>
                    </div>
                </div>
                {/* BÊN PHẢI: Thông tin */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-purple-700">{fullRoom.name}</h2>
                        <p className="text-gray-600 text-sm">
                            {t("hotelId.text_43")} • {t("hotelId.text_44")} {fullRoom.maxGuests} {t("hotelId.text_45")}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">{t("hotelId.text_46")}</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{fullRoom.description}</p>
                    </div>
                    {/* 🧩 Tiện nghi — luôn hiển thị ở mọi kích thước */}
                    <div className='mt-3 md:hidden'>
                        <h3 className="text-lg font-semibold">{t("hotelId.text_47")}</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
                            {room.amenities.map((item, i) => (
                                <li key={i} className="flex items-center gap-1">
                                    <AiOutlineCheck className="text-green-500" />
                                    {item.amenity.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{t("hotelId.text_48")}</h3>
                        <ul className="list-disc grid grid-cols-1 md:grid-cols-2 list-inside text-sm text-gray-700 leading-relaxed space-y-1">
                            <li>{t("hotelId.text_49")}</li>
                            <li>{t("hotelId.text_50")}</li>
                            <li>{t("hotelId.text_51")}</li>
                            <li>{t("hotelId.text_52")}</li>
                            <li>{t("hotelId.text_53")}</li>
                            <li>{t("hotelId.text_54")}</li>
                            <li>{t("hotelId.text_55")}</li>
                            <li>{t("hotelId.text_56")}</li>
                            <li>{t("hotelId.text_57")}</li>
                            <li>{t("hotelId.text_58")}</li>
                            <li>{t("hotelId.text_59")}</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{t("hotelId.text_60")}</h3>
                        <p className="text-sm text-gray-700">{t("hotelId.text_61")}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">{t("hotelId.text_62")}</h3>
                        {room.discount > 0 ? (
                            <div>
                                <p className="text-gray-500 line-through">{room.price.toLocaleString()} VND</p>
                                <p className="text-green-600">{t("hotelId.text_62")} {room.discount}%</p>
                                <p className="text-pink-600 font-bold text-lg">
                                    {discountedPrice.toLocaleString()} VND
                                </p>
                            </div>
                        ) : (
                            <p className="text-pink-600 font-bold text-lg">
                                {room.price.toLocaleString()} VND
                            </p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold">{t("hotelId.text_63")}</h3>
                        <ul className="text-sm space-y-1">
                            <li>✅ {t("hotelId.text_64")}</li>
                            <li>✅ {t("hotelId.text_65")}</li>
                            <li>✅ {t("hotelId.text_66")}</li>
                            <li>✅ {t("hotelId.text_67")}</li>
                        </ul>
                    </div>

                    <button
                        onClick={handleConfirmBooking}
                        disabled={isBooking}
                        className="w-full bg-purple-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                    >
                        {isBooking ? t("hotelId.text_68") : t("hotelId.text_69")}
                    </button>
                    <ShowConfirm
                        visible={showConfirm}
                        onCancel={() => setShowConfirm(false)}
                        onConfirm={(nights, checkInDate, checkOutDate, voucherCode, finalPrice) => {
                            handleBooking(nights, checkInDate, checkOutDate, voucherCode, finalPrice);
                        }}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        guests={room.maxGuests}
                        pricePerNight={room.price}
                        discount={room.discount}
                        roomId={room.id}
                    />


                </div>
            </div>
        </Modal>
    );
}
