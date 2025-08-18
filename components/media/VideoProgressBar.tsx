import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { fmtMMSS } from "@/utils/fmtMMSS";

type Props = {
  progress: number;
  duration: number;
  isSliding: boolean;
  visible: boolean;
  onSeek: (value: number) => void;
  onSlidingStart?: () => void;
  onSlidingComplete?: (value: number) => void;
};

export default function VideoProgressBar({
  progress,
  duration,
  isSliding,
  visible,
  onSeek,
  onSlidingStart,
  onSlidingComplete,
}: Props) {
//   if (!visible) return null;

  return (
    <View style={[styles.container, {opacity: visible ? 1 : 0}]}>
      {visible && (
        <Text style={styles.timeText}>
          {fmtMMSS(progress)} / {fmtMMSS(duration)}
        </Text>
      )}
      <Slider
        value={progress}
        step={0.01}
        minimumValue={0}
        maximumValue={duration > 0 ? duration : 1}
        onValueChange={onSeek}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSlidingComplete}
        minimumTrackTintColor="#ffffffff"
        maximumTrackTintColor="#777777ff"
        thumbTintColor="transparent"
        // thumbImage={require("@/assets/pixel.png")}
        style={[{width: "100%", borderRadius: 0, height: 60}]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // paddingTop: 4,
    zIndex:10,
    position: "absolute",
    bottom: -15,
  },
  timeText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 4,
  },
  slider: {
    height: 60,
    borderRadius: 0,
    width: "100%",
  },
  sliderThick: {
    height: 60,
    width: "100%",
  },
});
