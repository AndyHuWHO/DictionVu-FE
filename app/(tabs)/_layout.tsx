// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.tabBarBackground },
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
      }}
    >
      <Tabs.Screen name="diction/index" options={{ title: "Diction" }} />
      <Tabs.Screen name="vu/index" options={{ title: "Vu" }} />
      <Tabs.Screen
        name="upload/index"
        options={{
          title: "Upload",
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <Feather
              name="plus-circle"
              size={27}
              style={{ marginBottom: -15, color: theme.tabBarActive }}
            />
          ),
        }}
      />
      <Tabs.Screen name="message/index" options={{ title: "Message" }} />
      <Tabs.Screen name="profile/index" options={{ title: "Profile" }} />
    </Tabs>
  );
}
