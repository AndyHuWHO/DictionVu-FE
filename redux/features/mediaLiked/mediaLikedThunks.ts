// redux/features/mediaLiked/mediaLikedThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import {
  fetchMediaLikedFromAPI,
  fetchLikedMediaIdsFromAPI,
} from "./mediaLikedService";
import type {
  MediaPagedResponse,
} from "@/redux/features/mediaUpload/types";

type MediaLikedThunkConfig = {
  state: RootState;
  rejectValue: string;
};

type RejectStringThunkConfig = {
  rejectValue: string;
};

const getErrorMessage = (error: any, fallback: string): string => {
  return (
    error.response?.data?.message ??
    error.response?.data?.error ??
    error.message ??
    fallback
  );
};

export const fetchMediaLikedThunk = createAsyncThunk<
  MediaPagedResponse,
  { page?: number; size?: number; token: string },
  MediaLikedThunkConfig
>("mediaLiked/fetchMedia", async ({ page = 0, size = 10, token }, thunkAPI) => {
  if (!token) {
    return thunkAPI.rejectWithValue("Missing JWT token");
  }

  const totalPages = thunkAPI.getState().mediaLiked.totalPages;
  if (totalPages === 0) {
    return thunkAPI.rejectWithValue("There's no media available");
  }
  try {
    page = thunkAPI.getState().mediaLiked.currentPage + 1;
    if (totalPages !== null && page >= totalPages) {
      page = 0;
    }
    const mediaList = await fetchMediaLikedFromAPI(token, page, size);
    return mediaList;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to fetch media liked"),
    );
  }
});

export const fetchLikedMediaIdsThunk = createAsyncThunk<
  string[],
  string,
  RejectStringThunkConfig
>("mediaLiked/fetchLikedMediaIds", async (token, thunkAPI) => {
  if (!token) {
    return thunkAPI.rejectWithValue("Missing JWT token");
  }
  try {
    return await fetchLikedMediaIdsFromAPI(token);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to fetch liked media IDs"),
    );
  }
});
