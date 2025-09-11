// components/media/VideoItem.tsx
import { useEffect, useState, useMemo, useRef } from "react";
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

  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const dispatch = useDispatch<AppDispatch>();

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

  useEffect(() => {
    if (!player) return;
    player.playbackRate = playbackSpeed;
  }, [player, playbackSpeed]);

  // Auto play/pause based on visibility and tab focus
  useEffect(() => {
    const shouldPlay = isVisible && isTabFocused;
    if (shouldPlay && isPaused) {
      setIsPaused(false);
      console.log("replaying video on land");
      player.replay();
      player.play();
      setPlaybackSpeed(1.0);
      setShowOverlay(false);
    } else if (!shouldPlay) {
      player.pause();
      setIsPaused(true);
    }
  }, [isVisible, isTabFocused]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setTimeout(() => {
          if (player.status == "error") {
            console.log("video player in error state");
            return;
          }
          if (isVisible && isTabFocused && !isPaused) {
            console.log("video not paused, playing on active");
            player.play();
          }
        }, 500);
      } else if (state.match(/inactive|background/)) {
        if (isVisible && isTabFocused) {
          player.pause();
          setIsPaused(true);
          setShowOverlay(true);
          fadeAnim.setValue(1);
        }
      }
    });
    return () => sub.remove();
  }, [player, isVisible, isTabFocused, fadeAnim]);

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

  const handleLikeInMediaLikeStates = () => {
    console.log("Like media:", media.id);
    dispatch(addMediaItemToLiked(media));
  };

  const handleUnlikeInMediaLikeStates = () => {
    console.log("Unlike media:", media.id);
    dispatch(deleteMediaItemFromLiked(media));
  };

  const profileImage =
    userProfile?.profileImageUrl ??
    Image.resolveAssetSource(require("@/assets/favicon.png")).uri;

  return (
    <TouchableWithoutFeedback
      onPress={handleTogglePlay}
      // onPressIn={() => setShowProgressBar(true)}
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
          currentSpeed={playbackSpeed}
          onChangePlaybackSpeed={(s) => {
            setPlaybackSpeed(s);
          }}
          onLikeMedia={handleLikeInMediaLikeStates}
          onUnlikeMedia={handleUnlikeInMediaLikeStates}
        />
        <MediaMetadataPanel media={media} userProfile={userProfile} />
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
