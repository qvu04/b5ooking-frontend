import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Providers } from './providers';
import ClientLayout from "./components/Template/ClientLayout";
import { ReduxProvider } from '@/redux/provider'
import { Toaster } from "react-hot-toast";
import Loading from "./components/Loading/Loading";
import { ChatBox } from "./components/ChatBox";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "B5ooking - Đặt phòng trực tuyến",
  description: "Nền tảng đặt phòng khách sạn nhanh chóng, tiện lợi và đáng tin cậy",
  icons: {
    icon: '/images/logo_metadata.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className='dark' suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
          <ReduxProvider>
            <Providers>
              <Loading />
              <Toaster position="top-center" />
              <ClientLayout>{children}</ClientLayout>
              <ChatBox />
            </Providers>
          </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
