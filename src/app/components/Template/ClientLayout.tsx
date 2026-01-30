'use client';

import { usePathname } from 'next/navigation';
import NavBarOnly from '../Header/NavBarOnly';
import HeaderBanner from '../Header/HeaderBanner';
import Footer from '../Footer/page';
import { ChatBox } from '../ChatBox';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    console.log('Current pathname:', pathname);
    const noHeaderRoutes = ['/login', '/register', '/admin', '/not-found'];
    const noBannerRoutes = ['/profile', '/about', '/blog']; // => KHÔNG hiện Banner
    const noFooterRoutes = ['/profile']; // => CHỈ ẩn Footer ở /profile
    const noChatRoutes = ['/login', '/register'];
    const shouldHideHeader = noHeaderRoutes.some(path => pathname.startsWith(path));
    const shouldHideBanner = noBannerRoutes.some(path => pathname.startsWith(path));
    const shouldHideFooter = noFooterRoutes.some(path => pathname.startsWith(path));
    const shouldHideChat = noChatRoutes.some(path => pathname.startsWith(path));
    console.log('Should hide chat:', shouldHideChat);
    return (
        <>
            {!shouldHideHeader && <NavBarOnly />}
            {!shouldHideHeader && !shouldHideBanner && <HeaderBanner />}
            {children}
            {!shouldHideHeader && !shouldHideFooter && <Footer />}
            {!shouldHideChat && <ChatBox />}
        </>
    );
}
