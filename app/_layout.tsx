// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/context/ThemeContext";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import AppProvider from "@/context/AppProvider";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppProvider>
            <StatusBar style="auto" />
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false, title: "", }}
              />
              <Stack.Screen
                name="(auth)/login"
                options={{
                  headerShown: false,
                  title: "Log In",
                  animation: "fade_from_bottom",
                  animationDuration: 300,
                }}
              />
              <Stack.Screen
                name="(modals)"
                options={{
                  headerShown: false,
                  presentation: "fullScreenModal",
                  // animation: "slide_from_bottom",
                  // animationDuration: 300,
                  animation: "none",
                }}
              />
            </Stack>
            <Toast />
          </AppProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}
