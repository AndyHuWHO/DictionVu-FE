// redux/features/mediaFeed/mediaFeedService.ts
import axios from "axios";
import { MediaPagedResponse } from "@/redux/features/mediaUpload/types";
 

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const fetchMediaFeedFromAPI = async (
  // token: string,
  page = 0,
): Promise<MediaPagedResponse> => {
  const response = await axios.get<MediaPagedResponse>(
    `${API_BASE_URL}/api/media/feed`,
    {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      params: { page },
    }
  );

  return response.data;
};
