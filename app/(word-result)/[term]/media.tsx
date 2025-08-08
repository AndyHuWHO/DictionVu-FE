// app/(word-result)/[term]/Media.tsx
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { fetchMediaThunk } from "@/redux/features/mediaWord/mediaWordThunks";
import { RootState, AppDispatch } from "@/redux/store";
import MediaList from "@/components/media/MediaList";

export default function MediaScreen() {
  const { term } = useLocalSearchParams();
  const searchTerm = Array.isArray(term) ? term[0] : term ?? "";

  const dispatch = useDispatch<AppDispatch>();
  const media = useSelector((state: RootState) => state.mediaWord.items);
  const status = useSelector((state: RootState) => state.mediaWord.status);
  const error = useSelector((state: RootState) => state.mediaWord.error);

  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchMediaThunk({ word: searchTerm }));
    }
  }, [searchTerm]);

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
        <ThemedText>No media found for "{searchTerm}"</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1}}>
      <MediaList media={media} />
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
