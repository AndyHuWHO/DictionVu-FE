// components/diction/MainSearchHeader.tsx
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedTextInput } from "@/components/themed/ThemedTextInput";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

type Props = {
    term: string | null;
    setTerm: (term: string | null) => void;
};

export default function MainSearchHeader({term, setTerm}: Props) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];
  const placeholder = isFocused ? "" : term ?? "Search ...";

  const handleSearch = () => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return;
    setTerm(trimmed);
  };

  const handleBack = () => {
    setTerm(null)
  };

  const handleUnfocus = () => {
    setIsFocused(false);
    setValue("");
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ backgroundColor: theme.background }}
    >
      <ThemedView style={[styles.header]}>
        {term && <TouchableOpacity onPress={handleBack} style={styles.icon}>
          <Ionicons name="chevron-back-outline" size={24} color={theme.icon} />
        </TouchableOpacity>}
        

        <ThemedTextInput
          style={[styles.input, {textAlign: isFocused ? "left" : "center" }]}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={handleUnfocus}
          onChangeText={setValue}
          onSubmitEditing={handleSearch}
          placeholder={placeholder}
          autoCapitalize="none"
          returnKeyType="search"
        />

        <TouchableOpacity style={styles.icon} onPress={handleSearch}>
          <Ionicons name="search" size={24} color={theme.icon} />
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
    // padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
  },
  input: {
    flex: 1,
    fontSize: 20,
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
