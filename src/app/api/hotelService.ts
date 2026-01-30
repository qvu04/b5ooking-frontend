import { Hotels } from "../types/hotelTypes";
import { https } from "./configService"
import { translateText } from "@/lib/translate";
export const getHotelsByLocation = (locationId: number) => {
    return https.get(`/api/hotel/getHotelsByLocation/${locationId}`, { noLoading: true });
}
export const fetchHotelByLocation = async (locationId: number, lang: string): Promise<Hotels[]> => {
    try {
        const res = await getHotelsByLocation(locationId);
        const hotel: Hotels[] = res.data.data.hotels;
        if (lang === "vi") return hotel;
        const translateHotel = await Promise.all(
            hotel.map(async (hotel) => {
                const name = await translateText(hotel.name, "vi", lang);
                const address = await translateText(hotel.address, "vi", lang);
                return { ...hotel, name, address };
            })
        )
        return translateHotel;
    } catch (error) {
        console.log('✌️error --->', error);
        return [];
    }
}
export const getHotelsbyHotelId = (hotelId: number) => {
    return https.get(`/api/hotel/getHotelById/${hotelId}`)
}
export const postReviewHotel = (hotelId: number, data: { rating: number, comment: string }) => {
    return https.post(`/api/user/addReview/${hotelId}`, data);
}