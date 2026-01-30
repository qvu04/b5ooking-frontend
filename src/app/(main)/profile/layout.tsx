import React from 'react';
import SidebarMenu from '@/app/components/SidebarMenu/SidebarMenu';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 dark:bg-[#16161a] ">
            {/* Sidebar trái - chỉ hiển thị ở desktop */}
            <aside className="hidden sm:block w-[280px] p-6 border-r bg-white dark:bg-[#16161a] min-h-screen">
                <SidebarMenu />
            </aside>

            {/* Nội dung chính */}
            <main className="flex-1 p-4 sm:p-8 bg-gray-50 dark:bg-[#16161a] max-w-screen-xl mx-auto w-full">
                {children}
            </main>

            {/* Bottom Navbar cho mobile */}
            <div className="block sm:hidden fixed bottom-0 dark:bg-[#16161a] left-0 right-0 z-50">
                <SidebarMenu />
            </div>
        </div>
    );
}
