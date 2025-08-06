// app/(tabs)/upload/index.tsx
import { useRef, useState, useEffect, use } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
  CameraType,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

export default function UploadCameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const [facing, setFacing] = useState<CameraType>("back");
  const [isRecording, setIsRecording] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  useEffect(() => {
    const requestAllPermissions = async () => {
      if (!cameraPermission?.granted) await requestCameraPermission();
      if (!micPermission?.granted) await requestMicPermission();
      if (!mediaLibraryPermission?.granted)
        await requestMediaLibraryPermission();
    };
    requestAllPermissions();
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) return;
    const availableLenses = await cameraRef.current.getAvailableLensesAsync();
    console.log("Available Lenses:", availableLenses);

    try {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({
        maxDuration: 15,
      });

      setIsRecording(false);

      router.push({
        pathname: "/upload/preview",
        params: {
          contentUri: video?.uri,
          type: "video",
        },
      });
      console.log("Video URI:", video?.uri);
    } catch (err) {
      console.error("Recording error:", err);
      Alert.alert("Error", "Video recording failed.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "videos",
      allowsEditing: true,
      videoMaxDuration: 15,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      router.push({
        pathname: "/upload/preview",
        params: {
          contentUri: asset.uri,
          type: asset.type,
        },
      });
    }
  };

  if (
    !cameraPermission?.granted ||
    !micPermission?.granted ||
    !mediaLibraryPermission?.granted
  ) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Please grant Camera, Microphone, and Media Library permissions.
        </Text>
        <TouchableOpacity
          onPress={async () => {
            await requestCameraPermission();
            await requestMicPermission();
            await requestMediaLibraryPermission();
          }}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        zoom={0}
        mode="video"
        videoQuality="720p"
        mute={false}
        autofocus="on"
        selectedLens="Back Camera"
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          accessibilityLabel="Close"
        >
          <Feather name="x" size={28} style={styles.closeButtonIcon} />
        </TouchableOpacity>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
            // onPress={launchCamera}
          >
            <Text style={styles.flipText}>🔁</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && { backgroundColor: "#900" },
            ]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Text style={styles.recordText}>
              {isRecording ? "■ Stop" : "● Record"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.galleryButton}
            onPress={pickFromLibrary}
          >
            <Text style={styles.galleryText}>📁</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    // right: 20,
    padding: 20,
  },
  closeButtonIcon: {
    color: "#fff",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  permissionButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
  },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  recordButton: {
    backgroundColor: "red",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 40,
  },
  recordText: {
    fontSize: 18,
    color: "#fff",
  },
  flipButton: {
    backgroundColor: "#00000066",
    padding: 10,
    borderRadius: 30,
  },
  flipText: {
    fontSize: 18,
    color: "#fff",
  },
  galleryButton: {
    backgroundColor: "#00000066",
    padding: 10,
    borderRadius: 30,
  },
  galleryText: {
    fontSize: 18,
    color: "#fff",
  },
});
