import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type Props = {
  isRecording: boolean;
  onFlip: () => void;
  onRecordStart: () => void;
  onRecordStop: () => void;
  onPickFromLibrary: () => void;
  containerStyle?: ViewStyle;
};

export default function UploadControls({
  isRecording,
  onFlip,
  onRecordStart,
  onRecordStop,
  onPickFromLibrary,
  containerStyle,
}: Props) {
  return (
    <View style={[styles.controls, containerStyle]}>
      <TouchableOpacity
        style={styles.flipButton}
        onPress={onFlip}
        accessibilityLabel="Flip camera"
      >
        <MaterialIcons name="flip-camera-ios" size={24} style={styles.flipIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.recordButton, isRecording && { backgroundColor: "#900" }]}
        onPress={isRecording ? onRecordStop : onRecordStart}
        accessibilityLabel={isRecording ? "Stop recording" : "Start recording"}
        activeOpacity={0.9}
      >
        {isRecording ? (
          <MaterialCommunityIcons name="record-circle" size={60} color="white" />
        ) : (
          <MaterialCommunityIcons name="record-circle-outline" size={60} color="white" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.galleryButton}
        onPress={onPickFromLibrary}
        accessibilityLabel="Pick from library"
      >
        <FontAwesome5 name="photo-video" size={24} style={styles.galleryText} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 10,
  },
  recordButton: {
    // backgroundColor: "#ff000066",
    backgroundColor: "red",
    padding: 3,
    borderRadius: 50,
  },
  flipButton: {
    backgroundColor: "#00000066",
    padding: 10,
    borderRadius: 50,
  },
  flipIcon: { color: "#fff" },
  galleryButton: {
    backgroundColor: "#00000066",
    padding: 10,
    borderRadius: 50,
  },
  galleryText: { color: "#fff" },
});
