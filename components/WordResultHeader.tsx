import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "./themed/ThemedView";
import { ThemedTextInput } from "./themed/ThemedTextInput";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { debugBorder } from "@/constants/debugBorder";

type Props = {
  route: {
    params?: {
      term?: string;
    };
  };
};

export default function WordResultHeader({ route }: Props) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { colorScheme } = useThemeContext();
  const term = route?.params?.term ?? "";
  const theme = Colors[colorScheme];
  const placeholder = isFocused ? "" : route?.params?.term ?? "Search ...";

  const handleSearch = () => {
    const trimmed = value.trim().toLowerCase();
    setValue("");
    if (!trimmed) return;
    router.replace(`/(word-result)/${encodeURIComponent(trimmed)}`);
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ backgroundColor: theme.background }}
    >
      <ThemedView style={[styles.header]}>
        <TouchableOpacity onPress={() => router.dismiss()} style={styles.icon}>
          <Ionicons name="chevron-back-outline" size={24} color={theme.icon} />
        </TouchableOpacity>
        {/* <ThemedView style={[styles.inputWrapper]}> */}
        <ThemedTextInput
          style={[styles.input, { textAlign: isFocused ? "left" : "center" }]}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={setValue}
          onSubmitEditing={handleSearch}
          placeholder={placeholder}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {/* <TouchableOpacity
            onPress={() => router.dismiss()}
            style={[styles.icon]}
          >
            <Ionicons
              name="return-down-back"
              size={24}
              color={theme.icon}
              style={styles.inputIcon}
            />
          </TouchableOpacity> */}
        {/* </ThemedView> */}

        <TouchableOpacity style={styles.icon} onPress={handleSearch}>
          <Ionicons name="search" size={20} color={theme.icon} />
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    padding: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    padding: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
  },
  input: {
    flex: 1,
    fontSize: 24,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    justifyContent: "center",
  },
  inputIcon: {
    position: "absolute",
    right: 10,
  },
});
