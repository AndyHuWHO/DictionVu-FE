// components/media/MediaInteractionColumn.tsx
import { View, StyleSheet, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  profileImage: string;
  likeCount: number;
  commentCount: number;
  mediaId: string;
  authUserId: string;
};

export default function MediaInteractionColumn({
  profileImage,
  likeCount,
  commentCount,
  mediaId,
  authUserId,
}: Props) {
  const handlePressAvatar = () => {
    console.log("Navigate to user profile:", authUserId);
  };

  const handlePressLike = () => {
    console.log("Toggle like for media:", mediaId);
  };

  const handlePressComment = () => {
    console.log("Open comments for media:", mediaId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconGroup}>
        <View style={styles.profileBorder}>
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
        </View>
      </View>

      <View style={styles.iconGroup}>
        <Ionicons
          name="heart-outline"
          size={40}
          color="#fff"
          onPress={handlePressLike}
        />
        <Text style={styles.iconLabel}>{likeCount}</Text>
      </View>

      <View style={styles.iconGroup}>
        <Ionicons
          name="chatbubble-outline"
          size={40}
          color="#fff"
          onPress={handlePressComment}
        />
        <Text style={styles.iconLabel}>{commentCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    bottom: 220,
    alignItems: "center",
    gap: 24,
  },
  iconGroup: {
    alignItems: "center",
    gap: 4,
  },
  iconLabel: {
    color: "#fff",
    fontSize: 12,
  },
  profileBorder: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 999,
    padding: 2,
    backgroundColor: "#000",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
  },
});
