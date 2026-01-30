import { https } from "./configService"

export const updateUserService = (data: FormData) => {
    return https.patch("/api/user/update-profile", data);
};