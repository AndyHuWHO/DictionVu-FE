import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MediaItem } from "@/redux/features/mediaUpload/types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const likeMediaApi = createApi({
  reducerPath: "likeMediaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    likeMedia: builder.mutation<void, { media: MediaItem }>({
      query: ({ media }) => ({
        url: `/api/media/${media.id}/like`,
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const { useLikeMediaMutation } = likeMediaApi;
