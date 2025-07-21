// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
            <Ionicons
              name="add-circle"
              size={30}
              style={{ marginBottom: -15 }}
            />
          ),
        }}
      />
      <Tabs.Screen name="message/index" options={{ title: "Message" }} />
      <Tabs.Screen name="profile/index" options={{ title: "Profile" }} />
    </Tabs>
  );
}
