import { store } from "@/lib/store";
import { hideLoading, showLoading } from "@/redux/features/loadingSlice";
import axios from "axios";
import toast from "react-hot-toast";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const https = axios.create({
  baseURL: apiUrl,
});

// Interceptor request
https.interceptors.request.use(
  (config) => {
    if (!config.noLoading) {
      store.dispatch(showLoading());
    }

    if (typeof window !== "undefined") {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const userInfo = JSON.parse(userJson);
        const token = userInfo?.token_access;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor response — đã thêm phần auto logout
https.interceptors.response.use(
  (response) => {
    if (!response.config.noLoading) {
      setTimeout(() => store.dispatch(hideLoading()), 1000);
    }
    return response;
  },
  (error) => {
    if (!error.config?.noLoading) {
      store.dispatch(hideLoading());
    }

    // 👇 Thêm xử lý logout khi token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        // (Tùy bạn: có thể dispatch action clearUser nếu có Redux userSlice)
        // store.dispatch(clearUser());

        // Thông báo lỗi (nếu có dùng react-hot-toast hay message của antd)
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");

        // Chuyển hướng về login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
