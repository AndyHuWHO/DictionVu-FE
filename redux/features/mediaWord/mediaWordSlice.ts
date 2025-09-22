// redux/features/mediaWord/mediaWordSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { fetchMediaWordThunk } from "./mediaWordThunks";

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
    likeMediaInWord: (state, action: PayloadAction<string>) => {
      const mediaId = action.payload;
      for (const word in state.wordItems) {
        const mediaItem = state.wordItems[word].media.find(
          (m) => m.id === mediaId
        );
        if (mediaItem) {
          mediaItem.likeCount += 1;
        }
      }
    },
    unlikeMediaInWord: (state, action: PayloadAction<string>) => {
      const mediaId = action.payload;
      for (const word in state.wordItems) {
        const mediaItem = state.wordItems[word].media.find(
          (m) => m.id === mediaId
        );
        if (mediaItem) {
          mediaItem.likeCount -= 1;
        }
      }
    },
    deleteMediaInWord: (state, action: PayloadAction<string>) => {
      const mediaId = action.payload;
      for (const word in state.wordItems) {
        state.wordItems[word].media = state.wordItems[word].media.filter(
          (m) => m.id !== mediaId
        );
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
      });
  },
});

// --- Exports ---
export const {
  clearMediaState,
  addMediaToWords,
  likeMediaInWord,
  unlikeMediaInWord,
  deleteMediaInWord,
} = mediaWordSlice.actions;

export default mediaWordSlice.reducer;
