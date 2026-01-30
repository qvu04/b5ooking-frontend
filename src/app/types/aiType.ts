export type AiResponse = {
    data: any[];
    onClose?: () => void;
};
export interface AiResponseBooking {
    data: {
        bookings?: any[];
        totalAmount?: number;
        text?: string;
        [key: string]: any;
    } | any[];
}