// redux/features/mediaWord/mediaWordSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { fetchMediaWordThunk } from "./mediaWordThunks";
import { likeMediaApi } from "@/redux/apis/likeMediaApi";
import { unlikeMediaApi } from "@/redux/apis/unlikeMediaApi";
import { deleteMediaApi } from "@/redux/apis/deleteMediaApi";

// --- Types ---
interface WordResult {
  media: MediaItem[];
  totalPages: number | null;
  currentPage: number;
  pageSize: number;
}

interface MediaWordState {
  wordItems: Record<string, WordResult>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// --- Config ---
const MAX_CACHE_SIZE = 10;

// --- Helpers ---
function ensureMaxSize(state: MediaWordState) {
  const keys = Object.keys(state.wordItems);
  if (keys.length > MAX_CACHE_SIZE) {
    const oldest = keys[0];
    delete state.wordItems[oldest];
  }
}

// --- Initial State ---
const initialState: MediaWordState = {
  wordItems: {},
  status: "idle",
  error: null,
};

// --- Slice ---
const mediaWordSlice = createSlice({
  name: "mediaWord",
  initialState,
  reducers: {
    clearMediaState: (state) => {
      state.wordItems = {};
      state.status = "idle";
      state.error = null;
    },
    addMediaToWords: (state, action: PayloadAction<MediaItem>) => {
      const media = action.payload;

      if (!media.words || media.words.length === 0) return;

      for (const word of media.words) {
        const wordEntry = state.wordItems[word];
        if (!wordEntry) continue; // skip if word not in cache

        const exists = wordEntry.media.some((m) => m.id === media.id);
        if (!exists) {
          wordEntry.media.push(media);
        }
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

        if (action.meta.arg.word) {
          state.wordItems[action.meta.arg.word] = {
            media: action.payload.content,
            totalPages: action.payload.totalPages,
            currentPage: action.payload.page,
            pageSize: action.payload.pageSize,
          };
          ensureMaxSize(state);
        }
      })
      .addCase(fetchMediaWordThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addMatcher(
        likeMediaApi.endpoints.likeMedia.matchFulfilled,
        (state, action) => {
          const mediaId = action.meta.arg.originalArgs.media.id;

          for (const wordResult of Object.values(state.wordItems)) {
            const mediaItem = wordResult.media.find(
              (item) => item.id === mediaId,
            );

            if (mediaItem) {
              mediaItem.likeCount += 1;
            }
          }
        },
      )
      .addMatcher(
        unlikeMediaApi.endpoints.unlikeMedia.matchFulfilled,
        (state, action) => {
          const mediaId = action.meta.arg.originalArgs.mediaId;

          for (const wordResult of Object.values(state.wordItems)) {
            const mediaItem = wordResult.media.find(
              (item) => item.id === mediaId,
            );

            if (mediaItem) {
              mediaItem.likeCount = Math.max(0, mediaItem.likeCount - 1);
            }
          }
        },
      )
      .addMatcher(
        deleteMediaApi.endpoints.deleteMedia.matchFulfilled,
        (state, action) => {
          const mediaId = action.meta.arg.originalArgs.mediaId;

          for (const wordResult of Object.values(state.wordItems)) {
            wordResult.media = wordResult.media.filter(
              (item) => item.id !== mediaId,
            );
          }
        },
      );
  },
});

// --- Exports ---
export const {
  clearMediaState,
  addMediaToWords,
} = mediaWordSlice.actions;

export default mediaWordSlice.reducer;
