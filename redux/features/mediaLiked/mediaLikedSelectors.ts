// redux/features/mediaLiked/mediaLikedSelectors.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

export const selectLikedItems = (state: RootState) =>
  state.mediaLiked.likedList;

export const selectLikedIdsSet = createSelector(
  selectLikedItems,
  (likedItems) => new Set(likedItems)
);
