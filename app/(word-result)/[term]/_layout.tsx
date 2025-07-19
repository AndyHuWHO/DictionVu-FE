// app/(tabs)/diction/term/[term]/_layout.tsx
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DictionaryScreen from "./dictionary";
import MediaScreen from "./media";
import { SafeAreaProvider } from "react-native-safe-area-context";

const TopTabs = createMaterialTopTabNavigator();

export default function TermTabsLayout() {
  return (
      <TopTabs.Navigator>
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
