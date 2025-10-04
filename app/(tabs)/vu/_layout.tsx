import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FeedTopTabScreen from "./feed";
import LikedTopTabScreen from "./liked";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { setStatusBarStyle } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import { useRouter } from "expo-router";
const TopTabs = createMaterialTopTabNavigator();

const tabScreens = [
  {
    name: "feed",
    title: "Feed",
    component: FeedTopTabScreen,
  },
  {
    name: "liked",
    title: "Liked",
    component: LikedTopTabScreen,
  },
];
export default function MediaTabsLayout() {
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useFocusEffect(() => {
    setStatusBarStyle("light");
    return () => {
      setStatusBarStyle("auto");
    };
  });
  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <TouchableOpacity
        style={[
          { padding: 10, position: "absolute", right: 20, top: 48, zIndex: 10 },
        ]}
        onPress={() => {
          router.push("/search");
        }}
      >
        <Ionicons name="search" size={22} color={theme.icon} />
      </TouchableOpacity>

      <TopTabs.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "transparent",
            position: "absolute",
            paddingTop: insets.top,
            // top: 0,
            // left: 0,
            // right: 0,
            zIndex: 10,
            elevation: 0,
            shadowOpacity: 0,
            // borderWidth: 1,
            // borderColor: "red",
            width: "80%",
            alignSelf: "center",
            alignItems: "center",
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.text,
          tabBarItemStyle: { width: 70 },
          tabBarLabel(props) {
            return (
              <ThemedText
                style={{
                  color: props.focused
                    ? Colors.dark.tabBarActive
                    : Colors.dark.tabBarInactive,
                  fontSize: 16,
                  fontWeight: props.focused ? "bold" : "normal",
                }}
              >
                {props.children}
              </ThemedText>
            );
          },
          tabBarIndicator(props) {
            return <></>;
          },
        }}
      >
        {tabScreens.map((screen) => (
          <TopTabs.Screen
            key={screen.name}
            name={screen.name}
            options={{ title: screen.title }}
          >
            {() => <screen.component />}
          </TopTabs.Screen>
        ))}
      </TopTabs.Navigator>
    </SafeAreaView>
  );
}
