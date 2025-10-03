// app/(modals)/upload/edit.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useVideoPlayer } from "expo-video";
import { setStatusBarStyle } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { uploadMediaThunk } from "@/redux/features/mediaUpload/mediaUploadThunks";
import { RootState, AppDispatch } from "@/redux/store";
import { File } from "expo-file-system";

export default function EditMediaScreen() {
  const { contentUri, thumbnailUri, contentFit } = useLocalSearchParams<{
    contentUri: string;
    thumbnailUri: string;
    contentFit?: "contain" | "cover";
  }>();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const MAX_WORDS = 100;

  const countGraphemes = (text: string) => {
    // if (typeof Intl !== "undefined" && Intl.Segmenter) {
    // console.log("Using Intl.Segmenter for grapheme counting");
    // const s = new Intl.Segmenter();
    // return Array.from(s.segment(text)).length;
    // }
    // Fallback: counts code points (good enough for most cases)
    return Array.from(text).length;
  };

  const handleDescriptionChange = (text: string) => {
    const count = countGraphemes(text);
    if (count <= MAX_WORDS) {
      setDescription(text);
    }
  };

  const [wordInput, setWordInput] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [fileSizeBytes, setFileSizeBytes] = useState<number | null>(null);
  // const [isInputFocused, setIsInputFocused] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const uploadStatus = useSelector(
    (state: RootState) => state.mediaUpload.status
  );

  const player = useVideoPlayer(contentUri);
  const durationSeconds = player?.duration.toFixed(1);

  useFocusEffect(() => {
    setStatusBarStyle("dark");
    return () => {
      setStatusBarStyle("auto");
    };
  });

  useEffect(() => {
    if (!contentUri) {
      Alert.alert("Missing media", "No media URI provided.");
      router.back();
      return;
    }

    (async () => {
      try {
        const file = new File(contentUri as string);
        const info = file.info();

        if (info.exists && info.size != null) {
          setFileSizeBytes(info.size);
        } else {
          console.warn("Could not retrieve file size");
        }
      } catch (err) {
        console.error("Error retrieving file info:", err);
      }
    })();
    // FileSystem.getInfoAsync(contentUri as string).then((info) => {
    //   if (info.exists && info.size != null) {
    //     setFileSizeBytes(info.size);
    //   } else {
    //     console.warn("Could not retrieve file size");
    //   }
    // });
  }, [contentUri, thumbnailUri]);

  const addWord = () => {
    const trimmed = wordInput.trim();
    if (trimmed && !words.includes(trimmed)) {
      setWords([...words, trimmed]);
      setWordInput("");
    }
  };
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeWord = (wordToRemove: string) => {
    setWords((prev) => prev.filter((w) => w !== wordToRemove));
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleConfirm = () => {
    if (!durationSeconds || !fileSizeBytes) {
      Alert.alert("Missing data", "Duration or file size is missing.");
      return;
    }

    const metadata = {
      description,
      words,
      tags,
      durationSeconds: Number(durationSeconds),
      fileSizeBytes,
      visibility: isPublic ? ("PUBLIC" as "PUBLIC") : ("PRIVATE" as "PRIVATE"),
    };

    const localUris = {
      contentUri: contentUri!,
      thumbnailUri: thumbnailUri!,
    };

    console.log("Uploading local URIs:", localUris);

    console.log("Uploading metadata:", metadata);

    // Fire upload in background
    dispatch(uploadMediaThunk({ metadata, localUris }));

    // // dismiss to feed tab without rerendering
    router.dismissTo("/(tabs)/vu");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
      edges={["top", "bottom"]} // Ensure safe area insets are respected
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
          >
            {/* <StatusBar style="dark" /> */}

            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityLabel="Close"
            >
              <Ionicons name="chevron-back" size={28} />
            </TouchableOpacity>

            {/* {isInputFocused && (
                <TouchableOpacity
                  onPress={handleConfirm}
                  style={styles.topUploadButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.topUploadButtonText}>Upload</Text>
                </TouchableOpacity>
              )} */}

            <TouchableOpacity
              onPress={handleConfirm}
              style={styles.topUploadButton}
              activeOpacity={0.85}
            >
              <Text style={styles.topUploadButtonText}>Upload</Text>
            </TouchableOpacity>

            {/* ───── THUMBNAIL ───── */}
            {thumbnailUri && (
              <View style={styles.thumbnailWrapper}>
                <Image
                  source={{ uri: thumbnailUri }}
                  style={styles.thumbnail}
                  resizeMode={contentFit}
                />
              </View>
            )}

            {/* ───── FORM ───── */}
            <View style={styles.formSection}>
              {/* Word input */}
              <View style={styles.wordRow}>
                <TextInput
                  style={styles.wordInput}
                  placeholder="Add 1 - 5 related words"
                  placeholderTextColor="#999"
                  value={wordInput}
                  onChangeText={setWordInput}
                  onSubmitEditing={addWord}
                  maxLength={20}
                  //  onFocus={() => setIsInputFocused(true)}
                  //   onBlur={() => setIsInputFocused(false)}
                />
                <TouchableOpacity
                  onPress={addWord}
                  disabled={words.length >= 5}
                  style={[
                    styles.addButton,
                    words.length >= 5 && styles.addButtonDisabled,
                  ]}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              {/* Word chips */}
              <View style={styles.wordChipContainer}>
                {words.map((word) => (
                  <TouchableOpacity
                    key={word}
                    style={styles.wordChip}
                    onPress={() => removeWord(word)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.wordChipText}>${word} ×</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Description input */}
              <TextInput
                style={styles.descriptionInput}
                placeholder="Write a description..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={handleDescriptionChange}
                multiline
                scrollEnabled // Allow internal scrolling
                // onFocus={() => setIsInputFocused(true)}
                // onBlur={() => setIsInputFocused(false)}
              />

              <Text
                style={[
                  styles.wordCount,
                  countGraphemes(description) > MAX_WORDS - 10 && {
                    color: "red",
                  },
                ]}
              >
                {countGraphemes(description)}/{MAX_WORDS} words
              </Text>
              {/* Tag input */}
              <View style={styles.wordRow}>
                <TextInput
                  style={styles.wordInput}
                  placeholder="Add 1 - 5 related tags"
                  placeholderTextColor="#999"
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={addTag}
                  maxLength={20}
                  //   onFocus={() => setIsInputFocused(true)}
                  // onBlur={() => setIsInputFocused(false)}
                />
                <TouchableOpacity
                  onPress={addTag}
                  disabled={tags.length >= 5}
                  style={[
                    styles.addButton,
                    { backgroundColor: "#008df8ff" },
                    tags.length >= 5 && styles.addButtonDisabled,
                  ]}
                >
                  <Text style={[styles.addButtonText]}>#Tag</Text>
                </TouchableOpacity>
              </View>

              {/* Tag chips */}
              <View style={styles.wordChipContainer}>
                {tags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.wordChip}
                    onPress={() => removeTag(tag)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.wordChipText}>#{tag} ×</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* ───── SETTINGS ───── */}
              <View style={styles.visibilityToggle}>
                <Text style={styles.toggleLabel}>
                  {isPublic ? "Public" : "Private"}
                </Text>

                <Switch
                  value={isPublic}
                  onValueChange={setIsPublic}
                  thumbColor="#fff"
                  trackColor={{ false: "#ccc", true: "#02b881ff" }}
                  style={{ transform: [{ scale: 0.8 }] }}
                />
              </View>
            </View>

            {/* ───── ACTION ───── */}
            {/* <TouchableOpacity
              onPress={handleConfirm}
              style={styles.uploadButton}
              activeOpacity={0.85}
            >
              <Text style={styles.uploadButtonText}>Confirm Upload</Text>
            </TouchableOpacity> */}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  thumbnailWrapper: {
    alignSelf: "center",
    width: "30%",
    height: "25%",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "black",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  formSection: {
    marginBottom: 28,
  },
  descriptionInput: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    paddingVertical: 20,
    minHeight: 150,
    maxHeight: 150, // limits height
    color: "#000",
    textAlignVertical: "top",
  },
  wordCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginBottom: 5,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
    gap: 10,
  },
  wordInput: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 2,
    color: "#000",
  },
  addButton: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: "#f8aa00ff",
    borderRadius: 6,
  },
  addButtonDisabled: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  wordChipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  wordChip: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  wordChipText: {
    fontSize: 14,
    color: "#333",
  },
  visibilityToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  uploadButton: {
    backgroundColor: "#ff0050",
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 10,
    // position: "absolute",
    // bottom: 50,
    // alignSelf: "center",
    // paddingHorizontal: 40,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  topUploadButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#ff0050",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  topUploadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
