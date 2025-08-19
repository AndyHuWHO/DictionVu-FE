// components/media/VideoItem.tsx
import { useEffect, useState, useMemo } from "react";
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
import MediaInteractionColumn from "./videoItemComponents/MediaInteractionColumn";
import { fitFromWH } from "@/utils/videoFit";
import MediaMetadataPanel from "./videoItemComponents/MediaMetadataPanel";
import PlayOverlay from "./videoItemComponents/PlayOverlay";
import VideoProgressBar from "./videoItemComponents/VideoProgressBar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useLikeMediaMutation } from "@/redux/apis/likeMediaApi";
import { useUnlikeMediaMutation } from "@/redux/apis/unlikeMediaApi";
import { selectLikedIdSet } from "@/redux/features/mediaLiked/mediaLikedSelectors";

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
  const [fadeAnim] = useState(new Animated.Value(1));
  const [isPaused, setIsPaused] = useState(!isVisible || !isTabFocused);
  const [contentFit, setContentFit] = useState<"contain" | "cover">("contain");

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isSliding, setIsSliding] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);

  // const likedIdSet = useSelector(selectLikedIdSet);
  // const isLiked = likedIdSet.has(media.id);

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

  // Auto play/pause based on visibility and tab focus
  useEffect(() => {
    const shouldPlay = isVisible && isTabFocused;
    if (shouldPlay && isPaused) {
      setIsPaused(false);
      console.log("replaying video on land");
      player.replay();
      player.play();
      setShowOverlay(false);
    } else if (!shouldPlay) {
      player.pause();
      setIsPaused(true);
    }
  }, [isVisible, isTabFocused]);

  // Update progress and duration when player is ready
  useEffect(() => {
    if (!player) return;
    const checkDuration = setInterval(() => {
      if (player.duration > 0) {
        setDuration(player.duration);
        clearInterval(checkDuration);
      }
    }, 100);

    return () => clearInterval(checkDuration);
  }, [player]);

  // Update progress every 10ms
  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      if (!isSliding) {
        setProgress(player.currentTime);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [player, isSliding]);

  // Show progress bar when paused or sliding
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (isPaused || isSliding) {
      setShowProgressBar(true);
    } else {
      // // show for 2s, then hide
      // setShowProgressBar(true);
      // timeout = setTimeout(() => {
      //   setShowProgressBar(false);
      // }, 2000);

      setShowProgressBar(false);
    }

    // return () => {
    //   if (timeout) clearTimeout(timeout);
    // };
  }, [isPaused, isSliding]);

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
      setIsPaused(false);
      player.play();

      // setShowOverlay(true);
      // fadeAnim.setValue(1);

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
    <TouchableWithoutFeedback
      onPress={handleTogglePlay}
      onPressIn={() => setShowProgressBar(true)}
    >
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
          // isLiked={isLiked}
        />
        <MediaMetadataPanel media={media} userProfile={userProfile} />
        <VideoProgressBar
          progress={progress}
          duration={duration}
          isSliding={isSliding}
          visible={showProgressBar}
          onSeek={(value) => setProgress(value)}
          onSlidingStart={() => setIsSliding(true)}
          onSlidingComplete={(value) => {
            // console.log("Seeking to:", value);
            player.currentTime = parseFloat(value.toFixed(2));
            setIsSliding(false);

            // setTimeout(() => {
            //   const confirmedTime = player.currentTime;
            //   console.log("Confirmed seek time:", confirmedTime);
            //   setProgress(confirmedTime);
            // }, 20);
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

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
