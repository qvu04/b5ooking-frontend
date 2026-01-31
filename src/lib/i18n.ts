"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import vi from "@/locales/vi/translation.json";
import en from "@/locales/en/translation.json";

// --- THÊM ĐOẠN NÀY ĐỂ DEBUG TRÊN VERCEL (Xem Logs trên web) ---
console.log("Check data VI loaded:", vi);
// -------------------------------------------------------------

const resources = {
    vi: {
        // Sửa dòng này: Kiểm tra nếu có .default thì lấy .default, không thì lấy vi
        translation: (vi as any)?.default || vi
    },
    en: {
        // Sửa dòng này tương tự
        translation: (en as any)?.default || en
    },
} as const;

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "vi",
        // Thêm debug: true để nó in lỗi chi tiết ra console nếu thiếu key
        debug: process.env.NODE_ENV === 'development',
        interpolation: { escapeValue: false },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
    });

export default i18n;