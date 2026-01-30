import { RoomType } from "./roomType";

export enum BookingStatusEnum {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELED = "CANCELED",
    FINISHED = "FINISHED",
}

export interface BookingItem {
    id: number;
    userId: number;
    roomId: number;
    checkIn: string;
    checkOut: string;
    status: BookingStatusEnum;
    guests: number;
    totalPrice: number;
    create_At: string;
    update_At: string;
    nights: number;
    pricePerNight: number;
    calculatedTotalPrice: number;
    room: RoomType & {
        hotel: {
            id: number;
            name: string;
            address: string;
            description: string;
            image: string;
            averageRating: number;
            defaultRating: number;
            locationId: number;
            create_At: string;
            update_At: string;
        };
    };
}
