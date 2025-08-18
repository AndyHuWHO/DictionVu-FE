// redux/features/mediaFeed/mediaFeedSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { fetchMediaFeedThunk } from "./mediaFeedThunks";

interface MediaFeedState {
  items: MediaItem[];
  currentFeedIndex: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MediaFeedState = {
  items: [],
  status: "idle",
  error: null,
  currentFeedIndex: 0,
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
    addMediaItemToFeed: (state, action) => {
      const index = state.currentFeedIndex;
      console.log("Adding media item to feed at index:", index);
      state.items = [
        ...state.items.slice(0, index),
        action.payload,
        ...state.items.slice(index),
      ];
    },
    setCurrentFeedIndex: (state, action) => {
      if (state.currentFeedIndex !== action.payload) {
        state.currentFeedIndex = action.payload;
      }
      
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

export const { clearMediaState, addMediaItemToFeed, setCurrentFeedIndex } = mediaFeedSlice.actions;

export default mediaFeedSlice.reducer;
