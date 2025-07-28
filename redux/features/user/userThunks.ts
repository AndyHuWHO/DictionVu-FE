import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserProfile } from "./userService";
import { RootState } from "@/redux/store";

export const fetchUserProfileThunk = createAsyncThunk(
  "user/fetchProfile",
  async (token: string, thunkAPI) => {
    try {
      return await fetchUserProfile(token);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);
