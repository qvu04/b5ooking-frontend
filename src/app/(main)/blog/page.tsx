"use client"
import { getBlogsbyPage, getBlogsByLocationId } from '@/app/api/blogService';
import { BlogsByPage, Pagination } from '@/app/types/blogType';
import { useEffect, useState } from 'react';
import { getAllLocation } from '@/app/api/locationService';
import { Locations } from '@/app/types/locationTypes';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { translateText } from "@/lib/translate";
import Image from 'next/image';
export default function Article() {
    const [page, setPage] = useState(1);
    const [blogs, setBlogs] = useState<BlogsByPage[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [locations, setLocations] = useState<Locations[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<number | 'all'>('all');
    const [mounted, setMounted] = useState(false);
    const { i18n, t } = useTranslation();
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await getAllLocation();
                let locationsData: Locations[] = res.data.data.locations;

                // Nếu không phải tiếng Việt thì dịch từng city
                if (i18n.language !== 'vi') {
                    locationsData = await Promise.all(
                        locationsData.map(async (loc) => {
                            const translatedCity = await translateText(loc.city, "vi", i18n.language);
                            return {
                                ...loc,
                                city: translatedCity,
                            };
                        })
                    );
                }

                setLocations(locationsData);
            } catch (error) {
                console.log('Lỗi lấy khu vực:', error);
            }
        };
        fetchLocations();
    }, [i18n.language]);
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                let res;
                if (selectedLocationId === 'all') {
                    res = await getBlogsbyPage(page);
                } else {
                    res = await getBlogsByLocationId(selectedLocationId, page);
                }
                let blogs: BlogsByPage[] = res.data.data.blogs;

                // Nếu không phải tiếng Việt thì dịch
                if (i18n.language !== 'vi') {
                    blogs = await Promise.all(
                        blogs.map(async (blog) => {
                            const title = await translateText(blog.title, "vi", i18n.language);
                            const summary = await translateText(blog.summary, "vi", i18n.language);
                            return {
                                ...blog,
                                title,
                                summary,
                            };
                        })
                    );
                }

                setBlogs(blogs);
                setPagination(res.data.data.pagination);
            } catch (error) {
                console.log('Lỗi lấy blog:', error);
            }
        };
        fetchBlogs();
    }, [selectedLocationId, page, i18n.language]);
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Giới thiệu trang Booking */}
            <div className="text-center mb-12">
                <h1 className="text-4xl text-black dark:text-[#fffffe] font-bold mb-4"><span>B5ooking:</span> {t("blog.text_1")}</h1>
                <p className="text-gray-600 dark:text-[#94a1b2] text-lg">
                    {t("blog.text_2")}
                </p>
            </div>

            {/* Filter Location */}
            <div className="flex gap-4 mb-6 overflow-x-auto">
                <button
                    className={`px-4 py-2 text-xs rounded ${selectedLocationId === 'all' ? 'bg-white dark:bg-[#7f5af0] dark:text-[#fffffe] shadow font-semibold' : 'dark:text-[#94a1b2]'}`}
                    onClick={() => {
                        setSelectedLocationId('all');
                        setPage(1);
                    }}
                >
                    {t("blog.text_3")}
                </button>
                {locations.map((loc) => (
                    <button
                        key={loc.id}
                        onClick={() => {
                            setSelectedLocationId(loc.id);
                            setPage(1);
                        }}
                        className={`px-2 text-xs py-2 rounded ${selectedLocationId === loc.id ? 'bg-white dark:bg-[#7f5af0] dark:text-[#fffffe] shadow font-semibold' : 'dark:text-[#94a1b2]'}`}
                    >
                        {loc.city}
                    </button>
                ))}
            </div>

            {/* Blog Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <Link href={`/blog/${blog.slug}`} key={blog.id} className="border rounded p-4 shadow">
                        <Image
                            src={blog.image ?? ""}
                            alt={blog.title}
                            width={500}
                            height={300}
                            className="w-full h-48 object-cover rounded" />
                        <h2 className="text-xl font-semibold dark:text-[#fffffe] mt-2">{blog.title}</h2>
                        <p className="text-gray-600 dark:text-[#94a1b2] text-sm mt-1">{blog.summary}</p>
                        <p className="text-gray-400 dark:text-[#94a1b2] text-xs mt-1">
                            {new Date(blog.create_At).toLocaleDateString()}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-[#7f5af0] text-[#fffffe] rounded disabled:opacity-50"
                    >
                        {t("blog.text_4")}
                    </button>
                    <span>
                        Trang {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                        disabled={page === pagination.totalPages}
                        className="px-4 py-2 bg-[#7f5af0] text-[#fffffe] rounded disabled:opacity-50"
                    >
                        {t("blog.text_5")}
                    </button>
                </div>
            )}
        </div>
    );
}