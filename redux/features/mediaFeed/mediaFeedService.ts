// redux/features/mediaFeed/mediaFeedService.ts

import axios from "axios";
import { MediaItem } from "@/redux/features/mediaUpload/types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const fetchMediaFeedFromAPI = async (
  // token: string,
  page = 0,
  size = 10
): Promise<MediaItem[]> => {
  const response = await axios.get<MediaItem[]>(
    `${API_BASE_URL}/api/media/feed`,
    {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      params: { page, size },
    }
  );

  return response.data;
};
