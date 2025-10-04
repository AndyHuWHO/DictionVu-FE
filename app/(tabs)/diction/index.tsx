// app/(tabs)/diction/index.tsx
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed/ThemedView";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import MainPageContent from "@/components/diction/MainPageContent";

export default function DictionTabScreen() {
  const router = useRouter();
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];

  const handleSearch = () => {
    router.push("/search");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.background }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={[styles.container]}>
            <TouchableOpacity onPress={handleSearch}>
              <ThemedView
                style={[styles.searchRow, { borderColor: theme.border }]}
              >
                <Ionicons
                  name="search"
                  size={24}
                  color={theme.icon}
                  style={styles.iconButton}
                />
              </ThemedView>
            </TouchableOpacity>

            <MainPageContent />
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
    padding: 10,
  },
});
