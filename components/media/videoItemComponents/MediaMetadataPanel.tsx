// components/media/MediaMetadataPanel.tsx
import { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { VisitUserProfile } from "@/redux/apis/types/visitUserProfile";
import { useRouter } from "expo-router";

type Props = {
  media: MediaItem;
  userProfile?: VisitUserProfile;
};

function MediaMetadataPanel({ media, userProfile }: Props) {
  const router = useRouter();
  const handleWordPress = (word: string) => {
    const normalized = word.trim().toLowerCase();
    if (!normalized) return;
    router.navigate({
      pathname: "/diction/[term]",
      params: { term: normalized },
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.username}>
        @{userProfile?.profileName || "unknown"}
      </Text>
      <Text style={styles.description}>{media.description}</Text>

      {!!media.words?.length && (
        <View style={styles.wordsContainer}>
          {media.words.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={styles.wordChip}
              onPress={() => handleWordPress(word)}
              activeOpacity={0.7}
            >
              <Text style={styles.wordText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!!media.tags?.length && (
        <Text style={[styles.tagLine, { color: "#ffffffff", marginTop: 8 }]}>
          {media.tags.map((tag) => `#${tag}`).join(" ")}
        </Text>
      )}
    </View>
  );
}

export default memo(MediaMetadataPanel);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 80,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    // marginBottom: 4,
  },
  description: {
    color: "#fff",
    fontSize: 16,
  },
  tagLine: {
    color: "#ccc",
    fontSize: 16,
    // marginTop: 4,
  },

  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    gap: 6,
  },
  wordChip: {
    backgroundColor: "#ff9d00ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  wordText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
