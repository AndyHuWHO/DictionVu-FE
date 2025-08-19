// redux/features/mediaLiked/mediaLikedThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { fetchMediaLikedFromAPI } from "./mediaLikedService";
import { MediaItem } from "@/redux/features/mediaUpload/types";

export const fetchMediaLikedThunk = createAsyncThunk<
  MediaItem[],
  { page?: number; size?: number; token: string }
  // { state: RootState }
>("mediaLiked/fetchMedia", async ({ page = 0, size = 10, token }, thunkAPI) => {
  try {
    // const token = thunkAPI.getState().auth.token;
    if (!token) {
      throw new Error("Missing JWT token");
    }

    const mediaList = await fetchMediaLikedFromAPI(token, page, size);
    return mediaList;
  } catch (error: any) {
    console.error("Fetch media liked failed:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Failed to fetch media liked"
    );
  }
});

