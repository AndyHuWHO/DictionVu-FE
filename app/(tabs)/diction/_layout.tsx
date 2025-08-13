// app/(tabs)/diction/layout.tsx
import { Stack } from "expo-router";
import WordResultHeader from "@/components/WordResultHeader";

export default function DictionLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen
        name="(word-result)/[term]"
        options={
          ({ route }) => ({
            header: () => <WordResultHeader route={route} />,
            animation: "none",
          })
          // {headerShown: false, title: "Word Result"}
        }
      />
    </Stack>
  );
}
