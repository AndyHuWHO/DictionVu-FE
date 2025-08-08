// redux/features/mediaWord/mediaWordThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { fetchMediaFromAPI } from "./mediaWordService";
import { FetchMediaParams } from "./types";
import { MediaItem } from "@/redux/features/mediaUpload/types";

export const fetchMediaThunk = createAsyncThunk<
  MediaItem[],
  FetchMediaParams,
  { state: RootState }
>("mediaWord/fetchMedia", async ({ word, page = 0, size = 10 }, thunkAPI) => {
  try {
    // const token = thunkAPI.getState().auth.token;
    // if (!token) {
    //   throw new Error("Missing JWT token");
    // }

    const mediaList = await fetchMediaFromAPI(word, page, size);
    return mediaList;
  } catch (error: any) {
    console.error("Fetch media failed:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to fetch media"
    );
  }
});
