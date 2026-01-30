export interface Blogs {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: string;
    author: string;
    summary: string;
    create_At: string;
}
export interface BlogsByPage {
    id: number;
    image: string;
    summary: string;
    slug: string;
    title: string;
    create_At: string;
}
export interface Pagination {
    page: number;
    totalPages: number;
    limit: number;
}