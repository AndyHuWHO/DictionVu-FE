import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "./userTypes";
import { fetchUserProfileThunk } from "./userThunks";

interface UserState {
  profile: UserProfile | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfileThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfileThunk.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.status = "success";
        state.profile = action.payload;
      })
      .addCase(fetchUserProfileThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
