import { AmenityType } from "./amenityType";
import { HotelInfo } from "./hotelTypes";

export interface RoomAmenity {
  id: number;
  roomId: number;
  amenityId: number;
  amenity: AmenityType;
}
export interface RoomType {
  name: string;
  type: string;
  price: number;
  discount: number;
  maxGuests: number;
  description: string;
  images: {
    id: number;
    imageUrl: string;

  }[];
  image: string;
  amenities: RoomAmenity[];
}

export interface RoomInfo {
  name: string;
  type: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  maxGuests: number;
  totalPrice: number;
  hotel: HotelInfo;
}

export interface BookedRoom {
  roomId: number;
  calculatedTotalPrice: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  status: string;
  room: RoomInfo;
}
