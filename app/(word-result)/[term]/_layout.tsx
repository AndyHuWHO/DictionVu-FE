// app/(tabs)/diction/term/[term]/_layout.tsx
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DictionaryScreen from "./dictionary";
import MediaScreen from "./media";
import debugBorder from "@/constants/debugBorder";

const TopTabs = createMaterialTopTabNavigator();

export default function TermTabsLayout() {
  return (
    <TopTabs.Navigator style={[debugBorder("white")]}>
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
