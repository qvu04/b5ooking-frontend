// utils/slug.ts
export const toSlug = (str: string): string => {
    return str
        .toLowerCase()
        .normalize("NFD") // Tách dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, "") // Xoá dấu
        .replace(/đ/g, "d") // thay đ -> d
        .replace(/[^a-z0-9 -]/g, "") // xoá ký tự đặc biệt
        .replace(/\s+/g, "-") // thay khoảng trắng bằng gạch ngang
        .replace(/-+/g, "-") // bỏ bớt gạch nối liên tục
        .replace(/^-+|-+$/g, ""); // bỏ gạch đầu/cuối
};
