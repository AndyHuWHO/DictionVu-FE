// app/(term)/_layout.tsx
import { Stack } from "expo-router";
import MyCustomHeader from '../components/MyCustomHeader';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title:"" }} />
      <Stack.Screen
        name="(word-result)/[term]"
        options={{
          header: MyCustomHeader
        }}
      />
    </Stack>
  );
}
