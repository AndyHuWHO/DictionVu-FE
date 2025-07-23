// app/(tabs)/diction/term/[term]/media.tsx
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";

export default function MediaScreen() {
  const { term } = useLocalSearchParams();

  return (
    <ThemedView style={[styles.container]}>
      <ThemedText>Media for: {term}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
