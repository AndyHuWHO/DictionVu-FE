import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WordResponse } from "./types/wordDictionaryInfo";

export const wordApi = createApi({
  reducerPath: "wordApi",
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api/words'
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