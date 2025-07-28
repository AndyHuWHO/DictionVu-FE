// context/AuthProvider.tsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { loadTokenFromStorage } from "@/redux/features/auth/authThunks";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadTokenFromStorage());
  }, []);

  return <>{children}</>;
}
