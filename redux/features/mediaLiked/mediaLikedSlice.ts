// redux/features/mediaLiked/mediaLikedSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { fetchMediaLikedThunk } from "./mediaLikedThunks";

interface MediaLikedState {
  items: MediaItem[];
  currentLikedIndex: number;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
}

const initialState: MediaLikedState = {
  items: [],
  fetchStatus: "idle",
  fetchError: null,
  currentLikedIndex: 0,
};

const mediaLikedSlice = createSlice({
  name: "mediaLiked",
  initialState,
  reducers: {
    clearMediaState: (state) => {
      state.items = [];
      state.fetchStatus = "idle";
      state.fetchError = null;
    },
    addMediaItemToLiked: (state, action) => {
      const index = state.currentLikedIndex;
      console.log("Adding media item to feed at index:", index);
      state.items = [
        ...state.items.slice(0, index),
        action.payload,
        ...state.items.slice(index),
      ];
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
        state.items = action.payload;
      })
      .addCase(fetchMediaLikedThunk.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload as string;
      });
  },
});

export const { clearMediaState, addMediaItemToLiked, setCurrentLikedIndex } = mediaLikedSlice.actions;

export default mediaLikedSlice.reducer;
