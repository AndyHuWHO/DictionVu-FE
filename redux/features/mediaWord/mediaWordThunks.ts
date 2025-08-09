// redux/features/mediaWord/mediaWordThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { fetchMediaWordFromAPI } from "./mediaWordService";
import { FetchMediaParams } from "./types";
import { MediaItem } from "@/redux/features/mediaUpload/types";

export const fetchMediaWordThunk = createAsyncThunk<
  MediaItem[],
  FetchMediaParams,
  { state: RootState }
>("mediaWord/fetchMedia", async ({ word, page = 0, size = 10 }, thunkAPI) => {
  try {
    // const token = thunkAPI.getState().auth.token;
    // if (!token) {
    //   throw new Error("Missing JWT token");
    // }

    const mediaList = await fetchMediaWordFromAPI(word, page, size);
    return mediaList;
  } catch (error: any) {
    console.error("Fetch media word failed:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to fetch media word"
    );
  }
});
