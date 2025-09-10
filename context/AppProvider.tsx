// context/AuthProvider.tsx
import React, { useEffect } from "react";
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

  useEffect(() => {
    const hydrateApp = async () => {
      // Load JWT token
      dispatch(loadTokenFromStorage());

      // Load recent search history
      const recentWords = await loadRecentSearches();
      dispatch(setRecentSearches(recentWords));

      dispatch(fetchMediaFeedThunk({}));
    };

    hydrateApp();
  }, []);

  return <>{children}</>;
}
