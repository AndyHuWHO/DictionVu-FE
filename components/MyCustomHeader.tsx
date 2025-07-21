import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import debugBorder from "@/constants/debugBorder";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  route: {
    params?: {
      term?: string;
    };
  };
};

export default function MyCustomHeader({ route }: Props) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { term } = useLocalSearchParams();
  const placeholder = route?.params?.term ?? "Search ...";

  const handleSearch = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    router.replace(`/(word-result)/${encodeURIComponent(trimmed)}`);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]}>
      <View style={[styles.header, debugBorder()]}>
        <TouchableOpacity onPress={() => router.dismiss()} style={styles.icon}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { textAlign: isFocused ? "left" : "center" }]}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={setValue}
          onSubmitEditing={handleSearch}
          placeholder={placeholder}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.icon} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#222" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginHorizontal: 8,
    paddingVertical: 4,
    color: "#222",
  },
});
