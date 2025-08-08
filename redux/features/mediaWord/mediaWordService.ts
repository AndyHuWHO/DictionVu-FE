// redux/features/mediaWord/mediaWordService.ts

import axios from "axios";
import { MediaItem } from "@/redux/features/mediaUpload/types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const fetchMediaFromAPI = async (
  word: string,
  // token: string,
  page = 0,
  size = 10
): Promise<MediaItem[]> => {
  const response = await axios.get<MediaItem[]>(
    `${API_BASE_URL}/api/media/word/${encodeURIComponent(word)}`,
    {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      params: { page, size },
    }
  );

  return response.data;
};
