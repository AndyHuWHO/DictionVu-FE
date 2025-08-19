// app/(tabs)/vu/liked.tsx
import { useEffect } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { fetchMediaLikedThunk } from "@/redux/features/mediaLiked/mediaLikedThunks";
import { setCurrentLikedIndex } from "@/redux/features/mediaLiked/mediaLikedSlice";
import MediaList from "@/components/media/MediaList";
import { useRouter } from "expo-router";

export default function LikedTopTabScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const media = useSelector((state: RootState) => state.mediaLiked.items);
  const currentIndex = useSelector(
    (state: RootState) => state.mediaLiked.currentLikedIndex
  );
  const status = useSelector(
    (state: RootState) => state.mediaLiked.fetchStatus
  );
  const error = useSelector((state: RootState) => state.mediaLiked.fetchError);
  const isAuthenticated = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (currentIndex === media.length - 1 || media.length === 0) {
      console.log("Fetching media liked...");
      dispatch(fetchMediaLikedThunk({ token:isAuthenticated }));
    }
  }, [dispatch, currentIndex, isAuthenticated]);

  // 👇 Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.infoText}>
          Please log in to see your liked media.
        </ThemedText>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </ThemedView>
    );
  }

  // 👇 Normal loading/failure/render states when logged in
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
        <ThemedText>No liked media were found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <MediaList
        media={media}
        context="liked"
        contextConfig={{
          currentIndex,
          setCurrentIndex: (index) => dispatch(setCurrentLikedIndex(index)),
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
  infoText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  outlineButton: {
    backgroundColor: "#f0f0f0",
  },
  outlineButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
