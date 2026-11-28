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
import { memo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type { MediaItem } from "@/redux/features/mediaUpload/types";
import { useLikeMediaMutation } from "@/redux/apis/likeMediaApi";
import { useUnlikeMediaMutation } from "@/redux/apis/unlikeMediaApi";
import { useDeleteMediaMutation } from "@/redux/apis/deleteMediaApi";
import { useRouter } from "expo-router";
import { selectLikedIdsSet } from "@/redux/features/mediaLiked/mediaLikedSelectors";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  media: MediaItem;
  profileImageUrl?: string;
  currentSpeed?: number;
  onChangePlaybackSpeed: (speed: number) => void;
};

const speeds = [0.75, 1.0, 1.25];

function MediaInteractionColumn({
  media,
  profileImageUrl,
  currentSpeed = 1,
  onChangePlaybackSpeed,
}: Props) {
  const [likeMedia, { isLoading: isLiking }] = useLikeMediaMutation();
  const [unlikeMedia, { isLoading: isUnliking }] = useUnlikeMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();
  const authToken = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const likedIdSet = useSelector(selectLikedIdsSet);
  const isLikedByUser = likedIdSet.has(media.id);
  const currentUserId = useSelector((s: RootState) => s.user.profile?.publicId);
  const isOwner = currentUserId === media.authUserId;
  const isUpdatingLike = isLiking || isUnliking;

  const handlePressAvatar = () => {
    console.log("Navigate to user profile:", media.authUserId);
  };

  const handlePressLike = async () => {
    if (!authToken) {
      router.push("/(auth)/login");
      return;
    }

    if (isUpdatingLike) {
      return;
    }

    try {
      if (isLikedByUser) {
        await unlikeMedia({ mediaId: media.id }).unwrap();
      } else {
        await likeMedia({ media }).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
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
      await deleteMedia({ mediaId: media.id }).unwrap();
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconGroup}>
        <TouchableOpacity onPress={handlePressAvatar}>
          <View style={styles.profileBorder}>
            <Image
              source={
                profileImageUrl == null
                  ? require("@/assets/favicon.png")
                  : { uri: profileImageUrl }
              }
              style={styles.profileImage}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.iconGroup}>
        <Ionicons
          name={"heart"}
          size={40}
          color={isLikedByUser ? "#ff0550ff" : "#ffffffff"}
          onPress={isUpdatingLike ? undefined : handlePressLike}
          style={{ opacity: isUpdatingLike ? 0.6 : 1 }}
        />
        <Text style={styles.iconLabel}>{media.likeCount}</Text>
      </View>

      <View style={styles.iconGroup}>
        <Popover
          from={
            <TouchableOpacity style={{ padding: 14 }}>
              <Entypo
                name="dots-three-horizontal"
                size={24}
                color="white"
                style={styles.iconShadow}
              />
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
              <MaterialIcons
                name="slow-motion-video"
                size={20}
                color={"white"}
                style={{ marginRight: 10 }}
              />
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
                <MaterialIcons
                  name="delete"
                  size={20}
                  color="rgba(255, 255, 255, 1)"
                />
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
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  iconShadow: {
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
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
