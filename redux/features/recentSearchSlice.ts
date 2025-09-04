// redux/features/recentsearchSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveRecentSearches, clearRecentSearchesStorage } from "../utils/recentSearchStorage";


const MAX_RECENT_SEARCHES = 20;

interface RecentSearchState {
  words: string[];
}

const initialState: RecentSearchState = {
  words: [],
};

const recentSearchSlice = createSlice({
  name: "recentSearch",
  initialState,
  reducers: {
    addSearch: (state, action: PayloadAction<string>) => {
      const word = action.payload;
      state.words = state.words.filter((w) => w !== word);
      if (state.words.unshift(word) > MAX_RECENT_SEARCHES) {
        state.words.pop();
      }

    saveRecentSearches(state.words);
    },
    clearSearches: (state) => {
      state.words = [];
      clearRecentSearchesStorage();
    },

    setRecentSearches: (state, action: PayloadAction<string[]>) => {
      state.words = action.payload;
    },
  },
});

export const { addSearch, clearSearches, setRecentSearches } = recentSearchSlice.actions;

export default recentSearchSlice.reducer;
