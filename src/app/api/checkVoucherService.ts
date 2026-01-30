import { https } from "./configService"

export const checkVoucherService = (userId: number, roomId: number, checkIn: string, checkOut: string, voucherCode: string) => {
    return https.post("/api/user/checkVoucher", {
        userId,
        roomId,
        checkIn,
        checkOut,
        voucherCode
    })
}