// context/AuthProvider.tsx
import React, { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native"; 
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { loadTokenFromStorage } from "@/redux/features/auth/authThunks";
import { setRecentSearches } from "@/redux/features/recentSearchSlice";
import { loadRecentSearches } from "@/redux/utils/recentSearchStorage";
import { fetchMediaFeedThunk } from "@/redux/features/mediaFeed/mediaFeedThunks";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const appState = useRef(AppState.currentState); 

  const hydrateApp = async () => {
    // Load JWT token (from SecureStore or persisted state)
    dispatch(loadTokenFromStorage());

    // Load recent search history
    const recentWords = await loadRecentSearches();
    dispatch(setRecentSearches(recentWords));

    // // Refresh feed 
    // dispatch(fetchMediaFeedThunk({}));
  };

  // Initial hydration
  useEffect(() => {
    hydrateApp();
  }, []);

  // Run hydrate when app returns to foreground
  useEffect(() => {
    const onChange = (nextState: AppStateStatus) => {
      const wasBg = /inactive|background/.test(appState.current);
      if (wasBg && nextState === "active") {
        // App resumed — rehydrate to avoid “frozen”/stale state
        hydrateApp();
      }
      appState.current = nextState;
    };

    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, []);

  return <>{children}</>;
}
