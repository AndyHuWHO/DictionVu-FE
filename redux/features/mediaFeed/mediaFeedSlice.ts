// redux/features/mediaFeed/mediaFeedSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { fetchMediaFeedThunk } from "./mediaFeedThunks";
import { likeMediaApi } from "@/redux/apis/likeMediaApi";
import { unlikeMediaApi } from "@/redux/apis/unlikeMediaApi";
import { deleteMediaApi } from "@/redux/apis/deleteMediaApi";

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
        state.items = [...state.items, ...action.payload.content].slice(-40);
        state.currentFeedIndex = state.items.length - 1 - (action.payload.content.length);
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchMediaFeedThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addMatcher(
        likeMediaApi.endpoints.likeMedia.matchFulfilled,
        (state, action) => {
          const mediaId = action.meta.arg.originalArgs.media.id;
          const mediaItem = state.items.find(
            (item) => item.id === mediaId,
          );

          if (mediaItem) {
            mediaItem.likeCount += 1;
          }
        },
      )
      .addMatcher(
        unlikeMediaApi.endpoints.unlikeMedia.matchFulfilled,
        (state, action) => {
          const mediaId = action.meta.arg.originalArgs.mediaId;
          const mediaItem = state.items.find(
            (item) => item.id === mediaId,
          );

          if (mediaItem) {
            mediaItem.likeCount = Math.max(0, mediaItem.likeCount - 1);
          }
        },
      )
      .addMatcher(
        deleteMediaApi.endpoints.deleteMedia.matchFulfilled,
        (state, action) => {
          const mediaId = action.meta.arg.originalArgs.mediaId;
          const removedIndex = state.items.findIndex(
            (item) => item.id === mediaId,
          );

          state.items = state.items.filter(
            (item) => item.id !== mediaId,
          );

          if (
            removedIndex !== -1 &&
            removedIndex < state.currentFeedIndex
          ) {
            state.currentFeedIndex -= 1;
          }

          state.currentFeedIndex = Math.min(
            state.currentFeedIndex,
            Math.max(0, state.items.length - 1),
          );
        },
      );
  },
});

export const {
  clearMediaFeedState,
  addMediaItemToFeed,
  setCurrentFeedIndex,
} = mediaFeedSlice.actions;

export default mediaFeedSlice.reducer;
