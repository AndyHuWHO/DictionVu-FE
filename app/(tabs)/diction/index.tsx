// app/(tabs)/diction/index.tsx
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed/ThemedView";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { ThemedTextInput } from "@/components/themed/ThemedTextInput";

export default function DictionTabScreen() {
  const [term, setTerm] = useState("");
  const router = useRouter();
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];

  useFocusEffect(
    React.useCallback(() => {
      setTerm("");
    }, [])
  );

  const handleSearch = () => {
    const trimmed = term.trim().toLowerCase();
    if (!trimmed) return;
    router.push(`/(word-result)/${encodeURIComponent(trimmed)}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.searchRow}>
        <ThemedTextInput
          value={term}
          onChangeText={setTerm}
          style={styles.input}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
          <Ionicons name="search" size={24} color={theme.icon} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  iconButton: {
    padding: 8,
  },
});
