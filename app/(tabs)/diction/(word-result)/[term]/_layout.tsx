// app/(tabs)/diction/(word-result)/[term]/_layout.tsx
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DictionaryScreen from "./dictionary";
import GoogleScreen from "./Google";
import MediaScreen from "./media";
import { useThemeContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

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
  {
    name: "google",
    title: "Google",
    component: GoogleScreen,
  },
];

export default function TermTabsLayout() {
  const { colorScheme } = useThemeContext();
  const theme = Colors[colorScheme];
  const tabCount = tabScreens.length;
  const scrollable = tabCount > 3;
  const router = useRouter();

  // const currentTabRouteName = useNavigationState((state) => {
  //   const nested = state.routes[state.index]?.state;
  //   if (nested && "routes" in nested) {
  //     return typeof nested.index === "number" && nested.routes[nested.index]
  //       ? nested.routes[nested.index].name
  //       : null;
  //   }
  //   return null;
  // });

  const handleBack = () => {
    // router.replace("/(tabs)/diction");
    router.dismiss();
  };

  // useEffect(() => {
  //   console.log("Active top tab:", currentTabRouteName);
  // }, [currentTabRouteName]);

  return (
    <ThemedView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* <TouchableOpacity
        onPress={handleBack}
        style={[
          {
            padding: 10,
            position: "absolute",
            left: 5,
            top: 60,
            // borderWidth: 1,
            // borderColor: "red",
            zIndex: 10,
          },
        ]}
      >
        <Ionicons name="chevron-back-outline" size={24} color={theme.icon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          { padding: 10, position: "absolute", right: 20, top: 60, zIndex: 10 },
        ]}
        onPress={() => {}}
      >
        <Ionicons name="search" size={20} color={theme.icon} />
      </TouchableOpacity> */}

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

          tabBarStyle: {
            backgroundColor: theme.background,
            // width: "80%",
            // borderWidth: 1,
            // borderColor: "red",
            height: 40,
            // alignSelf: "center",
          },

          // tabBarStyle: {
          //   backgroundColor: "transparent",
          //   position: "absolute",
          //   // top: 0,
          //   // left: 0,
          //   // right: 0,
          //   zIndex: 10,
          //   elevation: 0,
          //   shadowOpacity: 0,
          //   borderBottomWidth: 0,
          //   width: "80%",
          //   alignSelf: "center",
          // },

          // tabBarStyle: {
          //   backgroundColor:
          //     currentTabRouteName === "media"
          //       ? "transparent"
          //       : theme.background,
          //   position: currentTabRouteName === "media" ? "absolute" : "relative",
          //   elevation: 0,
          //   shadowOpacity: 0,
          //   borderBottomWidth: 0,
          //   zIndex: 10,
          //   top: currentTabRouteName === "media" ? 0 : undefined,
          // },

          tabBarActiveTintColor: theme.tabBarActive,
          tabBarInactiveTintColor: theme.tabBarInactive,
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    padding: 10,
  },
  tabContainer: {
    flex: 1,
    alignItems: "center",
  },
});
