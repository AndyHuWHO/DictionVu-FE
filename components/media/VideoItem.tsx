// components/media/VideoItem.tsx
import { useEffect, useState, memo } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  AppState,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import type { MediaItem } from "@/redux/features/mediaUpload/types";
import { useGetUserProfileQuery } from "@/redux/apis/visitProfileApi";
import MediaInteractionColumn from "./videoItemComponents/MediaInteractionColumn";
import { fitFromWH } from "@/utils/videoFit";
import MediaMetadataPanel from "./videoItemComponents/MediaMetadataPanel";
import PlayOverlay from "./videoItemComponents/PlayOverlay";

type Props = {
  media: MediaItem;
  isVisible: boolean;
  isTabFocused: boolean;
  height: number;
};

function VideoItem({ media, isVisible, isTabFocused, height }: Props) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isPaused, setIsPaused] = useState(!isVisible || !isTabFocused);
  const [contentFit, setContentFit] = useState<"contain" | "cover">("contain");
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const { data: userProfile } = useGetUserProfileQuery(media.authUserId);

  const player = useVideoPlayer(media.objectPresignedGetUrl, (player) => {
    player.loop = true;
    if (isVisible && isTabFocused && !isPaused) {
      player.replay();
      // player.play();
    } else {
      player.pause();
    }
  });

  useEffect(() => {
    if (!player) return;
    player.playbackRate = playbackSpeed;
  }, [player, playbackSpeed]);

  // Auto play/pause based on visibility and tab focus
  useEffect(() => {
    const shouldPlay = isVisible && isTabFocused;
    if (shouldPlay && isPaused) {
      setIsPaused(false);
      player.replay();
      // player.play();
      setPlaybackSpeed(1.0);
      setShowOverlay(false);
    } else if (!shouldPlay) {
      player.pause();
      setIsPaused(true);
    }
  }, [isVisible, isTabFocused]);

  useEffect(() => {
    if (!isVisible) return;
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && isTabFocused) {
        player.play();
        setIsPaused((p) => (p ? false : p));
        setShowOverlay(false);
      }
    });
    return () => sub.remove();
  }, [isVisible, isTabFocused, player]);

  // Determine contentFit based on video dimensions
  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    Image.getSize(
      media.thumbnailPresignedGetUrl,
      (w, h) => {
        if (cancelled) return;
        setContentFit(fitFromWH(w, h));
      },
      () => {
        // Fallback: poll player.generateThumbnailsAsync
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
      player.play();
      setIsPaused(false);
      setShowOverlay(false);
    } else {
      player.pause();
      setIsPaused(true);
      setShowOverlay(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleTogglePlay}>
      <View style={[styles.videoContainer, { height }]}>
        {contentFit && (
          <VideoView
            style={styles.video}
            player={player}
            contentFit={contentFit}
            allowsPictureInPicture
            nativeControls={false}
          />
        )}

        <PlayOverlay visible={showOverlay} />
        <MediaInteractionColumn
          media={media}
          profileImageUrl={userProfile?.profileImageUrl}
          currentSpeed={playbackSpeed}
          onChangePlaybackSpeed={setPlaybackSpeed}
        />
        <MediaMetadataPanel media={media} userProfile={userProfile} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default memo(VideoItem);

const styles = StyleSheet.create({
  videoContainer: {
    position: "relative",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
