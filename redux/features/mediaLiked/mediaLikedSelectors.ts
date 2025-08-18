// redux/features/mediaLiked/mediaLikedSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

export const selectLikedItems = (state: RootState) => state.mediaLiked.items;

export const selectLikedIdSet = createSelector([selectLikedItems], (items) => {
  // Returns the same Set reference unless items reference changes
  return new Set(items.map((m) => m.id));
});
