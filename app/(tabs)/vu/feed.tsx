// app/(tabs)/media/index.tsx
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { fetchMediaFeedThunk } from "@/redux/features/mediaFeed/mediaFeedThunks";
import MediaPager from "@/components/media/MediaPager";

export default function FeedTopTabScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const media = useSelector((state: RootState) => state.mediaFeed.items);
  const currentIndex = useSelector((state: RootState) => state.mediaFeed.currentIndex);
  const status = useSelector((state: RootState) => state.mediaFeed.status);
  const error = useSelector((state: RootState) => state.mediaFeed.error);

  useEffect(() => {
    if (currentIndex === media.length - 1 || media.length === 0) {
      console.log("Fetching media feed...");
      dispatch(fetchMediaFeedThunk({}));
    }
  }, [dispatch, currentIndex]);

  if (status === "loading") {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (status === "failed") {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>
          Failed to load media: {error}
        </ThemedText>
      </ThemedView>
    );
  }

  if (media.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>No media feed were found"</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <MediaPager media={media} context="feed" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
