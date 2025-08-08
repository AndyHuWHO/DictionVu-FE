// app/(tabs)/media/index.tsx
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { Text, View } from "react-native";

export default function FeedTopTabScreen() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: "red",
      }}
    >
      <ThemedText>🎥 Feed Top Tab</ThemedText>
    </ThemedView>
  );
}
