import { configureStore } from "@reduxjs/toolkit";
import { wordApi } from "./apis/wordApi";


export const store = configureStore({
  reducer: {
    [wordApi.reducerPath]: wordApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(wordApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;