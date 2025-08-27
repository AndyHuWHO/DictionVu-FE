// redux/features/mediaLiked/mediaLikedSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import {
  fetchMediaLikedThunk,
  fetchLikedMediaIdsThunk,
} from "./mediaLikedThunks";

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

const initialState: MediaLikedState = {
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
};

const mediaLikedSlice = createSlice({
  name: "mediaLiked",
  initialState,
  reducers: {
    clearMediaLikedState: (state) => {
      state.items = [];
      state.likedList = [];
      state.fetchStatus = "idle";
      state.fetchError = null;
      state.fetchLikedMediaIdsStatus = "idle";
      state.fetchLikedMediaIdsError = null;
    },
    addMediaItemToLiked: (state, action) => {
      const index = state.currentLikedIndex;
      const itemToAdd = action.payload;
      const updatedItem = { ...itemToAdd, likeCount: itemToAdd.likeCount + 1 };
      state.items = [
        ...state.items.slice(0, index),
        updatedItem,
        ...state.items.slice(index),
      ];
      state.likedList = [...state.likedList, updatedItem.id];
    },
    deleteMediaItemFromLiked: (state, action) => {
      const mediaId = action.payload.id;
      state.items = state.items.filter((item) => item.id !== mediaId);
      state.likedList = state.likedList.filter((id) => id !== mediaId);
    },
    setCurrentLikedIndex: (state, action) => {
      if (state.currentLikedIndex !== action.payload) {
        state.currentLikedIndex = action.payload;
      }
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
        state.fetchError = action.payload as string;
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
        state.fetchLikedMediaIdsError = action.payload as string;
      });
  },
});

export const {
  clearMediaLikedState,
  addMediaItemToLiked,
  setCurrentLikedIndex,
  deleteMediaItemFromLiked,
} = mediaLikedSlice.actions;

export default mediaLikedSlice.reducer;
