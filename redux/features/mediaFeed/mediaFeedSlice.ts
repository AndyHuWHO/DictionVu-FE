// redux/features/mediaFeed/mediaFeedSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { fetchMediaFeedThunk } from "./mediaFeedThunks";

interface MediaFeedState {
  items: MediaItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MediaFeedState = {
  items: [],
  status: "idle",
  error: null,
};

const mediaFeedSlice = createSlice({
  name: "mediaFeed",
  initialState,
  reducers: {
    clearMediaState: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaFeedThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMediaFeedThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMediaFeedThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearMediaState } = mediaFeedSlice.actions;

export default mediaFeedSlice.reducer;
