import axios from "axios";

export const chatBoxService = async (
    data: { ask: string },
    user?: { id: number; fullname: string }
) => {
    let token = "";
    if (typeof window !== "undefined") {
        const userJson = localStorage.getItem("user");
        if (userJson) {
            const userInfo = JSON.parse(userJson);
            token = userInfo?.token_access;
        }
    }

    return axios.post(
        "http://localhost:8000/api/ai/ask",
        { ...data, user }, // ✅ gửi đúng cấu trúc để backend nhận userId
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
    );
};
