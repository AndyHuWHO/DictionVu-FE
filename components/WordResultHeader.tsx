import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import debugBorder from "@/constants/debugBorder";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "./themed/ThemedView";
import { ThemedTextInput } from "./themed/ThemedTextInput";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

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
  const { term } = useLocalSearchParams();
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];
  const placeholder = isFocused ? "" : route?.params?.term ?? "Search ...";

  const handleSearch = () => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return;
    router.replace(`/(word-result)/${encodeURIComponent(trimmed)}`);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{backgroundColor:theme.background}}>
      <ThemedView style={[styles.header]}>
        <TouchableOpacity onPress={() => router.dismiss()} style={styles.icon}>
          <Ionicons name="chevron-back-outline" size={24} color={theme.icon} />
        </TouchableOpacity>
        <ThemedTextInput
          style={[styles.input, { textAlign: isFocused ? "left" : "center" }]}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={setValue}
          onSubmitEditing={handleSearch}
          placeholder={placeholder}
        />
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
  flex: 1,
  position: 'relative',
  marginHorizontal: 8,
},
  input: {
  flex: 1,
  fontSize: 16,
  borderWidth: 1,
  // borderColor: "#ccc",
  borderRadius: 6,
  paddingVertical: 6,
  paddingHorizontal: 12,
  marginHorizontal: 8,
  // color: "#222",
},
});
