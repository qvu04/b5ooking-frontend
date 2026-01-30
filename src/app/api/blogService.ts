import { https } from "./configService"

export const getSomeBlogs = () => {
    return https.get("/api/blog/getSomeBlogs");
}
export const getBlogsbyPage = (page: number) => {
    return https.get(`/api/blog/getAllBlogs?page=${page}`, { noLoading: true });
}
export const getBlogsBySlug = (slug: string) => {
    return https.get(`/api/blog/getBlogBySlug/${slug}`);
}
export const getBlogsByLocationId = (locationId: string | number, page: number) => {
    return https.get(`/api/blog/getAllBlogsByLocationId/${locationId}`, { noLoading: true });
}