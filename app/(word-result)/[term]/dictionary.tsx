// app/(word-result)/[term]/dictionary.tsx
import { Text, View, Button, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import debugBorder from "@/constants/debugBorder";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";

export default function DictionaryScreen() {
  const { term } = useLocalSearchParams();

  return (
      <ThemedView style={[styles.container]}>
        <ThemedText>Dictionary info for: {term}</ThemedText>
      </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});