// redux/features/recentsearchSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  saveRecentSearches,
  clearRecentSearchesStorage,
} from "../utils/recentSearchStorage";

const MAX_RECENT_SEARCHES = 40;

interface RecentSearch {
  word: string;
  brief: string;
}

interface RecentSearchState {
  entries: RecentSearch[];
}

const initialState: RecentSearchState = {
  entries: [],
};

const recentSearchSlice = createSlice({
  name: "recentSearch",
  initialState,
  reducers: {
    addSearch: (state, action: PayloadAction<RecentSearch>) => {
      const newEntry = action.payload;

      // Remove existing entry if exists
      state.entries = state.entries.filter(
        (entry) => entry.word !== newEntry.word
      );

      // Insert at the beginning
      state.entries.unshift(newEntry);

      // Trim if over max length
      if (state.entries.length > MAX_RECENT_SEARCHES) {
        state.entries.pop();
      }

      saveRecentSearches(state.entries);
    },
    clearSearches: (state) => {
      state.entries = [];
      clearRecentSearchesStorage();
    },

    setRecentSearches: (state, action: PayloadAction<RecentSearch[]>) => {
      state.entries = action.payload;
    },
  },
});

export const { addSearch, clearSearches, setRecentSearches } =
  recentSearchSlice.actions;

export default recentSearchSlice.reducer;
