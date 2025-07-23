// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/themed/ThemedText";

export default function TabLayout() {
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.tabBarBackground, height: 80 },
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        // tabBarIcon: () => null,
        tabBarLabel(props) {
          return (
            <ThemedText
              style={{
                color: props.focused
                  ? theme.tabBarActive
                  : theme.tabBarInactive,
                fontSize: 14,
                fontWeight: props.focused ? "500" : "400",
                // marginTop: -20,
              }}
            >
              {props.children}
            </ThemedText>
          );
        },
      }}
    >
      <Tabs.Screen
        name="diction/index"
        options={{
          title: "Diction",
          tabBarIcon(props) {
            return (
              <Feather
                name="book-open"
                size={27}
                style={{
                  color: props.focused
                    ? theme.tabBarActive
                    : theme.tabBarInactive,
                }}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="vu/index"
        options={{
          title: "Vu",
          tabBarIcon(props) {
            return (
              <Feather
                name="video"
                size={27}
                style={{
                  color: props.focused
                    ? theme.tabBarActive
                    : theme.tabBarInactive,
                }}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="upload/index"
        options={{
          title: "Upload",
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <Feather
              name="plus-circle"
              size={27}
              style={{ marginBottom: -10, color: theme.tabBarActive }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="message/index"
        options={{
          title: "Message",
          tabBarIcon(props) {
            return (
              <Feather
                name="message-square"
                size={27}
                style={{
                  color: props.focused
                    ? theme.tabBarActive
                    : theme.tabBarInactive,
                }}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon(props) {
            return (
              <Feather
                name="user"
                size={27}
                style={{
                  color: props.focused
                    ? theme.tabBarActive
                    : theme.tabBarInactive,
                }}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}
