// components/diction/SuggestionList.tsx
import React from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "@/redux/store";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/themed/ThemedText";
import { clearSearches } from "@/redux/features/recentSearchSlice";
import { ThemedView } from "../themed/ThemedView";

type Props = {
  onPick: (term: string) => void;
};

export default function SuggestionList({ onPick }: Props) {
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];
  const recent = useSelector((state: RootState) => state.recentSearch.entries);
  const dispatch = useDispatch();

  if (!recent.length) {
    return (
      <ThemedView style={styles.empty}>
        <ThemedText>No recent searches</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { borderColor: theme.border }]}>
      <ThemedView style={styles.headerRow}>
        <ThemedText>Recent</ThemedText>
        <Pressable
          onPress={() => dispatch(clearSearches())}
          style={styles.clearBtn}
        >
          <Ionicons name="trash-outline" size={18} color={theme.icon} />
          <ThemedText style={{ marginLeft: 6 }}>Clear</ThemedText>
        </Pressable>
      </ThemedView>

      <FlatList
        style={{ flex: 1 }}
        data={recent}
        keyboardDismissMode="on-drag"
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.word}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onPick(item.word)}
            style={({ pressed }) => [styles.itemRow]}
          >
            <Ionicons name="time-outline" size={18} color={theme.icon} />
            <ThemedText style={styles.itemText}>
              <ThemedText style={[styles.wordText, { color: theme.tabBarActive }]}>{item.word}</ThemedText>
              {item.brief ? (
                <ThemedText style={[styles.briefText, { color: theme.tabBarInactive }]}>     {item.brief}</ThemedText>
              ) : null}
            </ThemedText>
          </Pressable>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderRadius: 8,
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  clearBtn: { flexDirection: "row", alignItems: "center" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemText: { marginLeft: 8, fontSize: 16 },
  wordText: {
    fontWeight: "600",
    fontSize: 16,
  },
  briefText: {
    fontWeight: "400",
    fontSize: 15,
  },

  empty: { padding: 12, alignItems: "center" },
});
