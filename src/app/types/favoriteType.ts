import { Hotel } from "./hotelTypes";

export type FavoriteItem = {
    id: number
    hotelId: number;
    hotel: Hotel;
};