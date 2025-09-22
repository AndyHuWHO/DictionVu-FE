// app/(modals)/upload/preview.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import * as VideoThumbnails from "expo-video-thumbnails";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { fitFromWH } from "@/utils/videoFit";
import { fmtMMSS } from "@/utils/fmtMMSS";

export default function PreviewScreen() {
  const { contentUri } = useLocalSearchParams<{ contentUri: string }>();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isSliding, setIsSliding] = useState(false);
  const [contentFit, setContentFit] = useState<"contain" | "cover" >("contain");

  const player = useVideoPlayer(contentUri, (player) => {
    player.loop = true;
    player.play();
  });

  const generateThumbnail = async () => {
    try {
      const { uri, width, height } = await VideoThumbnails.getThumbnailAsync(contentUri, {
        time: 1,
      });
      setImage(uri);
      setContentFit(fitFromWH(width, height));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleNext = () => {
    if (!contentUri) {
      Alert.alert("Missing media", "No media URI provided.");
      router.back();
      return;
    }
    player.pause();
    router.push({
      pathname: "/(modals)/upload/edit",
      params: { contentUri, thumbnailUri: image, contentFit },
    });
  };

  useEffect(() => {
    if (!contentUri) {
      Alert.alert("Missing media", "No media URI provided.");
      router.back();
      return;
    }
    const fetchThumbnail = async () => {
      await generateThumbnail();
    };
    fetchThumbnail();
  }, [contentUri]);

  // Progress tracking
  useEffect(() => {
    if (!player) return;
    const interval = setInterval(() => {
      if (!isSliding && player.duration > 0) {
        setProgress(player.currentTime);
        setDuration(player.duration);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [player, isSliding]);


useFocusEffect(
  useCallback(() => {
    let tick = setInterval(() => {
      if (player && player.duration > 0) {
        player.play();
        clearInterval(tick);
      }
    }, 50);
    return () => clearInterval(tick);
  }, [player])
);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
        accessibilityLabel="Close"
      >
        <Ionicons
          name="chevron-back"
          size={28}
          style={styles.closeButtonIcon}
        />
      </TouchableOpacity>
      <Text style={styles.previewTag}>Preview</Text>
      <Text style={styles.timeText}>
                {fmtMMSS(progress)} / {fmtMMSS(duration)}
              </Text>
      <Slider
        style={styles.progressSlider}
        minimumValue={0}
        maximumValue={duration}
        value={progress}
        minimumTrackTintColor="#d8d8d8ff"
        maximumTrackTintColor="#656565ff"
        thumbTintColor="#d8d8d8ff"
        onSlidingStart={() => setIsSliding(true)}
        onSlidingComplete={(value) => {
          setIsSliding(false);
          if (player) player.currentTime = value;
        }}
        onValueChange={(value) => setProgress(value)}
      />
      <VideoView
        player={player}
        style={styles.video}
        nativeControls={false}
        contentFit={contentFit}
      />
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
        accessibilityLabel="Next"
        activeOpacity={0.8}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewTag: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    zIndex: 20,
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    // backgroundColor: "rgba(0,0,0,0.4)",
    // paddingHorizontal: 20,
    paddingVertical: 6,
    // borderRadius: 16,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 30,
    padding: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  closeButtonIcon: {
    color: "#fff",
  },
    timeText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 4,
    position: "absolute",
    bottom: 160,
    alignSelf: "center",
    zIndex: 10,
  },
  progressSlider: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    height: 32,
    zIndex: 5,
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 0,
  },
  nextButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#FF004F", 
    paddingHorizontal: 38,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
