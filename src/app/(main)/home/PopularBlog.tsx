'use client';
import { getSomeBlogs } from '@/app/api/blogService';
import { Blogs } from '@/app/types/blogType';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { translateText } from "@/lib/translate";
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
const PopularBlog = () => {
    const [blogs, setBlogs] = useState<Blogs[] | null>(null);
    const { i18n, t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await getSomeBlogs();
                const blogs: Blogs[] = res.data.data.blogs;

                if (i18n.language === "vi") {
                    setBlogs(blogs);
                    return;
                }

                const translatedBlogs = await Promise.all(
                    blogs.map(async (blog) => {
                        const title = await translateText(blog.title, "vi", i18n.language);
                        const summary = await translateText(blog.summary, "vi", i18n.language);
                        return { ...blog, title, summary };
                    })
                );

                setBlogs(translatedBlogs);
            } catch (error) {
                console.log('✌️error --->', error);
            }
        };

        fetchBlogs();
    }, [i18n.language]);
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-2xl text-[#2b2c34] dark:text-[#fffffe] font-semibold mb-6">{t("home.blog_title")}</h2>

            <div className="flex overflow-x-auto gap-6 scrollbar-hide snap-x snap-mandatory">
                {blogs?.map((blog) => (
                    <Link
                        href={`/blog/${blog.slug}`}
                        key={blog.id}
                        className="min-w-[300px] max-w-sm flex-shrink-0 bg-white dark:bg-[#242629] border dark:border-gray-300 rounded-xl shadow-md snap-start"
                    >
                        <Image
                            src={blog.image}
                            width={500}
                            height={300}
                            className="w-full h-48 object-cover rounded-t-xl"
                            alt={blog.title}
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-[#2b2c34] dark:text-[#fffffe] line-clamp-2">
                                {blog.title}
                            </h3>
                            <p className="text-sm text-[#2b2c34] dark:text-[#94a1b2] mt-2 line-clamp-2">
                                {blog.summary}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PopularBlog;
