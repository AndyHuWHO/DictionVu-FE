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
          {
            position: "absolute",
            top: insets.top,
            right: 10,
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          },
        ]}
        onPress={() => {
          router.push("/search");
        }}
      >
        <Ionicons name="search" size={23} color={theme.icon} />
      </TouchableOpacity>

      <TopTabs.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "transparent",
            position: "absolute",
            paddingTop: insets.top,
            zIndex: 9,
            // elevation: 0,
            shadowOpacity: 0,
            // width: "80%",
            alignSelf: "center",
            alignItems: "center",
            // borderWidth: 1,
            // borderColor: "red",
          },

          // Center Feed and Liked inside the full-width bar.
          tabBarContentContainerStyle: {
            justifyContent: "center",
          },
          tabBarItemStyle: { width: 70, minHeight: 48 },
          tabBarLabel(props) {
            return (
              <ThemedText
                style={{
                  color: props.focused
                    ? theme.tabBarActive
                    : theme.tabBarInactive,
                  fontSize: props.focused ? 17 : 16,
                  fontWeight: props.focused ? "bold" : "normal",
                  textShadowColor:
                    colorScheme === "dark"
                      ? "rgba(0, 0, 0, 0.85)"
                      : "rgba(255, 255, 255, 0.85)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
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
