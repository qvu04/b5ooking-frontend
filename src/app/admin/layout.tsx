'use client';
import SidebarMenuAdmin from '../components/SidebarMenu/SidebarMenuAdmin';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { setUserLogoutAction } from '@/redux/features/userSlice';
import toast from 'react-hot-toast';
import { hideLoading, showLoading } from '@/redux/features/loadingSlice';
import Image from 'next/image';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = useSelector((state: RootState) => state.userSlice);
    const dispatch = useDispatch();
    const router = useRouter();

    // Đăng xuất
    const handleLogout = () => {
        dispatch(showLoading());
        setTimeout(() => {
            dispatch(setUserLogoutAction());
            toast.success('Đăng xuất thành công');
            router.push('/');
            dispatch(hideLoading());
        }, 2000);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-zinc-950">
            <SidebarMenuAdmin />

            {/* Khu vực chính */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 shadow-sm px-10 py-2">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1 basis-1/3">
                            <Link href="/" className="flex items-center gap-1">
                                <Image
                                    src="/images/logo-b5ooking.png"
                                    alt="logo"
                                    width={500}
                                    height={300}
                                    className="w-20 h-20 object-contain" />
                                <span className="text-xl font-bold text-[#6246ea]">B5ooking</span>
                            </Link>
                        </div>

                        {user && (
                            <div className="flex items-center gap-5">
                                <Link
                                    href={user?.role === 'ADMIN' ? '/admin' : '/profile'}
                                    className="flex items-center gap-3 hover:opacity-90 transition"
                                >
                                    {user?.avatar ? (
                                        <Image
                                            src={user.avatar ?? ""}
                                            alt="avatar"
                                            width={500}
                                            height={300}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-[#6246ea]"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#6246ea] flex items-center justify-center text-white">
                                            <FaUserAlt className="text-sm" />
                                        </div>
                                    )}
                                    <span className="text-lg font-bold text-zinc-700 dark:text-zinc-200">
                                        {user?.fullName}
                                    </span>
                                </Link>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg bg-[#6246ea] text-white hover:bg-[#5138c5] transition-all duration-200 shadow-sm hover:shadow-md">
                                            <FaSignOutAlt className="text-lg" />
                                            <span className="font-medium">Đăng xuất</span>
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Bạn có chắc chắn muốn đăng xuất?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Hành động này sẽ đăng xuất bạn khỏi hệ thống.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleLogout}>Đăng xuất</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>
                </header>
                {/* Nội dung chính */}
                <main className="flex-1 px-8 py-6 overflow-y-auto max-h-[calc(100vh-80px)] ml-64">
                    <div className="max-w-6xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-8 space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
