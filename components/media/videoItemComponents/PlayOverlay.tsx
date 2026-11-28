import { memo, useEffect, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
};

function PlayOverlay({ visible }: Props) {
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: visible ? 120 : 250,
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [opacity, visible]);

  return (
    <Animated.View pointerEvents="none" style={[styles.overlay, { opacity }]}>
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

export default memo(PlayOverlay);
