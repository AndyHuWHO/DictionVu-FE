// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { wordApi } from "./apis/wordApi";
import { visitProfileApi } from "./apis/visitProfileApi";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import mediaUploadReducer from "./features/mediaUpload/mediaUploadSlice";
import mediaWordReducer from "./features/mediaWord/mediaWordSlice";



export const store = configureStore({
  reducer: {
    [wordApi.reducerPath]: wordApi.reducer,
    [visitProfileApi.reducerPath]: visitProfileApi.reducer,
    auth: authReducer,
    user: userReducer,
    mediaUpload: mediaUploadReducer,
    mediaWord: mediaWordReducer,
  },
  middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(wordApi.middleware, visitProfileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;