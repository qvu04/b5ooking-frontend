import { AmenityType } from "./amenityType";
import { ReviewType } from "./reviewType";
import { RoomType } from "./roomType";

export interface Hotels {
    id: number;
    name: string;
    address: string;
    description: string;
    image: string;
    averageRating: number;
    defaultRating: number;
    availableRooms: RoomAvailable[];
    images: RoomImage[];
    amenities: {
        amenity: {
            name: string
        }
    }[];
    latitude?: number;
    longitude?: number;
    reviewCount: number;
    rooms: RoomType[];
    reviews: ReviewType[];
    ratingStats: {
        count: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        },
        percentages: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }
}
export type RoomImage = {
    id: number;
    imageUrl: string;
    RoomId: number;
    createdAt: string;
};
export type RoomAmenity = {
    id: number;
    roomId: number;
    amenityId: number;
    amenity: AmenityType;
};
export type RoomAvailable = {
    id: number;
    name: string;
    type: string;
    price: number;
    discount: number;
    description: string;
    maxGuests: number;
    image: string;
    hotelId: number;
    create_At: string;
    update_At: string;
    images: RoomImage[];
    amenities: RoomAmenity[];
};
export type TranslatedAvailableRoom = Omit<RoomAvailable, 'name' | 'amenities'> & {
  name: string;
  amenities: RoomAmenity[]; // với RoomAmenity chứa amenity.name kiểu string đã dịch
};
export interface HotelInfo {
    id: number;
    name: string;
    address: string;
    description: string;
    image: string;
    averageRating: number;
    defaultRating: number;
}
export type Hotel = {
    id: number;
    name: string;
    address: string;
    image: string;
    averageRating: number;
};