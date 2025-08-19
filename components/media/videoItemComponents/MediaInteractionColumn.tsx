// components/media/MediaInteractionColumn.tsx
import { View, StyleSheet, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchMediaLikedThunk } from "@/redux/features/mediaLiked/mediaLikedThunks";
import { useLikeMediaMutation } from "@/redux/apis/likeMediaApi";
import { useUnlikeMediaMutation } from "@/redux/apis/unlikeMediaApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import {
  likeMediaInFeed,
  unlikeMediaInFeed,
} from "@/redux/features/mediaFeed/mediaFeedSlice";
import {
  likeMediaInWord,
  unlikeMediaInWord,
} from "@/redux/features/mediaWord/mediaWordSlice";
import { selectLikedIdSet } from "@/redux/features/mediaLiked/mediaLikedSelectors";

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
  const [liked, setLiked] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [likeMedia] = useLikeMediaMutation();
  const [unlikeMedia] = useUnlikeMediaMutation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const likedIdSet = useSelector(selectLikedIdSet);
  const isLikedByUser = likedIdSet.has(mediaId);

  // const displayLikeCount = likeCount + (liked && !isLiked ? 1 : 0) + (!liked && isLiked ? -1 : 0);

  useEffect(() => {
    setLiked(isLikedByUser);
  }, [isLikedByUser]);

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
        dispatch(likeMediaInFeed(mediaId));
        dispatch(likeMediaInWord(mediaId));
      } else {
        await unlikeMedia({ mediaId }).unwrap();
        dispatch(unlikeMediaInFeed(mediaId));
        dispatch(unlikeMediaInWord(mediaId));
      }

      // Refresh liked media list to reflect server truth
      dispatch(fetchMediaLikedThunk({ token: isAuthenticated }));
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
