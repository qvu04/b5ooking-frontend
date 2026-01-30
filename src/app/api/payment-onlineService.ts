import { https } from "./configService"

export const paymentOnlineService = (bookingId: number, lang: string = "vi") => {
    return https.post("/api/user/createStripeSession", {
        bookingId,
        lang
    })
}
export const verifyPaymentOnlineService = (sessionId: string) => {
    return https.get(`/api/user/verifyStripeSession/${sessionId}`);
}