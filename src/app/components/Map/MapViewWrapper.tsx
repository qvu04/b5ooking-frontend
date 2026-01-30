'use client';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center h-96 w-full bg-gray-50 rounded-lg shadow animate-pulse">
            <svg
                className="animate-spin h-8 w-8 text-purple-600 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                />
            </svg>
            <span className="text-gray-600">Đang tải bản đồ...</span>
        </div>
    )
});

export default MapView;
