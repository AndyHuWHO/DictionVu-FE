// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/themed/ThemedText";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function TabLayout() {
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const requireAuth = () => {
    if (!auth.token) {
      router.push("/(auth)/login");
      return false;
    }
    return true;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          height: 100,
          // borderWidth: 1,
          // borderColor: "red",
          paddingTop: 8,
        },
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
        name="diction"
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
        name="vu"
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
          // href: null,
          tabBarIcon: () => (
            <Feather
              name="plus-circle"
              size={30}
              style={{ marginBottom: -10, color: theme.tabBarActive }}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // <- critical to avoid switching the tab
            if (!requireAuth()) return;
            router.push("/(modals)/upload/capture");
          },
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
        listeners={{
          tabPress: (e) => {
            if (!requireAuth()) {
              e.preventDefault();
            }
          },
        }}
      />
    </Tabs>
  );
}
