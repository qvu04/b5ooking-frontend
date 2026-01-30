import { configureStore } from '@reduxjs/toolkit'
import userSlice from "@/redux/features/userSlice"
import loadingSlice from "@/redux/features/loadingSlice"
export const store = configureStore({
    reducer: {
        userSlice: userSlice,
        loadingSlice: loadingSlice,
    },
})

// Kiểu TypeScript nếu cần
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
