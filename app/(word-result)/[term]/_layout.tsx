// app/(word-result)/[term]/_layout.tsx
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DictionaryScreen from "./Dictionary";
import MediaScreen from "./Media";
import debugBorder from "@/constants/debugBorder";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/themed/ThemedText";

const TopTabs = createMaterialTopTabNavigator();

export default function TermTabsLayout() {
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];
  return (
    <TopTabs.Navigator
      style={[]}
      screenOptions={{
        // tabBarIndicatorStyle: {
        //   backgroundColor: theme.tabBarActive,
        //   width: 100,
        //   marginLeft: 50,
        // },
        tabBarIndicator(props) {
          return (
            <></>
          );
        },
        tabBarLabel(props) {
          return (
            <ThemedText
              style={{
                color: props.focused ? theme.tabBarActive : theme.tabBarInactive,
                fontSize: 14,
                fontWeight: props.focused ? "bold" : "normal",
              }}
            >
              {props.children}
            </ThemedText>
          );
        },
        tabBarStyle: { backgroundColor: theme.tabBarBackground },
        // tabBarActiveTintColor: theme.tabBarActive,
        // tabBarInactiveTintColor: theme.tabBarInactive,
      }}
    >
      <TopTabs.Screen
        name="dictionary"
        component={DictionaryScreen}
        options={{ title: "Dictionary" }}
      />
      <TopTabs.Screen
        name="media"
        component={MediaScreen}
        options={{ title: "Media" }}
      />
    </TopTabs.Navigator>
  );
}
