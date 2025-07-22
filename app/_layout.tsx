import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/context/ThemeContext";
import WordResultHeader from "../components/WordResultHeader";

export default function RootLayout() {
  return (
    <ThemeProvider> 
      <SafeAreaProvider> 
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "" }}
          />
          <Stack.Screen
            name="(word-result)/[term]"
            options={({ route }) => ({
              header: () => <WordResultHeader route={route} />,
              animation: "none",
            })}
          />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
