// app/_layout.tsx
import { Stack } from "expo-router";
import MyCustomHeader from "../components/MyCustomHeader";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "" }}
        />
        <Stack.Screen
          name="(word-result)/[term]"
          options={({ route }) => ({
            header: () => <MyCustomHeader route={route} />,
            animation: "none",
          })}
        />
      </Stack>
    </>
  );
}
