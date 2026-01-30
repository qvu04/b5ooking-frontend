'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBlogsBySlug } from '@/app/api/blogService';
import { Blogs } from '@/app/types/blogType';
import { useTranslation } from 'react-i18next';
import { translateText } from "@/lib/translate";
import parse from "html-react-parser";
import { translateHTMLContent } from "@/utils/translateHTMLContent";
import Image from 'next/image';
export default function BlogDetail() {
    const { slug } = useParams();
    const [blog, setBlog] = useState<Blogs | null>(null);
    const { i18n, t } = useTranslation()
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const fetchBlogBySlug = async () => {
            try {
                if (typeof slug === 'string') {
                    const res = await getBlogsBySlug(slug);
                    let blogData: Blogs = res.data.data.blog;

                    // ✅ Dịch nếu ngôn ngữ khác 'vi'
                    if (i18n.language !== 'vi') {
                        const translatedTitle = await translateText(blogData.title, 'vi', i18n.language);
                        const translatedContent = await translateHTMLContent(blogData.content, 'vi', i18n.language); // ✅ SỬA Ở ĐÂY

                        blogData = {
                            ...blogData, // ép kiểu chắc chắn
                            title: translatedTitle,
                            content: translatedContent,
                        };
                    }

                    setBlog(blogData);
                }
            } catch (err) {
                console.error('Lỗi khi fetch blog:', err);
            }
        };

        fetchBlogBySlug();
    }, [slug, i18n.language]);
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) return null;
    if (!blog) return <p className="text-center py-10">{t("blogId.text_1")}</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl dark:text-[#fffffe] font-bold mb-4">{blog.title}</h1>
            <p className="text-gray-600 dark:text-[#94a1b2] mb-2">{t("blogId.text_2")} {blog.author}</p>
            <p className="text-sm text-gray-400 dark:text-[#94a1b2] mb-4">
                {t("blogId.text_3")} {new Date(blog.create_At).toLocaleDateString()}
            </p>
            <Image
                src={blog.image ?? ""}
                alt={blog.title}
                width={500}
                height={300}
                className="w-full h-auto mb-6 rounded shadow"
            />
            <div className="prose max-w-none">
                {parse(blog.content)}
            </div>
        </div>
    );
}
