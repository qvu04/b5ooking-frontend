export type FormDataUpdateUser = {
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    avatar?: File | null;
}
export interface User {
    id: string;
    fullName: string;
    avatar?: string;
    role?: string;
    // Bắt buộc phải có các dòng dưới này:
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: string;
}
export interface UserState {
    user: User | null;
}