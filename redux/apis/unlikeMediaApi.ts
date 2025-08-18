import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const unlikeMediaApi = createApi({
  reducerPath: "unlikeMediaApi",
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
    unlikeMedia: builder.mutation<void, { mediaId: string }>({
      query: ({ mediaId }) => ({
        url: `/api/media/${mediaId}/like`,
        method: "DELETE",
        body: {},
      }),
    }),
  }),
});

export const { useUnlikeMediaMutation } = unlikeMediaApi;