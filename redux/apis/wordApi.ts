import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WordResponse } from "./types/wordDictionaryInfo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const wordApi = createApi({
  reducerPath: "wordApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/words`,
  }),
  tagTypes: ['Word'],
  endpoints: (builder) => ({
    getWordInfo: builder.query<WordResponse, string>({
      query: (term) => `/${encodeURIComponent(term)}`,
      providesTags: (result, error, term) => [{ type: 'Word', id: term }],
      keepUnusedDataFor: 60 * 60, 
    }),
  }),
});


export const { useGetWordInfoQuery } = wordApi;