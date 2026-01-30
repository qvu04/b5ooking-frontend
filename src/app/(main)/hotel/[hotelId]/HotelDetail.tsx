'use client';
import { Hotels, RoomAvailable } from '@/app/types/hotelTypes';
import 'swiper/css';
import 'swiper/css/thumbs';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Thumbs } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper/types';
import { geocodeAddress } from '@/lib/geocode';
import { FiShare } from "react-icons/fi";
import { AiOutlineHeart, AiFillStar, AiOutlineCheckCircle, AiOutlineUser, AiOutlineCheck } from "react-icons/ai";
import type { RangePickerProps } from "antd/es/date-picker";
import MapView from '@/app/components/Map/MapViewWrapper';
import { FaUserAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import toast from 'react-hot-toast';
import { getHotelsbyHotelId, postReviewHotel } from '@/app/api/hotelService';
import { ReviewType } from '@/app/types/reviewType';
import { fetchSearchHotel } from '@/app/api/roomService';
import { DatePicker } from "antd";
import dayjs from "dayjs";
import RoomDetailModal from './RoomDetailModal';
import { addFavorite } from '@/app/api/favoriteService';
import { useTranslation } from 'react-i18next';
import { CheckDesktop, CheckMobilePhone, CheckTablet } from '@/app/components/HOC/ResponsiveCustom';
import Image from 'next/image';
type Props = {
    hotel: Hotels;
    onRefetch: () => void
};

export default function HotelDetailClient({ hotel, onRefetch }: Props) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState(hotel.reviews || []);
    const { user } = useSelector((state: RootState) => state.userSlice);
    const [mounted, setMounted] = useState(false);
    const [checkIn, setCheckIn] = useState<string>("");
    const [checkOut, setCheckOut] = useState<string>("");
    const [guests, setGuests] = useState<number>(1);
    const [availableRooms, setAvailableRooms] = useState<RoomAvailable[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<RoomAvailable | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (hotel?.address) {
            geocodeAddress(hotel.address).then((res) => {
                if (res) {
                    setCoords(res);
                } else {
                    // ❗Hiển thị fallback hoặc không hiển thị bản đồ
                    setCoords({ lat: 10.7769, lng: 106.7009 }); // fallback nếu muốn
                    // Hoặc setCoords(undefined); để ẩn map
                }
            });
        }
    }, [hotel?.address]);

    const handleDateChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
        setCheckIn(dateStrings[0]);
        setCheckOut(dateStrings[1]);
    };
    const handleSearch = async () => {
        if (!checkIn || !checkOut || !guests) {
            toast.error("Vui lòng chọn đầy đủ thông tin tìm kiếm");
            return;
        }

        try {
            const rooms = await fetchSearchHotel({
                hotelId: hotel.id,
                checkIn,
                checkOut,
                guests,
            }, i18n.language);
            setAvailableRooms(rooms);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm phòng:", error);
            toast.error("Không thể tìm kiếm phòng");
        }
    };
    const handleAddFavoriteHotel = async () => {
        try {
            const res = await addFavorite(hotel.id);
            console.log('✌️res --->', res);
            toast.success("Cảm ơn bạn đã yêu thích khách sạn");
        } catch (error) {
            console.log(error);
            toast.error("Bạn cần đăng nhập để yêu thích khách sạn này")
        }

    }
    useEffect(() => {
        if (!hotel.id) return;

        const fetchAvailableRooms = async () => {
            try {
                const rooms = await fetchSearchHotel({
                    hotelId: hotel.id,
                    checkIn: "2025-07-20",
                    checkOut: "2025-07-22",
                    guests: 2,
                }, i18n.language);
                setAvailableRooms(rooms);
            } catch (error) {
                console.error("Lỗi khi fetch phòng trống:", error);
            }
        };

        fetchAvailableRooms();
    }, [hotel.id]);
    const handlePostSubmitReview = async () => {
        try {
            if (!user) {
                toast.error("Vui lòng đăng nhập để đánh giá");
                return;
            }

            const res = await postReviewHotel(hotel.id, { rating, comment });
            console.log("✌️res --->", res);

            const newReview: ReviewType = {
                comment,
                rating,
                user: {
                    avatar: user?.avatar || "",
                    fullName: user?.fullName || "",
                },
            };

            setReviews((prev) => [newReview, ...prev]);
            setRating(0);
            setComment("");
            toast.success("Gửi đánh giá thành công!");

            // ✅ Gọi callback để refetch lại dữ liệu từ backend
            if (onRefetch) {
                await onRefetch();
            }

        } catch (error) {
            toast.error("Đánh giá thất bại. Vui lòng thử lại.");
            console.log("✌️error --->", error);
        }
    };


    useEffect(() => {
        setMounted(true);
    }, []);
    const handleOpenRoomDetail = (room: RoomAvailable) => {
        setSelectedRoom(room);
        console.log('✌️room --->', room);
        setIsModalOpen(true);
    };
    const handleCloseRoomDetail = () => {
        setSelectedRoom(null);
        setIsModalOpen(false);
    };
    if (!hotel || !hotel.images || hotel.images.length === 0) {
        return <div>Loading images...</div>;
    }
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Tiêu đề */}
                <h1 className="text-2xl text-center md:text-xl font-semibold mb-6 leading-snug">
                    {hotel.name} - {t("hotelId.title")}
                </h1>
                {/* Layout hình ảnh + bản đồ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Cột ảnh lớn + thumbnail */}
                    <div className="col-span-2">
                        <div className="flex flex-col-reverse space-y-4 space-y-reverse">
                            {/* 🖼️ Thumbnail - render trước để tránh lỗi */}
                            {hotel?.images?.length > 1 && (
                                <Swiper
                                    modules={[Thumbs]}
                                    onSwiper={(swiper) => {
                                        if (!swiper.destroyed && swiper !== thumbsSwiper) {
                                            setThumbsSwiper(swiper);
                                        }
                                    }}
                                    watchSlidesProgress
                                    loop={false}
                                    spaceBetween={8}
                                    breakpoints={{
                                        0: { slidesPerView: 3, spaceBetween: 6 },
                                        640: { slidesPerView: 4, spaceBetween: 8 },
                                        1024: { slidesPerView: 5, spaceBetween: 10 },
                                    }}
                                    className="w-full h-[60px] sm:h-[72px] md:h-[80px] mt-3"
                                >
                                    {hotel.images.map((img, i) => (
                                        <SwiperSlide key={i}>
                                            <Image
                                                src={img.imageUrl ?? ""}
                                                alt={`Thumbnail ${i}`}
                                                width={500}
                                                height={300}
                                                className="w-full h-full object-cover rounded-md border cursor-pointer hover:opacity-80 transition"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}

                            {/* 🖼️ Swiper ảnh lớn */}
                            {hotel?.images?.length > 0 && (
                                <Swiper
                                    modules={[Autoplay, Thumbs]}
                                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                                    loop={true}
                                    thumbs={{
                                        swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                                    }}
                                    slidesPerView={1}
                                    className="w-full rounded-lg overflow-hidden h-[220px] sm:h-[300px] md:h-[360px]"
                                >
                                    {hotel.images.map((img, i) => (
                                        <SwiperSlide key={i}>
                                            <Image
                                                src={img.imageUrl ?? ""}
                                                alt={`Slide ${i}`}
                                                width={500}
                                                height={300}
                                                className="w-full h-full object-cover"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>
                    </div>

                    {/* MapView responsive */}
                    <div className="col-span-1 md:mt-0 mt-4">
                        {coords && (
                            <>
                                {/* Tablet */}
                                <CheckTablet>
                                    <div>
                                        <div className="flex flex-col mb-4">
                                            <h2 className="text-lg font-medium mb-2">{t("hotelId.text_1")}</h2>
                                            <div className="flex items-center gap-6 text-gray-700">
                                                <button className="flex items-center gap-1 cursor-pointer">
                                                    <FiShare size={20} />
                                                    <span className='dark:text-[#94a1b2]'>{t("hotelId.text_2")}</span>
                                                </button>

                                                <button
                                                    onClick={handleAddFavoriteHotel}
                                                    className="flex items-center gap-1 cursor-pointer">
                                                    <AiOutlineHeart className="text-gray-600 hover:text-red-500 transition-colors duration-300" size={20} />
                                                    <span className='dark:text-[#94a1b2]'>{t("hotelId.text_3")}</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className='relative z-0 w-full h-[360px] overflow-hidden rounded-lg shadow'>
                                            <MapView lat={coords.lat} lng={coords.lng} name={hotel.name} />
                                        </div>
                                    </div>
                                </CheckTablet>

                                {/* Desktop */}
                                <CheckDesktop>
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-lg font-medium mb-2">{t("hotelId.text_1")}</h2>
                                            <div className="flex items-center gap-6 text-gray-700">
                                                <button className="flex items-center gap-1 cursor-pointer">
                                                    <FiShare size={20} />
                                                    <span className='dark:text-[#94a1b2]'>{t("hotelId.text_2")}</span>
                                                </button>

                                                <button
                                                    onClick={handleAddFavoriteHotel}
                                                    className="flex items-center gap-1 cursor-pointer">
                                                    <AiOutlineHeart className="text-gray-600 hover:text-red-500 transition-colors duration-300" size={20} />
                                                    <span className='dark:text-[#94a1b2]'>{t("hotelId.text_3")}</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className='relative z-0 w-full h-[400px] overflow-hidden rounded-lg shadow'>
                                            <MapView lat={coords.lat} lng={coords.lng} name={hotel.name} />
                                        </div>
                                    </div>
                                </CheckDesktop>
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <div className='mt-5'>
                        <h2 className='font-bold lg:text-xl text-xl '>{t("hotelId.text_4")} - {hotel.address}</h2>
                        <p className='pt-3 dark:text-[#94a1b2]'>
                            {t("hotelId.text_5")} {t("hotelId.text_6")} {t("hotelId.text_7")} {t("hotelId.text_8")}
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-1 text-yellow-400">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <AiFillStar
                                        key={index}
                                        className={
                                            index < Math.round(hotel.averageRating || hotel.defaultRating)
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }
                                        size={20}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-800 dark:text-[#94a1b2] font-medium">
                                {(hotel.averageRating || hotel.defaultRating).toFixed(1)} / 5
                            </span>
                            <span className="text-gray-500 dark:text-[#94a1b2]">({hotel.reviewCount} {t("hotelId.text_9")})</span>
                        </div>

                    </div>
                    <div className="mt-10 space-y-3">
                        <h2 className="text-xl font-semibold">{t("hotelId.text_10")}</h2>
                        <p className="text-gray-700 dark:text-[#94a1b2] whitespace-pre-line">{hotel.description}</p>
                    </div>
                    {/* Dịch vụ */}
                    <div className="mt-10 space-y-6">
                        {/* 1 */}
                        <div className="flex items-start gap-4 border-b border-gray-300 pb-6">
                            <Image
                                src="/images/door.png"
                                alt="check"
                                width={500}
                                height={300}
                                className="w-10 h-10 object-contain" />
                            <div>
                                <h3 className="text-lg font-semibold dark:text-[#fffffe] text-gray-900">{t("hotelId.text_12")}</h3>
                                <p className="text-gray-600 dark:text-[#94a1b2]">{t("hotelId.text_13")}</p>
                            </div>
                        </div>

                        {/* 2 */}
                        <div className="flex items-start gap-4 border-b border-gray-200 pb-6">
                            <Image
                                src="/images/check_room.png"
                                alt="check"
                                width={500}
                                height={300}
                                className="w-10 h-10 object-contain" />
                            <div>
                                <h3 className="text-lg font-semibold dark:text-[#fffffe] text-gray-900">{t("hotelId.text_14")}</h3>
                                <p className="text-gray-600 dark:text-[#94a1b2]">{t("hotelId.text_15")}</p>
                            </div>
                        </div>

                        {/* 3 */}
                        <div className="flex items-start gap-4">
                            <Image
                                src="/images/star.png"
                                alt="check"
                                width={500}
                                height={300}
                                className="w-10 h-10 object-contain" />
                            <div>
                                <h3 className="text-lg font-semibold  text-gray-900 dark:text-[#fffffe]">{t("hotelId.text_11")}</h3>
                                <p className="text-gray-600 dark:text-[#94a1b2]">{t("hotelId.text_16")}</p>
                            </div>
                        </div>
                    </div>
                    {/* Tiện nghi */}
                    <div className="mt-10">
                        <h2 className="text-xl font-semibold mb-4">{t("hotelId.text_17")}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {hotel.amenities.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 text-gray-700 dark:text-[#94a1b2]"
                                >
                                    <AiOutlineCheckCircle className="text-green-500" size={20} />
                                    <span>{item.amenity.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Các phòng trống */}
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-6">{t("hotelId.text_18")}</h2>
                        {/* Thanh tìm kiếm phòng trống */}
                        <div className="mt-4 border border-gray-300 dark:bg-[#242629] p-6 rounded-lg shadow-sm space-y-4">
                            <h3 className="text-xl font-semibold mb-2">{t("hotelId.text_19")}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Chọn ngày */}
                                <div>
                                    <label className="block mb-1 font-medium text-gray-700 dark:text-[#94a1b2]">{t("hotelId.text_20")}</label>
                                    <DatePicker.RangePicker
                                        format="YYYY-MM-DD"
                                        onChange={handleDateChange}
                                        className="w-full"
                                        disabledDate={(current) => current && current < dayjs().startOf("day")}
                                    />
                                </div>

                                {/* Số lượng khách */}
                                <div>
                                    <label className="block mb-1 font-medium text-gray-700 dark:text-[#94a1b2]">{t("hotelId.text_21")}</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={guests}
                                        onChange={(e) => setGuests(parseInt(e.target.value))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>

                                {/* Nút tìm kiếm */}
                                <div className="flex items-end">
                                    <button
                                        onClick={handleSearch}
                                        className="w-full bg-[#6246ea] dark:bg-[#7f5af0] cursor-pointer hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold"
                                    >
                                        {t("hotelId.text_22")}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <CheckDesktop>
                            {availableRooms.length > 0 ? (
                                <div className="w-full mt-5 overflow-x-auto">
                                    <table className="w-full border border-gray-300 overflow-hidden">

                                        <thead>
                                            <tr className="bg-gray-50 border dark:bg-[#242629] text-left">
                                                <th className="w-[30%] border border-gray-300 p-4 font-semibold text-lg dark:text-">{t("hotelId.text_23")}</th>
                                                <th className="w-[10%] border border-gray-300 p-4 font-semibold text-lg text-center">{t("hotelId.text_24")}</th>
                                                <th className="w-[15%] border border-gray-300 p-4 font-semibold text-lg text-center">{t("hotelId.text_25")}</th>
                                                <th className="w-[45%] border border-gray-300 p-4 font-semibold text-lg text-center">{t("hotelId.text_26")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {availableRooms.map((room, index) => (
                                                <tr key={index} className="border border-gray-300">
                                                    {/* Cột loại phòng */}
                                                    <td className="align-top border border-gray-300 p-4">
                                                        <button
                                                            className="font-bold hover:text-[#6246ea] cursor-pointer text-lg"
                                                            onClick={() => handleOpenRoomDetail(room)}
                                                        >{room.name}</button>
                                                        <p className="text-red-500 font-bold dark:text-[#7f5af0] text-sm mt-1">{t("hotelId.text_27")}</p>
                                                        <p className="mt-2 dark:text-[#94a1b2]">{t("hotelId.text_28")} 🛏️</p>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-700">
                                                            {room.amenities.map((item, i) => (
                                                                <div key={i} className="flex items-center gap-1 dark:text-[#94a1b2] ">
                                                                    <AiOutlineCheck className="text-green-500" size={14} />
                                                                    <span>{item.amenity.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>

                                                    {/* Cột lượng khách */}
                                                    <td className="align-top border border-gray-300 p-4 text-center">
                                                        <div className="flex justify-center gap-1 mt-2">
                                                            {Array.from({ length: room.maxGuests }).map((_, i) => (
                                                                <AiOutlineUser key={i} size={18} />
                                                            ))}
                                                        </div>
                                                    </td>

                                                    {/* Cột giá */}
                                                    <td className="align-top border border-gray-300 p-4 text-center">
                                                        {room.discount > 0 ? (
                                                            <div className="mt-2 space-y-1">
                                                                <p className="text-gray-400 line-through text-sm">
                                                                    {room.price.toLocaleString()} VND
                                                                </p>
                                                                <p className="text-green-600 text-xs font-medium">
                                                                    Giảm {room.discount}%
                                                                </p>
                                                                <p className="text-pink-600 text-lg font-semibold">
                                                                    {(room.price * (1 - room.discount / 100)).toLocaleString()} VND
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-pink-600 text-lg font-semibold mt-2">
                                                                {room.price.toLocaleString()} VND
                                                            </p>
                                                        )}
                                                    </td>

                                                    {/* Cột ưu đãi */}
                                                    <td className="align-top border border-gray-300 p-4 space-y-2">
                                                        <ul className="text-sm text-gray-700 dark:text-[#94a1b2] space-y-1">
                                                            <li className="flex items-start gap-2">
                                                                <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                                                <span>{t("hotelId.text_29")}</span>
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                                                <span>{t("hotelId.text_30")}</span>
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                                                <span>{t("hotelId.text_31")}</span>
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                                                <span><strong className='dark:text-[#7f5af0]'>{t("hotelId.text_32")} {t("hotelId.text_discount")}</strong> {t("hotelId.text_33")}</span>
                                                            </li>
                                                        </ul>
                                                        <button
                                                            onClick={() => handleOpenRoomDetail(room)}
                                                            className="mt-4 bg-purple-500 dark:bg-[#7f5af0] cursor-pointer hover:bg-purple-600 text-white px-6 py-2 rounded-full font-semibold">
                                                            {t("hotelId.text_34")}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center mt-6 text-red-500 font-medium text-base">
                                    {t("hotelId.text_35")}<br />
                                    {t("hotelId.text_36")}
                                </div>
                            )}
                        </CheckDesktop>
                        <CheckTablet>
                            {availableRooms.length > 0 ? (
                                <div className="w-full mt-5 overflow-x-auto">
                                    <table className="w-full border border-gray-300 overflow-hidden">
                                        <thead>
                                            <tr className="bg-[#e0e0f2] dark:bg-[#242629] text-left">
                                                <th className="w-[40%] border border-gray-300 p-3 text-base font-semibold dark:text-white">
                                                    {t("hotelId.text_23")}
                                                </th>
                                                <th className="w-[15%] border border-gray-300 p-3 text-base font-semibold text-center dark:text-white">
                                                    {t("hotelId.text_24")}
                                                </th>
                                                <th className="w-[20%] border border-gray-300 p-3 text-base font-semibold text-center dark:text-white">
                                                    {t("hotelId.text_25")}
                                                </th>
                                                <th className="w-[25%] border border-gray-300 p-3 text-base font-semibold text-center dark:text-white">
                                                    {t("hotelId.text_26")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {availableRooms.map((room, index) => (
                                                <tr key={index} className="border border-gray-300">
                                                    {/* Cột loại phòng */}
                                                    <td className="p-3 border border-gray-300 align-top">
                                                        <button
                                                            className="text-base font-semibold text-[#6246ea] hover:underline"
                                                            onClick={() => handleOpenRoomDetail(room)}
                                                        >
                                                            {room.name}
                                                        </button>
                                                        <p className="text-sm font-medium text-red-500 dark:text-[#7f5af0] mt-1">
                                                            {t("hotelId.text_27")}
                                                        </p>
                                                        <p className="text-sm mt-1 dark:text-[#94a1b2]">
                                                            {t("hotelId.text_28")} 🛏️
                                                        </p>
                                                        <div className="flex flex-wrap gap-2 mt-2 text-sm dark:text-[#94a1b2]">
                                                            {room.amenities.map((item, i) => (
                                                                <div key={i} className="flex items-center gap-1">
                                                                    <AiOutlineCheck className="text-green-500" size={14} />
                                                                    <span>{item.amenity.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>

                                                    {/* Cột lượng khách */}
                                                    <td className="p-3 border border-gray-300 text-center align-top">
                                                        <div className="flex justify-center gap-1 mt-2">
                                                            {Array.from({ length: room.maxGuests }).map((_, i) => (
                                                                <AiOutlineUser key={i} size={16} />
                                                            ))}
                                                        </div>
                                                    </td>

                                                    {/* Cột giá */}
                                                    <td className="p-3 border border-gray-300 text-center align-top">
                                                        {room.discount > 0 ? (
                                                            <div className="space-y-1 mt-1">
                                                                <p className="text-sm line-through text-gray-400">
                                                                    {room.price.toLocaleString()} VND
                                                                </p>
                                                                <p className="text-xs text-green-600">
                                                                    Giảm {room.discount}%
                                                                </p>
                                                                <p className="text-base font-semibold text-pink-600">
                                                                    {(room.price * (1 - room.discount / 100)).toLocaleString()} VND
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-base font-semibold text-pink-600 mt-2">
                                                                {room.price.toLocaleString()} VND
                                                            </p>
                                                        )}
                                                    </td>

                                                    {/* Cột ưu đãi */}
                                                    <td className="p-3 border space-y-2 align-top">
                                                        <ul className="text-sm text-gray-700 dark:text-[#94a1b2] space-y-1">
                                                            <li className="flex items-start gap-2">
                                                                <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                                                <span>{t("hotelId.text_29")}</span>
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                                                <span>{t("hotelId.text_30")}</span>
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                                                <span>{t("hotelId.text_31")}</span>
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                                                <span>
                                                                    <strong className="dark:text-[#7f5af0]">
                                                                        {t("hotelId.text_32")} {t("hotelId.text_discount")}
                                                                    </strong> {t("hotelId.text_33")}
                                                                </span>
                                                            </li>
                                                        </ul>
                                                        <button
                                                            onClick={() => handleOpenRoomDetail(room)}
                                                            className="w-full mt-3 bg-purple-500 hover:bg-purple-600 dark:bg-[#7f5af0] text-white text-sm py-2 rounded-full font-medium"
                                                        >
                                                            {t("hotelId.text_34")}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center mt-6 text-red-500 font-medium text-base">
                                    {t("hotelId.text_35")}<br />
                                    {t("hotelId.text_36")}
                                </div>
                            )}
                        </CheckTablet>
                    </div>
                    <CheckMobilePhone>
                        <div className="space-y-4 mt-5">
                            {availableRooms.map((room, index) => (
                                <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-[#1f1f2b]">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-base">{room.name}</h3>
                                        <button
                                            onClick={() => handleOpenRoomDetail(room)}
                                            className="text-sm text-[#6246ea] dark:text-[#7f5af0] underline"
                                        >
                                            {t("hotelId.text_34")}
                                        </button>
                                    </div>
                                    <p className="text-sm text-red-500 font-medium dark:text-[#7f5af0] mt-1">
                                        {t("hotelId.text_27")}
                                    </p>
                                    <p className="mt-1 text-sm dark:text-[#94a1b2]">{t("hotelId.text_28")} 🛏️</p>

                                    <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-700 dark:text-[#94a1b2]">
                                        {room.amenities.map((item, i) => (
                                            <div key={i} className="flex items-center gap-1">
                                                <AiOutlineCheck className="text-green-500" size={14} />
                                                <span>{item.amenity.name}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-3">
                                        <p className="text-sm text-gray-500">{t("hotelId.text_24")}:</p>
                                        <div className="flex gap-1 mt-1">
                                            {Array.from({ length: room.maxGuests }).map((_, i) => (
                                                <AiOutlineUser key={i} size={18} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        {room.discount > 0 ? (
                                            <div className="space-y-1">
                                                <p className="text-gray-400 line-through text-sm">
                                                    {room.price.toLocaleString()} VND
                                                </p>
                                                <p className="text-green-600 text-xs font-medium">
                                                    Giảm {room.discount}%
                                                </p>
                                                <p className="text-pink-600 text-lg font-semibold">
                                                    {(room.price * (1 - room.discount / 100)).toLocaleString()} VND
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-pink-600 text-lg font-semibold">
                                                {room.price.toLocaleString()} VND
                                            </p>
                                        )}
                                    </div>

                                    <ul className="mt-3 text-sm text-gray-700 dark:text-[#94a1b2] space-y-1">
                                        <li className="flex items-start gap-2">
                                            <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                            <span>{t("hotelId.text_29")}</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                            <span>{t("hotelId.text_30")}</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                            <span>{t("hotelId.text_31")}</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AiOutlineCheck className="text-green-500 mt-1" size={16} />
                                            <span>
                                                <strong className="dark:text-[#7f5af0]">{t("hotelId.text_32")} {t("hotelId.text_discount")}</strong> {t("hotelId.text_33")}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </CheckMobilePhone>

                    {/* Đánh giá của khách hàng */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">{t("hotelId.text_37")}</h2>
                        {/* Tổng quan rating */}
                        <CheckMobilePhone>
                            <div className="space-y-4 mb-8 px-2">
                                {([5, 4, 3, 2, 1] as const).map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        {/* Số sao */}
                                        <span className="min-w-[44px] text-sm font-medium text-gray-800 dark:text-white">
                                            {i} {t("hotelId.star")}
                                        </span>

                                        {/* Progress bar */}
                                        <div className="flex-1 bg-gray-200 dark:bg-[#33354a] rounded-full h-2 overflow-hidden relative">
                                            <div
                                                className="bg-yellow-400 h-full rounded-full transition-all duration-500 ease-in-out"
                                                style={{ width: `${hotel.ratingStats.percentages[i]}%` }}
                                            />
                                        </div>

                                        {/* Số lượt */}
                                        <span className="text-sm text-gray-500 dark:text-[#94a1b2] min-w-[48px] text-right">
                                            {hotel.ratingStats.count[i]} {t("hotelId.text_38")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CheckMobilePhone>
                        <CheckDesktop>
                            <div className="space-y-3 mb-8">
                                {([5, 4, 3, 2, 1] as const).map((i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <span className="w-10 text-sm font-medium">{i}<span className='ml-1'>{t("hotelId.star")}</span></span>
                                        <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                                            <div
                                                className="bg-yellow-400 h-full"
                                                style={{ width: `${hotel.ratingStats.percentages[i]}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-[#94a1b2] w-20 text-right">
                                            {hotel.ratingStats.count[i]} {t("hotelId.text_38")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CheckDesktop>
                        {/* Danh sách bình luận với Show More */}
                        <div className="grid gap-6 ">
                            {(showAllReviews ? reviews : reviews.slice(0, 2)).map((review, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-[#242629] rounded-lg shadow-md p-5 border border-gray-300"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        {review.user?.avatar ? (
                                            <Image
                                                src={review.user.avatar ?? ""}
                                                alt="avatar"
                                                width={500}
                                                height={300}
                                                className="w-12 h-12 rounded-full object-cover border"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                                <FaUserAlt className="text-sm" />
                                            </div>
                                        )}

                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-[#fffffe]">{review.user?.fullName}</p>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <AiFillStar
                                                        key={i}
                                                        size={16}
                                                        className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 dark:text-[#94a1b2] leading-relaxed text-sm">{review.comment}</p>
                                </div>
                            ))}
                        </div>

                        {/* Nút hiển thị thêm */}
                        {hotel.reviews.length > 2 && (
                            <div className="mt-6 text-center">
                                <button
                                    className="text-[#6246ea] dark:text-[#7f5af0] cursor-pointer hover:underline font-medium text-sm"
                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                >
                                    {showAllReviews ? t("hotelId.text_42") : t("hotelId.text_41")}
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Post bình luận */}
                    {/* Gửi đánh giá */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">{t("hotelId.text_39")}</h2>

                        <div className="bg-white dark:bg-[#242629]  border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
                            {/* Avatar + Tên + Chọn sao */}
                            {mounted && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        {user ? (
                                            // TRƯỜNG HỢP 1: ĐÃ ĐĂNG NHẬP (Có user)
                                            <div className="flex items-center gap-2">
                                                {user.avatar ? (
                                                    // Nếu có Avatar -> Hiện ảnh
                                                    <Image
                                                        src={user.avatar}
                                                        alt="Avatar"
                                                        width={50}
                                                        height={50}
                                                        className="w-8 h-8 rounded-full object-cover shadow-md"
                                                    />
                                                ) : (
                                                    // Nếu Avatar null/rỗng -> Hiện Icon mặc định
                                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white shadow-md">
                                                        <FaUserAlt className="text-sm" />
                                                    </div>
                                                )}

                                                {/* Luôn hiện tên khi đã đăng nhập */}
                                                <p className="text-sm font-medium text-gray-800 dark:text-[#fffffe]">
                                                    {user.fullName}
                                                </p>
                                            </div>
                                        ) : (
                                            // TRƯỜNG HỢP 2: CHƯA ĐĂNG NHẬP (User null)
                                            <p className="font-semibold text-lg text-gray-800 dark:text-[#fffffe]">
                                                Bạn cần đăng nhập để đánh giá
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <AiFillStar
                                                key={i}
                                                size={24}
                                                onClick={() => setRating(i + 1)}
                                                className={`cursor-pointer transition-all duration-150 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Textarea */}
                            <textarea
                                placeholder={t("hotelId.text_40")}
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-4 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 dark:text-[#94a1b2]"
                            ></textarea>

                            {/* Nút gửi */}
                            <div className="text-right">
                                <button
                                    disabled={!comment || rating === 0}
                                    onClick={handlePostSubmitReview}
                                    className={`px-6 py-2 rounded-full cursor-pointer font-semibold transition duration-300 ${comment && rating
                                        ? "bg-[#6246ea] dark:bg-[#7f5af0] text-white hover:bg-purple-700"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {t("hotelId.button")}
                                </button>
                            </div>
                        </div>
                        {selectedRoom && (
                            <RoomDetailModal
                                open={isModalOpen}
                                onClose={handleCloseRoomDetail}
                                room={selectedRoom}
                                checkIn={checkIn}
                                checkOut={checkOut}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
