// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { wordApi } from "./apis/wordApi";
import { visitProfileApi } from "./apis/visitProfileApi";
import { likeMediaApi } from "./apis/likeMediaApi";
import { unlikeMediaApi } from "./apis/unlikeMediaApi";
import { deleteMediaApi } from "./apis/deleteMediaApi";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import mediaUploadReducer from "./features/mediaUpload/mediaUploadSlice";
import mediaWordReducer from "./features/mediaWord/mediaWordSlice";
import mediaFeedReducer from "./features/mediaFeed/mediaFeedSlice";
import mediaLikedReducer from "./features/mediaLiked/mediaLikedSlice";
import recentSearchesReducer from "./features/recentSearchSlice";

export const store = configureStore({
  reducer: {
    [wordApi.reducerPath]: wordApi.reducer,
    [visitProfileApi.reducerPath]: visitProfileApi.reducer,
    [likeMediaApi.reducerPath]: likeMediaApi.reducer,
    [unlikeMediaApi.reducerPath]: unlikeMediaApi.reducer,
    [deleteMediaApi.reducerPath]: deleteMediaApi.reducer,
    auth: authReducer,
    user: userReducer,
    mediaUpload: mediaUploadReducer,
    mediaWord: mediaWordReducer,
    mediaFeed: mediaFeedReducer,
    mediaLiked: mediaLikedReducer,
    recentSearches: recentSearchesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      wordApi.middleware,
      visitProfileApi.middleware,
      likeMediaApi.middleware,
      unlikeMediaApi.middleware,
      deleteMediaApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
