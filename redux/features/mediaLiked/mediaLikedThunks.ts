// redux/features/mediaLiked/mediaLikedThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import {
  fetchMediaLikedFromAPI,
  fetchLikedMediaIdsFromAPI,
} from "./mediaLikedService";
import {
  MediaItem,
  MediaPagedResponse,
} from "@/redux/features/mediaUpload/types";

export const fetchMediaLikedThunk = createAsyncThunk<
  MediaPagedResponse,
  { page?: number; size?: number; token: string },
  { state: RootState }
>("mediaLiked/fetchMedia", async ({ page = 0, size = 10, token }, thunkAPI) => {
  if (!token) {
    throw new Error("Missing JWT token");
  }

  const totalPages = thunkAPI.getState().mediaLiked.totalPages;
  if (totalPages === 0) {
    return thunkAPI.rejectWithValue("There's no media available");
  }
  try {
    page = thunkAPI.getState().mediaLiked.currentPage + 1;
    if (totalPages !== null && page >= totalPages) {
      page = 0;
    }
    const mediaList = await fetchMediaLikedFromAPI(token, page, size);
    return mediaList;
  } catch (error: any) {
    console.error("Fetch media liked failed:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch media liked"
    );
  }
});

export const fetchLikedMediaIdsThunk = createAsyncThunk(
  "mediaLiked/fetchLikedMediaIds",
  async (token: string, thunkAPI) => {
    try {
      if (!token) {
        throw new Error("Missing JWT token");
      }
      const ids = await fetchLikedMediaIdsFromAPI(token);
      return ids;
    } catch (error: any) {
      console.error("Fetch liked media IDs failed:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch liked media IDs"
      );
    }
  }
);
