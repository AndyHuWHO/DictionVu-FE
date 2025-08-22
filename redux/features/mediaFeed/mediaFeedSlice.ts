// redux/features/mediaFeed/mediaFeedSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { fetchMediaFeedThunk } from "./mediaFeedThunks";

interface MediaFeedState {
  items: MediaItem[];
  currentFeedIndex: number;
  totalPages: number | null;
  pageSize: number;
  currentPage: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MediaFeedState = {
  items: [],
  currentFeedIndex: 0,
  totalPages: null,
  pageSize: 10,
  currentPage: -1,
  status: "idle",
  error: null,
};

const mediaFeedSlice = createSlice({
  name: "mediaFeed",
  initialState,
  reducers: {
    clearMediaFeedState: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
    likeMediaInFeed: (state, action) => {
      const mediaId = action.payload;
      const mediaItem = state.items.find((item) => item.id === mediaId);
      if (mediaItem) {
        mediaItem.likeCount += 1;
      }
    },
    unlikeMediaInFeed: (state, action) => {
      const mediaId = action.payload;
      const mediaItem = state.items.find((item) => item.id === mediaId);
      if (mediaItem) {
        mediaItem.likeCount -= 1;
      }
    },
    deleteMediaInFeed: (state, action) => {
      const mediaId = action.payload;
      state.items = state.items.filter((item) => item.id !== mediaId);
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
        const combined = [...state.items, ...action.payload.content];
        state.items = combined.slice(-40);
        state.currentFeedIndex = Math.min(state.currentFeedIndex, 18);
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchMediaFeedThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  clearMediaFeedState,
  addMediaItemToFeed,
  setCurrentFeedIndex,
  likeMediaInFeed,
  unlikeMediaInFeed,
  deleteMediaInFeed,
} = mediaFeedSlice.actions;

export default mediaFeedSlice.reducer;
