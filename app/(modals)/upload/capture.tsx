// app/(modals)/upload/capture.tsx
import { useRef, useState, useEffect } from "react";
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
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { InteractionManager } from "react-native";
import UploadControls from "@/components/upload/UploadControls";
import { fmtMMSS } from "@/utils/fmtMMSS";

export default function UploadCaptureScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const [facing, setFacing] = useState<CameraType>("back");
  const [isRecording, setIsRecording] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const isFocused = useIsFocused();

  const MAX_SECONDS = 15;
  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimer = () => {
    stopTimer();
    setElapsedSec(0);
    timerRef.current = setInterval(() => {
      setElapsedSec((s) => {
        const next = s + 1;
        if (next >= MAX_SECONDS) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return MAX_SECONDS;
        }
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setElapsedSec(0);
  };


  const cancelRef = useRef(false);
  const handleClose = () => {
    cancelRef.current = true;
    if (isRecording) {
      try {
        cameraRef.current?.stopRecording();
      } catch {}
    }
    router.dismiss();
  };

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
    if (!cameraRef.current || isRecording) return;

    const availableLenses = await cameraRef.current.getAvailableLensesAsync();
    console.log("Available Lenses:", availableLenses);

    cancelRef.current = false;
    try {
      setIsRecording(true);
      startTimer();
      const video = await cameraRef.current.recordAsync({
        maxDuration: MAX_SECONDS,
      });

      setIsRecording(false);

      if (cancelRef.current || !video?.uri) return;

      await new Promise<void>((r) =>
        InteractionManager.runAfterInteractions(() => r())
      );

      router.push({
        pathname: "/(modals)/upload/preview",
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
      stopTimer();
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      // stopTimer();
    }
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "videos",
      allowsEditing: true,
      videoMaxDuration: MAX_SECONDS,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      await new Promise<void>((r) =>
        InteractionManager.runAfterInteractions(() => r())
      );
      router.push({
        pathname: "/(modals)/upload/preview",
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
      {isFocused && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          zoom={0}
          mode="video"
          videoQuality="720p"
          mute={false}
          autofocus="on"
          selectedLens={"Back Camera"}
        />
      )}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        accessibilityLabel="Close"
      >
        <Feather name="x" size={28} style={styles.closeButtonIcon} />
      </TouchableOpacity>
      {isRecording && (
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>
            {fmtMMSS(Math.min(elapsedSec, MAX_SECONDS))}/{fmtMMSS(MAX_SECONDS)}
          </Text>
        </View>
      )}
      <UploadControls
        isRecording={isRecording}
        onFlip={() => setFacing(facing === "back" ? "front" : "back")}
        onRecordStart={startRecording}
        onRecordStop={stopRecording}
        onPickFromLibrary={pickFromLibrary}
      />
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
  timerBadge: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 12,
  },
  timerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
