// app/(modals)/upload/_layout.tsx
import { Stack } from "expo-router";

export default function UploadLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="capture"
        options={{
          // immersive, dark UI for camera
          statusBarStyle: "light",
          contentStyle: { backgroundColor: "#000" },
          // avoid accidental back-swipe during recording (iOS)
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="preview"
        options={{
          statusBarStyle: "light",
          contentStyle: { backgroundColor: "#000" },
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          // edit is form-like on white
          statusBarStyle: "dark",
          contentStyle: { backgroundColor: "#fff" },
        }}
      />
    </Stack>
  );
}
