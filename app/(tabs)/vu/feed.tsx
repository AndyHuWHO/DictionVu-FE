// app/(tabs)/media/index.tsx
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { use, useEffect } from "react";
import { fetchMediaFeedThunk } from "@/redux/features/mediaFeed/mediaFeedThunks";
import { setCurrentFeedIndex } from "@/redux/features/mediaFeed/mediaFeedSlice";
import MediaList from "@/components/media/MediaList";
import { resetCrash } from "@/redux/features/videoPlayerCrashSlice";

export default function FeedTopTabScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const media = useSelector((state: RootState) => state.mediaFeed.items);
  const currentIndex = useSelector(
    (state: RootState) => state.mediaFeed.currentFeedIndex
  );
  const currentPage = useSelector(
    (state: RootState) => state.mediaFeed.currentPage
  );
  const totalPages = useSelector(
    (state: RootState) => state.mediaFeed.totalPages
  );
  const status = useSelector((state: RootState) => state.mediaFeed.status);
  const error = useSelector((state: RootState) => state.mediaFeed.error);
  const hasCrashed = useSelector(
    (state: RootState) => state.videoPlayerCrash.hasCrashed
  );


  useEffect(() => {
    if (
      totalPages == null ||
      (currentPage < totalPages - 1 &&
        (currentIndex === media.length - 1 || media.length === 0))
    ) {
      console.log("Fetching media feed...");
      dispatch(fetchMediaFeedThunk({}));
    }
  }, [dispatch, currentIndex]);

  useEffect(() => {
    console.log("There are", media.length, "media items, in feed");
  }, [media]);

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
      {/* <MediaList media={media} context="feed" /> */}
      <MediaList
        key={hasCrashed + "feed"}
        kid={`feed-${hasCrashed}`}
        media={media}
        context="feed"
        contextConfig={{
          currentIndex,
          setCurrentIndex: (index) => dispatch(setCurrentFeedIndex(index)),
        }}
      />
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
