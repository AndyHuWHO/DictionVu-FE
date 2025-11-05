import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { VisitUserProfile } from "./types/visitUserProfile";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const visitProfileApi = createApi({
  reducerPath: "visitProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/user/profile/visit`,
  }),
  tagTypes: ['UserProfile'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<VisitUserProfile, string>({
      query: (userId) => `/${encodeURIComponent(userId)}`,
      providesTags: (result, error, userId) => [{ type: 'UserProfile', id: userId }],
      keepUnusedDataFor: 60 * 60,
    }),
  }),
});


export const { useGetUserProfileQuery } = visitProfileApi;