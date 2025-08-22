// redux/features/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest } from "./authService";
import { saveToken, deleteToken, getToken } from "./storage";
import { fetchUserProfileThunk } from "../user/userThunks";
import { isTokenExpired } from "@/redux/utils/tokenUtils";
import { clearMediaLikedState } from "../mediaLiked/mediaLikedSlice";
import { fetchMediaLikedThunk } from "../mediaLiked/mediaLikedThunks";
import { clearUserState } from "../user/userSlice";
import { clearAuthState } from "./authSlice";

// Login thunk
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const result = await loginRequest(email, password);
      await saveToken(result.token);
      await thunkAPI.dispatch(fetchMediaLikedThunk({ token: result.token }));
      await thunkAPI.dispatch(fetchUserProfileThunk(result.token));

      return result;
    } catch (err: any) {
      const res = err.response?.data;

      const validationError =
        res?.validationErrors?.email || res?.validationErrors?.password;

      const message =
        validationError ||
        res?.error ||
        res?.message ||
        err.message ||
        "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Load token on app start
export const loadTokenFromStorage = createAsyncThunk(
  "auth/loadToken",
  async (_, thunkAPI) => {
    try {
      const token = await getToken();
      if (!isTokenExpired(token)) {
        await thunkAPI.dispatch(logoutThunk());
        return thunkAPI.rejectWithValue("Token expired");
      }
      if (token) {
        await thunkAPI.dispatch(fetchUserProfileThunk(token));
      }
      return token;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Logout thunk: clear SecureStore
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    await deleteToken();
    thunkAPI.dispatch(clearAuthState());
    thunkAPI.dispatch(clearMediaLikedState());
    thunkAPI.dispatch(clearUserState());
  }
);
