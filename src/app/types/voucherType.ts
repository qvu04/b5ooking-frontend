export type Voucher = {
    id: number;
    code: string;
    discount: number;
    isActive: boolean;
    expiresAt: string;
    perUserLimit: number;
    usageLimit: number;

}