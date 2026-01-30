export interface TotalPayment {
    totalHotel: number;
    totalRevenueBooking: number;
    totalRoom: number;
    totalUser: number;
}
export interface UserManger {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    role: string;
}
export interface HotelManager {
    id: number;
    name: string;
    address: string;
    description: string;
    image: string;
    locationId: number;
    defaultRating: number;
    images: {
        id: number;
        url: string;
    }[];
    amenities: {
        amenityId: number;
        amenity: {
            id: number;
            name: string;
        };
    }[];
    location: {
        id: number;
        city: string;
    }
}
export interface HotelDetailManager {
    id: number;
    name: string;
    address: string;
    description: string;
    defaultRating: number;
    locationId: number;
    image?: string;
    location: {
        id: number;
        city: string;
    };
    images: {
        id: number;
        url: string;
    }[];
    amenities: {
        amenityId: number;
        amenity: {
            id: number;
            name: string;
        };
    }[];
}
export interface RoomManager {
    id: number;
    name: string;
    price: number;
    type: string;
    image: string;
    discount: number;
    maxGuests: number;
    description: string;
    hotelId: number;
    hotel: {
        id: number;
        name: string;
    };
    images: {
        id: number;
        url: string;
    }[];
    amenities: {
        amenityId: number;
        amenity: {
            id: number;
            name: string;
        };
    }[];
}
export interface RoomDetailManager {
    id: number;
    name: string;
    type: string;
    description: string;
    price: number;
    discount: number;
    maxGuests: number;
    hotelId: number;
    image?: string;
    hotel: {
        id: number;
        name: string;
    };
    images: {
        id: number;
        url: string;
    }[];
    amenities: {
        amenityId: number;
        amenity: {
            id: number;
            name: string;
        };
    }[];
}

export interface BookingManger {
    id: number;
    room: {
        id: number;
        name: string;
        image: string;
        type: string;
    }
    guests: number;
    totalPrice: number
    status: string;
    checkIn: string;
    checkOut: string;
    user: {
        id: number;
        fullName: string;
    }
}
export interface BlogManager {
    id: number;
    image: string;
    summary: string;
    title: string;
    content: string;
    author: string;
    location: {
        id: number;
        city: string;
    }
}
export interface BlogDetailManager {
    id: number;
    image: string;
    summary: string;
    title: string;
    content: string;
    author: string;
    location: {
        id: number;
        city: string;
    }
}
export interface HotelRevenue {
    hotelId: number;
    name: string;
    revenue: number;
    precent: number;
}
export interface PaymentRevenue {
    label: string;
    revenue: number;
}
export interface ImageItem {
    id: number;
    imageUrl: string;
    hotel: {
        id: number;
        name: string;
    };
    room: {
        id: number;
        name: string;
    };
}
export interface HotelOption {
    id: number;
    name: string;
}
export interface RoomOption {
    id: number;
    name: string;
    hotel: {
        id: number;
        name: string;
    }
}