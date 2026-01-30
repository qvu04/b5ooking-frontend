// src/redux/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"

// Dùng cho dispatch có kiểu AppDispatch (đã được khai báo trong store.ts)
export const useAppDispatch: () => AppDispatch = useDispatch

// Dùng cho selector có autocomplete type RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
