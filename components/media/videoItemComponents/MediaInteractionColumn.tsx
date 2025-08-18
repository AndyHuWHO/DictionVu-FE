// components/media/MediaInteractionColumn.tsx
import { View, StyleSheet, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchMediaLikedThunk } from "@/redux/features/mediaLiked/mediaLikedThunks";
import { useLikeMediaMutation } from "@/redux/apis/likeMediaApi";
import { useUnlikeMediaMutation } from "@/redux/apis/unlikeMediaApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";


type Props = {
  profileImage: string;
  likeCount: number;
  commentCount: number;
  mediaId: string;
  authUserId: string;
  isLiked: boolean;
};

export default function MediaInteractionColumn({
  profileImage,
  likeCount,
  commentCount,
  mediaId,
  authUserId,
  isLiked,
}: Props) {
  const [liked, setLiked] = useState(isLiked);
  const dispatch = useDispatch<AppDispatch>();
  const [likeMedia] = useLikeMediaMutation();
  const [unlikeMedia] = useUnlikeMediaMutation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  

  const handlePressAvatar = () => {
    console.log("Navigate to user profile:", authUserId);
  };

  const handlePressLike = async () => {
    if (!isAuthenticated) {
      router.push("/(auth)/login");
      return;
    }
    const newLiked = !liked;

    setLiked(newLiked);

    try {
      if (newLiked) {
        await likeMedia({ mediaId }).unwrap();
      } else {
        await unlikeMedia({ mediaId }).unwrap();
      }

      // Refresh liked media list to reflect server truth
      dispatch(fetchMediaLikedThunk({}));
    } catch (error) {
      console.error("Failed to toggle like:", error);

      // Revert optimistic update
      setLiked(!newLiked);
    }
  };

  const handlePressComment = () => {
    console.log("Open comments for media:", mediaId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconGroup}>
        <View style={styles.profileBorder}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </View>
      </View>

      <View style={styles.iconGroup}>
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={40}
          color="#ffffffff"
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
