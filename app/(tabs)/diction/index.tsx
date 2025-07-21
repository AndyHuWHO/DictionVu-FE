// app/(tabs)/diction/index.tsx
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DictionTabScreen() {
  const [term, setTerm] = useState("");
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      setTerm("");
    }, [])
  );

  const handleSearch = () => {
    const trimmed = term.trim();
    if (!trimmed) return;
    router.push(`/(word-result)/${encodeURIComponent(trimmed)}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Enter a word..."
          value={term}
          onChangeText={setTerm}
          style={styles.input}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
          <Ionicons name="search" size={24} color="#222" />
        </TouchableOpacity>
      </View>
    </View>
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
