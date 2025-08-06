// redux/features/auth/authService.ts
import axios from "axios";
import { AuthResponse } from "./types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const loginRequest = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_BASE_URL}/api/auth/login`,
    {
      email,
      password,
    }
  );
  return response.data;
};

