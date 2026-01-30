import { Suspense } from "react";
import BookingSuccessClient from "./BookingSuccessClient";

export default function PaymentPage() {
    return (
        <Suspense fallback={<p>Đang tải trang thanh toán...</p>}>
            <BookingSuccessClient />
        </Suspense>
    );
}
