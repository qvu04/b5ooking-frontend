import { RoomAvailable } from "../types/hotelTypes";
import { https } from "./configService"
import { translateText } from "@/lib/translate";
export type SearchHotelParams = {
    hotelId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
};

export const getSearchHotel = (params: SearchHotelParams) => {
    return https.get<{ data: { availableRooms: RoomAvailable[] } }>("/api/room/getSearchAvailableHotels", {
        params,
        noLoading: true,
    },);
};
export const fetchSearchHotel = async (params: SearchHotelParams, language: string = "vi") => {
    const res = await getSearchHotel(params);
    let rooms = res.data.data.availableRooms;

    if (language !== "vi") {
        rooms = await Promise.all(rooms.map(async (room) => {
            const name = await translateText(room.name, "vi", language);
            const amenities = await Promise.all(room.amenities.map(async (item) => {
                const translatedName = await translateText(item.amenity.name, "vi", language);
                return {
                    ...item,
                    amenity: {
                        ...item.amenity,
                        name: translatedName,
                    },
                };
            }));

            return {
                ...room,
                name,
                amenities,
            };
        }));
    }

    return rooms;
};
export const getRoomByRoomId = (roomId: number) => {
    return https.get(`/api/room/getRoomById/${roomId}`, { noLoading: true });
}