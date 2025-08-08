import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { VisitUserProfile } from "./types/visitUserProfile";


export const visitProfileApi = createApi({
  reducerPath: "visitProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_VISIT_PROFILE_API_BASE_URL,
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