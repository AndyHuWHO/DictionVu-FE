// redux/features/auth/types.ts
export interface AuthResponse {
  publicId: string;
  email: string;
  role: "USER" | "MEMBER" | "ADMIN";
  token: string;
}
