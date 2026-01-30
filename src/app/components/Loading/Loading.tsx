"use client"
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Loading() {
    const { isLoading } = useSelector((state: RootState) => state.loadingSlice);
    return (
        isLoading ? (
            <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm z-[9999] flex items-center justify-center">
                <div className="w-[150px] h-[150px] rounded-s-md overflow-hidden">
                    <video
                        src="/videos/loading.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="none"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        ) : null
    );
}
