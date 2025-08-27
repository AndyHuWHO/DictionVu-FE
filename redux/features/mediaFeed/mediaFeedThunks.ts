// redux/features/mediaFeed/mediaFeedThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { fetchMediaFeedFromAPI } from "./mediaFeedService";
import { MediaPagedResponse } from "@/redux/features/mediaUpload/types";

export const fetchMediaFeedThunk = createAsyncThunk<
  MediaPagedResponse,
  { page?: number },
  { state: RootState }
>("mediaFeed/fetchMedia", async ({ page = 0,}, thunkAPI) => {
  const totalPages = thunkAPI.getState().mediaFeed.totalPages;
  if (totalPages === 0) {
    return thunkAPI.rejectWithValue("There's no media available");
  }
  try {
    page = thunkAPI.getState().mediaFeed.currentPage + 1;
    if (totalPages !== null && page >= totalPages) {
      page = 0;
    }

    const mediaList = await fetchMediaFeedFromAPI(page);
    return mediaList;
  } catch (error: any) {
    console.error("Fetch media feed failed:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to fetch media feed"
    );
  }
});


