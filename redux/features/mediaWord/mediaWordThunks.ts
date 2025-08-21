// redux/features/mediaWord/mediaWordThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { fetchMediaWordFromAPI } from "./mediaWordService";
import { FetchMediaParams } from "./types";
import { MediaPagedResponse } from "@/redux/features/mediaUpload/types";

// Currently not using current page or total pages, simply only fetch the first page
export const fetchMediaWordThunk = createAsyncThunk<
  MediaPagedResponse,
  FetchMediaParams,
  { state: RootState }
>("mediaWord/fetchMedia", async ({ word, page = 0, size = 10 }, thunkAPI) => {
  try {
    const mediaList = await fetchMediaWordFromAPI(word, page, size);
    return mediaList;
  } catch (error: any) {
    console.error("Fetch media word failed:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to fetch media word"
    );
  }
});
