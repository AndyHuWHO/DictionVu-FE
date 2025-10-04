// components/media/VideoItem.tsx
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Image,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { AppState } from "react-native";
import { MediaItem } from "@/redux/features/mediaUpload/types";
import { useGetUserProfileQuery } from "@/redux/apis/visitProfileApi";
import MediaInteractionColumn from "./videoItemComponents/MediaInteractionColumn";
import { fitFromWH } from "@/utils/videoFit";
import MediaMetadataPanel from "./videoItemComponents/MediaMetadataPanel";
import PlayOverlay from "./videoItemComponents/PlayOverlay";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  addMediaItemToLiked,
  deleteMediaItemFromLiked,
} from "@/redux/features/mediaLiked/mediaLikedSlice";

type Props = {
  media: MediaItem;
  isVisible: boolean;
  isTabFocused: boolean;
  height: number;
};

function VideoItem({ media, isVisible, isTabFocused, height }: Props) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [isPaused, setIsPaused] = useState(!isVisible || !isTabFocused);
  const [contentFit, setContentFit] = useState<"contain" | "cover">("contain");

  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const dispatch = useDispatch<AppDispatch>();
  const { data: userProfile } = useGetUserProfileQuery(media.authUserId);

  const player = useVideoPlayer(media.objectPresignedGetUrl, (player) => {
    player.loop = true;
    if (isVisible && isTabFocused && !isPaused) {
      player.replay();
      player.play();
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
      player.play();
      setPlaybackSpeed(1.0);
      setShowOverlay(false);
    } else if (!shouldPlay) {
      player.pause();
      setIsPaused(true);
    }
  }, [isVisible, isTabFocused]);

  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   const sub = AppState.addEventListener("change", (state) => {
  //     if (state === "active") {
  //       // if (timeoutRef.current) {
  //       //   clearTimeout(timeoutRef.current);
  //       // }

  //       // timeoutRef.current = setTimeout(() => {
  //       //   if (player.status === "error") {
  //       //     console.log("video player in error state");
  //       //     dispatch(reportCrash());
  //       //     return;
  //       //   }

  //       //   if (isVisible && isTabFocused && !isPaused) {
  //       //     player.play();
  //       //   }
  //       // }, 500);
  //       if (isVisible && isTabFocused) {
  //         player.play();
  //         setIsPaused(false);
  //         setShowOverlay(false);
  //       }
  //     } else if (state.match(/inactive|background/)) {
  //       // if (isVisible && isTabFocused) {
  //       //   player.pause();
  //       //   setIsPaused(true);
  //       //   setShowOverlay(true);
  //       //   fadeAnim.setValue(1);
  //       // }
  //     }
  //   });
  //   return () => {
  //     sub.remove();
  //     // if (timeoutRef.current) {
  //     //   clearTimeout(timeoutRef.current);
  //     // }
  //   };
  // }, [player, isVisible, isTabFocused, fadeAnim]);

  // VideoItem.tsx
  useEffect(() => {
    if (!isVisible) return; // only when actually visible
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
      setIsPaused(false);
      player.play();

      // setShowOverlay(true);
      // fadeAnim.setValue(1);

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        requestAnimationFrame(() => setShowOverlay(false));
      });
    } else {
      setIsPaused(true);
      player.pause();
      setShowOverlay(true);
      fadeAnim.setValue(1);
    }
  };

  // const handleLikeInMediaLikeStates = () => {
  //   console.log("Like media:", media.id);
  //   dispatch(addMediaItemToLiked(media));
  // };

  // const handleUnlikeInMediaLikeStates = () => {
  //   console.log("Unlike media:", media.id);
  //   dispatch(deleteMediaItemFromLiked(media));
  // };

  const handleChangePlaybackSpeed = useCallback((s: number) => {
    setPlaybackSpeed(s);
  }, []);

  const handleLikeInMediaLikeStates = useCallback(() => {
    dispatch(addMediaItemToLiked(media));
  }, [media, dispatch]);

  const handleUnlikeInMediaLikeStates = useCallback(() => {
    dispatch(deleteMediaItemFromLiked(media));
  }, [media, dispatch]);

  // const profileImage =
  //   userProfile?.profileImageUrl ??
  //   Image.resolveAssetSource(require("@/assets/favicon.png")).uri;
  const profileImage = useMemo(
    () =>
      userProfile?.profileImageUrl ??
      Image.resolveAssetSource(require("@/assets/favicon.png")).uri,
    [userProfile?.profileImageUrl]
  );

  const containerStyle = useMemo(() => [styles.videoContainer, { height }], [height]);

  return (
    <TouchableWithoutFeedback
      onPress={handleTogglePlay}
      // onPressIn={() => setShowProgressBar(true)}
    >
      <View style={containerStyle}>
        {contentFit && (
          <VideoView
            style={styles.video}
            player={player}
            contentFit={contentFit}
            // contentFit="contain"
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
          currentSpeed={playbackSpeed}
          // onChangePlaybackSpeed={(s) => {
          //   setPlaybackSpeed(s);
          // }}
          onChangePlaybackSpeed={handleChangePlaybackSpeed}
          onLikeMedia={handleLikeInMediaLikeStates}
          onUnlikeMedia={handleUnlikeInMediaLikeStates}
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
