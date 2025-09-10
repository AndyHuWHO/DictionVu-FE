// components/media/PlayOverlay.tsx
import React from "react";
import { Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  fadeAnim: Animated.Value;
};

export default function PlayOverlay({ visible, fadeAnim }: Props) {
  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Ionicons name="play" size={72} color="rgba(255,255,255,0.85)" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: "45%",
    left: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
});
