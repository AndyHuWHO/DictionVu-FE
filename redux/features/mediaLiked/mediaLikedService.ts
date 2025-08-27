// redux/features/mediaLiked/mediaLikedService.ts

import axios from "axios";
import { MediaItem, MediaPagedResponse } from "@/redux/features/mediaUpload/types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const fetchMediaLikedFromAPI = async (
  token: string,
  page = 0,
  size = 10
): Promise<MediaPagedResponse> => {
  const response = await axios.get<MediaPagedResponse>(
    `${API_BASE_URL}/api/media/likes/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, size },
    }
  );

  return response.data;
};

export const fetchLikedMediaIdsFromAPI = async (
  token: string
): Promise<string[]> => {
  const response = await axios.get<string[]>(
    `${API_BASE_URL}/api/media/likes/media-ids`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
