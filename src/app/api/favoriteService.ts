import { https } from "./configService"

export const getFavoriteList = () => {
    return https.get("/api/user/getAllFavoriteHotel");
}
export const addFavorite = (hotelId: number) => {
    return https.post(`/api/user/addFavoriteHotel/${hotelId}`);
}
export const removeFavorite = (hotelId: number) => {
    return https.delete(`/api/user/removeFavoriteHotel/${hotelId}`);
}