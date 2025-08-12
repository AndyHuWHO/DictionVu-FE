// components/media/VideoItem.tsx
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Image,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { Ionicons } from "@expo/vector-icons";
import { useGetUserProfileQuery } from "@/redux/apis/visitProfileApi";
import MediaInteractionColumn from "./MediaInteractionColumn";

type Props = {
  media: MediaItem;
  isVisible: boolean;
  isTabFocused: boolean;
  height: number;
};

export default function VideoItem({
  media,
  isVisible,
  isTabFocused,
  height,
}: Props) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isPaused, setIsPaused] = useState(!isVisible || !isTabFocused);
  const [fadeAnim] = useState(new Animated.Value(1));

  const [contentFit, setContentFit] = useState<"contain" | "cover" | null>(null);


  const player = useVideoPlayer(media.objectPresignedGetUrl, (player) => {
    player.loop = true;
    if (isVisible && isTabFocused && !isPaused) {
      player.replay();
      player.play();
    } else {
      player.pause();
    }
  });

  const { data: userProfile } = useGetUserProfileQuery(media.authUserId);

  useEffect(() => {
    const shouldPlay = isVisible && isTabFocused;
    if (shouldPlay && isPaused) {
      setIsPaused(false);
      player.replay();
      player.play();
      setShowOverlay(false);
    } else if (!shouldPlay) {
      player.pause();
      setIsPaused(true);
    }
  }, [isVisible, isTabFocused]);

    useEffect(() => {
    const interval = setInterval(() => {
      const size = player?.videoTrack?.size;
      // console.log("waiting for video track ready"); 
      if (size?.width && size?.height) {
        // console.log(player?.videoTrack);
        const ratio = size.height / size.width;
        setContentFit(ratio > 1.6 ? "cover" : "contain");
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [player]);

  const handleTogglePlay = () => {
    if (isPaused) {
      setIsPaused(false);
      player.play();
      setShowOverlay(true);

      fadeAnim.setValue(1);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setShowOverlay(false));
    } else {
      setIsPaused(true);
      player.pause();
      setShowOverlay(true);
      fadeAnim.setValue(1);
    }
  };

  const profileImage =
    userProfile?.profileImageUrl ??
    Image.resolveAssetSource(require("@/assets/favicon.png")).uri;

  return (
    <TouchableWithoutFeedback onPress={handleTogglePlay}>
      <View style={[styles.videoContainer, { height, }]}>

      
        <VideoView
          style={styles.video}
          player={player}
          // contentFit={contentFit}
          contentFit="contain"
          allowsFullscreen
          allowsPictureInPicture
          nativeControls={false}
        />

        {/* {contentFit? */}
        {/*  :null} */}
        

        {showOverlay && (
          <Animated.View
            style={[styles.playIconWrapper, { opacity: fadeAnim }]}
          >
            <Ionicons name="play" size={72} color="rgba(255,255,255,0.85)" />
          </Animated.View>
        )}

        <MediaInteractionColumn
          profileImage={profileImage}
          likeCount={media.likeCount}
          commentCount={media.commentCount}
          mediaId={media.id}
          authUserId={media.authUserId}
        />

        <View style={styles.bottomContent}>
          <Text style={styles.username}>
            @{userProfile?.profileName || "unknown"}
          </Text>
          <Text style={styles.description}>{media.description}</Text>
          {media.words?.length ? (
            <Text style={styles.tagLine}>
              {media.words.map((word) => `$${word}`).join(" ")}
            </Text>
          ) : null}

          {media.tags?.length ? (
            <Text style={styles.tagLine}>
              {media.tags.map((tag) => `#${tag}`).join(" ")}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playIconWrapper: {
    position: "absolute",
    top: "40%",
    left: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContent: {
    position: "absolute",
    bottom: 70,
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
