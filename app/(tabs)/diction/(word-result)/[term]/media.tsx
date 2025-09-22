// app/(tabs)/diction/(word-result)/[term]/media.tsx
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { fetchMediaWordThunk } from "@/redux/features/mediaWord/mediaWordThunks";
import { RootState, AppDispatch } from "@/redux/store";
import MediaList from "@/components/media/MediaList";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function MediaScreen() {
  const { term } = useLocalSearchParams();
  const searchTerm = Array.isArray(term) ? term[0] : term ?? "";

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const media = useSelector((state: RootState) => state.mediaWord.wordItems[searchTerm]?.media || []);
  const status = useSelector((state: RootState) => state.mediaWord.status);
  const error = useSelector((state: RootState) => state.mediaWord.error);
  const isAuthenticated = useSelector((state: RootState) => state.auth.token);


  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchMediaWordThunk({ word: searchTerm }));
    }
  }, [searchTerm]);

  const handlePostMedia = () => {
    if (isAuthenticated) {
      router.push(`/(modals)/upload/capture`);
    } else {
      router.push("/(auth)/login");
    }
  };

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
        <ThemedText style={styles.infoText}>
          Be the first to add media for "{searchTerm}"!
        </ThemedText>
        <Pressable
          style={styles.button}
          onPress={handlePostMedia}
        >
          <Text style={styles.buttonText}>Post Media</Text>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <MediaList 
      key={"word"} 
      media={media} context="word" />
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
  infoText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
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
});
