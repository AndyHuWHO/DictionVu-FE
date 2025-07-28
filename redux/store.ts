import { configureStore } from "@reduxjs/toolkit";
import { wordApi } from "./apis/wordApi";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";


export const store = configureStore({
  reducer: {
    [wordApi.reducerPath]: wordApi.reducer,
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(wordApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;