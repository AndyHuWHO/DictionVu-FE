// redux/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, logoutThunk, loadTokenFromStorage } from "./authThunks";

interface AuthState {
  token: string | null;
  publicId: string | null;
  email: string | null;
  role: string | null;
  status: "idle" | "loading" | "authenticated" | "error";
  error?: string;
}

const initialState: AuthState = {
  token: null,
  publicId: null,
  email: null,
  role: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { token, publicId, email, role } = action.payload;
        state.token = token;
        state.publicId = publicId;
        state.email = email;
        state.role = role;
        state.status = "authenticated";
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      .addCase(loadTokenFromStorage.fulfilled, (state, action) => {
        const token = action.payload;
        if (token) {
          state.token = token;
          state.status = "authenticated";
        }
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.token = null;
        state.publicId = null;
        state.email = null;
        state.role = null;
        state.status = "idle";
      });
  },
});

export default authSlice.reducer;
