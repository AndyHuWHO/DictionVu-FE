// redux/features/mediaLiked/mediaLikedSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { MediaItem } from "@/redux/features/mediaUpload/types";
import {
  fetchMediaLikedThunk,
  fetchLikedMediaIdsThunk,
} from "./mediaLikedThunks";
import { likeMediaApi } from "@/redux/apis/likeMediaApi";
import { unlikeMediaApi } from "@/redux/apis/unlikeMediaApi";
import { deleteMediaApi } from "@/redux/apis/deleteMediaApi";

interface MediaLikedState {
  items: MediaItem[];
  currentLikedIndex: number;
  totalPages: number | null;
  pageSize: number;
  currentPage: number;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  likedList: string[];
  fetchLikedMediaIdsStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchLikedMediaIdsError: string | null;
}

const createInitialState = (): MediaLikedState => ({
  items: [],
  currentLikedIndex: 0,
  totalPages: null,
  pageSize: 10,
  currentPage: -1,
  fetchStatus: "idle",
  fetchError: null,
  likedList: [],
  fetchLikedMediaIdsStatus: "idle",
  fetchLikedMediaIdsError: null,
});

const mediaLikedSlice = createSlice({
  name: "mediaLiked",
  initialState: createInitialState(),
  reducers: {
    clearMediaLikedState: () => createInitialState(),
    setCurrentLikedIndex: (state, action: PayloadAction<number>) => {
      state.currentLikedIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMediaLikedThunk.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchMediaLikedThunk.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.items = [...state.items, ...action.payload.content].slice(-20);
        state.currentLikedIndex = state.items.length - 1 - (action.payload.content.length);
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.pageSize;

      })
      .addCase(fetchMediaLikedThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          action.payload ??
          action.error.message ??
          "Failed to fetch liked media";
      })
      .addCase(fetchLikedMediaIdsThunk.pending, (state) => {
        state.fetchLikedMediaIdsStatus = "loading";
        state.fetchLikedMediaIdsError = null;
      })
      .addCase(fetchLikedMediaIdsThunk.fulfilled, (state, action) => {
        state.fetchLikedMediaIdsStatus = "succeeded";
        state.likedList = action.payload;
      })
      .addCase(fetchLikedMediaIdsThunk.rejected, (state, action) => {
        state.fetchLikedMediaIdsStatus = "failed";
        state.fetchLikedMediaIdsError =
          action.payload ??
          action.error.message ??
          "Failed to fetch liked media IDs";
      })
      .addMatcher(
        likeMediaApi.endpoints.likeMedia.matchFulfilled,
        (state, action) => {
          const media = action.meta.arg.originalArgs.media;

          if (!state.likedList.includes(media.id)) {
            state.likedList.unshift(media.id);
          }

          const itemAlreadyExists = state.items.some(
            (item) => item.id === media.id,
          );

          if (!itemAlreadyExists) {
            const hadExistingItems = state.items.length > 0;

            state.items.unshift({
              ...media,
              likeCount: media.likeCount + 1,
            });

            if (hadExistingItems) {
              state.currentLikedIndex += 1;
            }
          }
        },
      )
      .addMatcher(
        unlikeMediaApi.endpoints.unlikeMedia.matchFulfilled,
        (state, action) => {
          const mediaId = action.meta.arg.originalArgs.mediaId;
          const removedIndex = state.items.findIndex(
            (item) => item.id === mediaId,
          );

          state.likedList = state.likedList.filter(
            (id) => id !== mediaId,
          );
          state.items = state.items.filter(
            (item) => item.id !== mediaId,
          );

          if (
            removedIndex !== -1 &&
            removedIndex < state.currentLikedIndex
          ) {
            state.currentLikedIndex -= 1;
          }

          state.currentLikedIndex = Math.min(
            state.currentLikedIndex,
            Math.max(0, state.items.length - 1),
          );
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
          state.likedList = state.likedList.filter(
            (id) => id !== mediaId,
          );

          if (
            removedIndex !== -1 &&
            removedIndex < state.currentLikedIndex
          ) {
            state.currentLikedIndex -= 1;
          }

          state.currentLikedIndex = Math.min(
            state.currentLikedIndex,
            Math.max(0, state.items.length - 1),
          );
        },
      );
  },
});

export const {
  clearMediaLikedState,
  setCurrentLikedIndex,
} = mediaLikedSlice.actions;

export default mediaLikedSlice.reducer;
