import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const deleteMediaApi = createApi({
  reducerPath: "deleteMediaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    deleteMedia: builder.mutation<void, { mediaId: string }>({
      query: ({ mediaId }) => ({
        url: `/api/media/${mediaId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteMediaMutation } = deleteMediaApi;
