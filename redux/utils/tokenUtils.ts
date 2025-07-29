// redux/utils/tokenUtils.ts
import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string | null) => {
  if (!token) return false;
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};
