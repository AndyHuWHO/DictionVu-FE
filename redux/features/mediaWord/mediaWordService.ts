// redux/features/mediaWord/mediaWordService.ts

import axios from "axios";
import {MediaPagedResponse } from "@/redux/features/mediaUpload/types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const fetchMediaWordFromAPI = async (
  word: string,
  page = 0,
  size = 10
): Promise<MediaPagedResponse> => {
  const response = await axios.get<MediaPagedResponse>(
    `${API_BASE_URL}/api/media/word/${encodeURIComponent(word)}`,
    {
      params: { page, size },
    }
  );

  return response.data;
};
