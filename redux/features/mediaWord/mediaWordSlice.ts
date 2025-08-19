// redux/features/mediaWord/mediaWordSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { fetchMediaWordThunk } from "./mediaWordThunks";

interface MediaWordState {
  items: MediaItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MediaWordState = {
  items: [],
  status: "idle",
  error: null,
};

const mediaWordSlice = createSlice({
  name: "mediaWord",
  initialState,
  reducers: {
    clearMediaState: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
    likeMediaInWord: (state, action) => {
      const mediaId = action.payload;
      const mediaItem = state.items.find((item) => item.id === mediaId);
      if (mediaItem) {
        mediaItem.likeCount += 1;
      }
    },
    unlikeMediaInWord: (state, action) => {
      const mediaId = action.payload;
      const mediaItem = state.items.find((item) => item.id === mediaId);
      if (mediaItem) {
        mediaItem.likeCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaWordThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMediaWordThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMediaWordThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearMediaState, likeMediaInWord, unlikeMediaInWord } =
  mediaWordSlice.actions;

export default mediaWordSlice.reducer;
