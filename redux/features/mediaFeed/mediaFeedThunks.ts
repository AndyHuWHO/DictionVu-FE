// redux/features/mediaFeed/mediaFeedThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { fetchMediaFeedFromAPI } from "./mediaFeedService";
import { MediaItem } from "@/redux/features/mediaUpload/types";

export const fetchMediaFeedThunk = createAsyncThunk<
  MediaItem[],
  { page?: number; size?: number },
  { state: RootState }
>("mediaFeed/fetchMedia", async ({ page = 0, size = 10 }, thunkAPI) => {
  try {
    // const token = thunkAPI.getState().auth.token;
    // if (!token) {
    //   throw new Error("Missing JWT token");
    // }

    const mediaList = await fetchMediaFeedFromAPI(page, size);
    return mediaList;
  } catch (error: any) {
    console.error("Fetch media feed failed:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to fetch media feed"
    );
  }
});


