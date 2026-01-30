import 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        noLoading?: boolean; // thêm thuộc tính tùy chọn
    }
}