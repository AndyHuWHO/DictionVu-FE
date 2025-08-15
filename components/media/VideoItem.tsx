// components/media/VideoItem.tsx
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Image,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { useGetUserProfileQuery } from "@/redux/apis/visitProfileApi";
import MediaInteractionColumn from "./MediaInteractionColumn";
import { fitFromWH } from "@/utils/videoFit";
import MediaMetadataPanel from "./MediaMetadataPanel";
import PlayOverlay from "./PlayOverlay";

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

  const [contentFit, setContentFit] = useState<"contain" | "cover">("contain");

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
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    // 1) Try server thumbnail first (cheap + instant). We only need its dimensions.
    Image.getSize(
      media.thumbnailPresignedGetUrl,
      (w, h) => {
        if (cancelled) return;
        setContentFit(fitFromWH(w, h));
      },
      () => {
        // 2) Fallback: your existing approach (poll player.generateThumbnailsAsync)
        interval = setInterval(async () => {
          if (cancelled) return;
          try {
            console.log(
              "polling for video thumb dimensions! Slow! Server thumb not available!"
            );
            const thumbs = await player.generateThumbnailsAsync([0]);
            const thumb = Array.isArray(thumbs) ? thumbs[0] : undefined;
            if (thumb?.width && thumb?.height) {
              setContentFit(fitFromWH(thumb.width, thumb.height));
              if (interval) {
                clearInterval(interval);
                interval = null;
              }
            }
          } catch {
            // keep polling until we get dimensions or unmount
          }
        }, 200);
      }
    );

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [media.thumbnailPresignedGetUrl, media.objectPresignedGetUrl, player]);

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
      <View style={[styles.videoContainer, { height }]}>
        {contentFit && (
          <VideoView
            style={styles.video}
            player={player}
            contentFit={contentFit}
            // contentFit="contain"
            allowsFullscreen
            allowsPictureInPicture
            nativeControls={false}
          />
        )}

        <PlayOverlay visible={showOverlay} fadeAnim={fadeAnim} />

        <MediaInteractionColumn
          profileImage={profileImage}
          likeCount={media.likeCount}
          commentCount={media.commentCount}
          mediaId={media.id}
          authUserId={media.authUserId}
        />
        <MediaMetadataPanel media={media} userProfile={userProfile} />
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
});
