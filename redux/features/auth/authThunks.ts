import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest } from "./authService";
import { saveToken, deleteToken, getToken } from "./storage";
import { fetchUserProfileThunk } from "../user/userThunks";

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

      await thunkAPI.dispatch(fetchUserProfileThunk(result.token));

      return result;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Load token on app start
export const loadTokenFromStorage = createAsyncThunk(
  "auth/loadToken",
  async (_, thunkAPI) => {
    try {
      const token = await getToken();
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
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await deleteToken();
});
