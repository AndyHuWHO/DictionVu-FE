// components/media/MediaInteractionColumn.tsx
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, memo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useLikeMediaMutation } from "@/redux/apis/likeMediaApi";
import { useUnlikeMediaMutation } from "@/redux/apis/unlikeMediaApi";
import { useDeleteMediaMutation } from "@/redux/apis/deleteMediaApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import {
  likeMediaInFeed,
  unlikeMediaInFeed,
  deleteMediaInFeed,
} from "@/redux/features/mediaFeed/mediaFeedSlice";
import {
  likeMediaInWord,
  unlikeMediaInWord,
  deleteMediaInWord,
} from "@/redux/features/mediaWord/mediaWordSlice";
import { deleteMediaItemFromLiked } from "@/redux/features/mediaLiked/mediaLikedSlice";
import { selectLikedIdsSet } from "@/redux/features/mediaLiked/mediaLikedSelectors";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  profileImage: string;
  likeCount: number;
  commentCount: number;
  mediaId: string;
  authUserId: string;
  currentSpeed?: number;
  onChangePlaybackSpeed: (speed: number) => void;
  onLikeMedia: () => void;
  onUnlikeMedia: () => void;
};

const speeds = [0.75, 1.00, 1.25];

function MediaInteractionColumn({
  profileImage,
  likeCount,
  commentCount,
  mediaId,
  authUserId,
  currentSpeed = 1,
  onChangePlaybackSpeed,
  onLikeMedia,
  onUnlikeMedia,
}: Props) {
  const [liked, setLiked] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [likeMedia, { isLoading: isLiking, isSuccess: isLiked, error: likeError }] = useLikeMediaMutation();
  const [unlikeMedia, { isLoading: isUnliking, isSuccess: isUnliked, error: unlikeError }] = useUnlikeMediaMutation();
  const [deleteMedia, { isLoading: isDeleting, isSuccess: isDeleted, error: deleteError }] = useDeleteMediaMutation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const likedIdSet = useSelector(selectLikedIdsSet);
  const isLikedByUser = likedIdSet.has(mediaId);
  const currentUserId = useSelector((s: RootState) => s.user.profile?.publicId);
  const isOwner = currentUserId === authUserId;

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
        onLikeMedia();
      } else {
        await unlikeMedia({ mediaId }).unwrap();
        dispatch(unlikeMediaInFeed(mediaId));
        dispatch(unlikeMediaInWord(mediaId));
        onUnlikeMedia();
      }

      // // Refresh liked media list to reflect server truth
      // dispatch(fetchMediaLikedThunk({ token: isAuthenticated }));
    } catch (error) {
      console.error("Failed to toggle like:", error);

      // Revert optimistic update
      setLiked(!newLiked);
    }
  };

  const handlePressComment = () => {
    console.log("Open comments for media:", mediaId);
  };

  const confirmDelete = () => {
    Alert.alert("Delete video?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          handleDeleteMedia();
        },
      },
    ]);
  };

  const handleDeleteMedia = async () => {
    try {
      await deleteMedia({ mediaId }).unwrap();
      dispatch(deleteMediaInFeed(mediaId));
      dispatch(deleteMediaInWord(mediaId));
      dispatch(deleteMediaItemFromLiked(mediaId));
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
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
          name={"heart"}
          size={40}
          color={liked ? "#ff0550ff" : "#ffffffff"}
          onPress={handlePressLike}
        />
        <Text style={styles.iconLabel}>{likeCount}</Text>
      </View>

      {/* <View style={styles.iconGroup}>
        <Ionicons
          name="chatbubble-outline"
          size={40}
          color="#fff"
          onPress={handlePressComment}
        />
        <Text style={styles.iconLabel}>{commentCount}</Text>
      </View> */}

      <View style={styles.iconGroup}>
        <Popover
          from={
            <TouchableOpacity style={{ padding: 14 }}>
              <Entypo name="dots-three-horizontal" size={24} color="white" />
            </TouchableOpacity>
          }
          placement={PopoverPlacement.BOTTOM}
          arrowShift={8} // nudge arrow away from screen edge
          backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          popoverStyle={{
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 10,
            // borderWidth: 2,
            // borderColor: "red",
            backgroundColor: "#313131ff",
          }}
        >
          <View style={styles.menu}>
            <View style={styles.menuRow}>
              <MaterialIcons name="slow-motion-video" size={20} color={"white"} style={{ marginRight: 10 }} />
              <View style={styles.speedGroup}>
                {speeds.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => {
                      onChangePlaybackSpeed(s);
                      console.log("Set speed to:", s);
                    }}
                    style={[
                      styles.speedChip,
                      currentSpeed === s && styles.speedChipActive,
                    ]}
                  >
                    <Text style={styles.speedText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Delete (owner only) */}
            {isOwner && (
              <TouchableOpacity
                style={[styles.menuRow, styles.deleteRow]}
                onPress={confirmDelete}
              >
                <MaterialIcons name="delete" size={20} color="rgba(255, 255, 255, 1)" />
                <Text style={styles.deleteText}>Delete Video</Text>
              </TouchableOpacity>
            )}
          </View>
        </Popover>
      </View>
    </View>
  );
}

export default memo(MediaInteractionColumn);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    bottom: 160,
    alignItems: "center",
    gap: 24,
  },
  iconGroup: {
    alignItems: "center",
    gap: 4,
  },
  iconLabel: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "500",
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
  menu: { minWidth: 220, gap: 8, backgroundColor: "#313131ff" },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  speedGroup: { flexDirection: "row", gap: 8 },
  speedChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#b6b4b4ff",
  },
  speedChipActive: { backgroundColor: "#f3f3f3ff" },
  speedText: { fontSize: 16 },
  deleteRow: {
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  deleteText: { color: "rgba(255, 255, 255, 1)", fontSize: 16 },
});
