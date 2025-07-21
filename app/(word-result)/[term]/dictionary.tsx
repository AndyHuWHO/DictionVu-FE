// app/(tabs)/diction/term/[term]/dictionary.tsx
import { Text, View, Button, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import debugBorder from "@/constants/debugBorder";

export default function DictionaryScreen() {
  const { term } = useLocalSearchParams();

  return (
      <View style={[{ padding: 10 }, debugBorder("white")]}>
        <Text>Dictionary info for: {term}</Text>
      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  text: {
    fontSize: 20,
  },
});