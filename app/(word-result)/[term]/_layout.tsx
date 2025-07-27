// app/(word-result)/[term]/_layout.tsx
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DictionaryScreen from "./Dictionary";
import DictionaryScreen1 from "./Dictionary1";
import DictionaryScreen2 from "./Dictionary2";
import DictionaryScreen3 from "./Dictionary3";
import DictionaryScreen4 from "./Dictionary4";
import MediaScreen from "./Media";
import debugBorder from "@/constants/debugBorder";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/themed/ThemedText";

const TopTabs = createMaterialTopTabNavigator();
const tabScreens = [
  {
    name: "dictionary",
    title: "Dictionary",
    component: DictionaryScreen,
  },
  {
    name: "media",
    title: "Media",
    component: MediaScreen,
  },
];

export default function TermTabsLayout() {
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];
  const tabCount = tabScreens.length;
  const scrollable = tabCount > 3;
  return (
    <TopTabs.Navigator
      style={[]}
      screenOptions={{
        // tabBarIndicatorStyle: {
        //   backgroundColor: theme.tabBarActive,
        //   width: 100,
        //   marginLeft: 50,
        // },
        tabBarScrollEnabled: scrollable,
        tabBarItemStyle: scrollable ? { width: 110 } : {},
        tabBarIndicator(props) {
          return <></>;
        },
        tabBarLabel(props) {
          return (
            <ThemedText
              style={{
                color: props.focused
                  ? theme.tabBarActive
                  : theme.tabBarInactive,
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
     {tabScreens.map((tab) => (
        <TopTabs.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ title: tab.title }}
        />
      ))}
    </TopTabs.Navigator>
  );
}
