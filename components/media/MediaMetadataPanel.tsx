// components/media/MediaMetadataPanel.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { VisitUserProfile } from "@/redux/apis/types/visitUserProfile";

type Props = {
  media: MediaItem;
  userProfile?: VisitUserProfile;
};

export default function MediaMetadataPanel({ media, userProfile }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.username}>
        @{userProfile?.profileName || "unknown"}
      </Text>
      <Text style={styles.description}>{media.description}</Text>

      {!!media.words?.length && (
        <Text style={styles.tagLine}>
          {media.words.map((word) => `$${word}`).join(" ")}
        </Text>
      )}

      {!!media.tags?.length && (
        <Text style={styles.tagLine}>
          {media.tags.map((tag) => `#${tag}`).join(" ")}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 80,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    color: "#fff",
    fontSize: 14,
  },
  tagLine: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 4,
  },
});
