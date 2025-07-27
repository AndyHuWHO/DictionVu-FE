// app/(word-result)/[term]/dictionary.tsx
import { StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed/ThemedText";
import { useGetWordInfoQuery } from "@/redux/apis/wordApi";
import { ThemedScrollView } from "@/components/themed/ThemedScrollView";
import { DictionaryEntry } from "@/components/DictionaryEntry";
import {View, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function DictionaryScreen4() {
  const { term } = useLocalSearchParams();
  const searchTerm = Array.isArray(term) ? term[0] : term ?? "";
  const { data, error, isLoading } = useGetWordInfoQuery(searchTerm, {
    // refetchOnMountOrArgChange: true,
    // refetchOnReconnect: true,
  });
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (isLoading) {
    return (
      <ThemedScrollView contentContainerStyle={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText>Loading...</ThemedText>
      </ThemedScrollView>
    );
  }

  if (error) {
    return (
      <ThemedScrollView contentContainerStyle={styles.container}>
        <ThemedText style={{ fontSize: 18}}>
          {" "}
          {"status" in error &&
          error.data &&
          typeof error.data === "object" &&
          "error" in error.data
            ? (error.data as { error?: string }).error
            : "An unknown error occurred."}
        </ThemedText>
      </ThemedScrollView>
    );
  }

  if (!data) {
    return (
      <ThemedScrollView contentContainerStyle={styles.container}>
        <ThemedText>No results found.</ThemedText>
      </ThemedScrollView>
    );
  }

  const posList = data.dictionaryInfoList.map(info => info.partOfSpeech);


  return (
<ThemedScrollView contentContainerStyle={styles.contentContainer}>
      <ThemedText style={styles.word}>{data.word}</ThemedText>
      {/* POS Tabs */}
      <View style={styles.posTabs}>
        {posList.map((pos, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.posTab,
              idx === selectedIdx && styles.posTabSelected
            ]}
            onPress={() => setSelectedIdx(idx)}
          >
            <ThemedText style={[
              styles.posTabText,
              idx === selectedIdx && styles.posTabTextSelected
            ]}>
              {pos}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      {/* Only show the selected DictionaryEntry */}
      <DictionaryEntry info={data.dictionaryInfoList[selectedIdx]} />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: 80
  },
  contentContainer: {
    padding: 24,
    paddingTop: 15,
    alignItems: "flex-start",
    minHeight: "100%",
  },
  word: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
    posTabs: {
    flexDirection: "row",
    flexWrap: "wrap",     
    marginBottom: 16,
    gap: 8,
  },
posTab: {
  paddingVertical: 8,
  paddingHorizontal: 18,
  borderRadius: 20,
  backgroundColor: "#919393ff",
  // marginRight: 8,
  // marginBottom: 8,
  borderWidth: 1,
  borderColor: "#919393ff",
  // Shadow for iOS
  shadowColor: "#434343ff",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 3,
},
posTabSelected: {
  backgroundColor: "#12cbd9ff",
  borderColor: "#12cbd9ff",
  shadowOpacity: 0.25,
  elevation: 6,
},
  posTabText: {
    fontSize: 15,
    color: "#eee",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  posTabTextSelected: {
    color: "#fff",
  },
});
