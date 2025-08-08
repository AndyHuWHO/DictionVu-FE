// redux/features/mediaWord/mediaWordSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { fetchMediaThunk } from "./mediaWordThunks";

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMediaThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMediaThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearMediaState } = mediaWordSlice.actions;

export default mediaWordSlice.reducer;
