export interface ReviewType {
    comment: string;
    rating: number;
    user: {
        avatar: string;
        fullName: string;
    };
}
