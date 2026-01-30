import { https } from "./configService";
import { BookingItem, BookingStatusEnum } from "../types/bookingType";

// 👇 Đây là kiểu thực tế từ API bạn đã log ra
interface BookingApiResponse {
    status: number;
    message: string;
    data: {
        bookings: BookingItem[];
    };
}

export const getBookingByStatus = (status: BookingStatusEnum) => {
    return https.get<BookingApiResponse>(`/api/user/getBookingByStatus`, {
        params: { status },
    });
};
export const getBookedRoom = () => {
    return https.get("/api/user/getFinishedBookings");

}
export const postBookingRoom = (data: {
    roomId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    voucherCode: string;
}) => {
    return https.post("/api/user/BookingRoom", data);
}
export const deleteBookingRoom = (id: number) => {
    return https.post(`/api/user/CancelBooking/${id}`);
}
export const paymentBookingService = (id: number) => {
    return https.post(`/api/user/ConfirmBooking/${id}`);
}