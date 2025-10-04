// app/(modals)/search/index.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedTextInput } from "@/components/themed/ThemedTextInput";
import SuggestionList from "@/components/diction/SuggestionList";
import { useSearchAction } from "@/hooks/useSearchAction";

export default function SearchModal() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];
  const { performSearch } = useSearchAction();

  const submit = () => {
    performSearch(value);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={[ "left", "right"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={{ flex: 1 }}>
            {/* Header row */}
            <ThemedView style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => { router.back(); }} 
                style={styles.icon}
              >
                <Ionicons name="close" size={24} color={theme.icon} />
              </TouchableOpacity>

              <ThemedTextInput
                autoFocus
                value={value}
                onChangeText={setValue}
                onSubmitEditing={submit}
                placeholder="Search …"
                autoCapitalize="none"
                returnKeyType="search"
                style={[styles.input, { borderColor: theme.border }]}
              />

              <TouchableOpacity onPress={submit} style={styles.icon}>
                <Ionicons name="search" size={24} color={theme.icon} />
              </TouchableOpacity>
            </ThemedView>

            {/* Recent search suggestions */}
            <SuggestionList onPick={performSearch} />
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 60,
    paddingBottom: 8,
  },
  icon: { padding: 8 },
  input: {
    flex: 1,
    fontSize: 18,
    borderBottomWidth: 1,
    // borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 8,
  },
});
