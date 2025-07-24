// app/(word-result)/[term]/dictionary.tsx
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed/ThemedText";
import { useGetWordInfoQuery } from "@/redux/apis/wordApi";
import { ThemedScrollView } from "@/components/themed/ThemedScrollView";
import { DictionaryEntry } from "@/components/DictionaryEntry";


export default function DictionaryScreen() {
  const { term } = useLocalSearchParams();
  const searchTerm = Array.isArray(term) ? term[0] : term ?? "";
  const { data, error, isLoading } = useGetWordInfoQuery(searchTerm, {
    // refetchOnMountOrArgChange: true,
    // refetchOnReconnect: true,
  });

  if (isLoading) {
    return (
      <ThemedScrollView contentContainerStyle={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedScrollView>
    );
  }

  if (error) {
    return (
      <ThemedScrollView contentContainerStyle={styles.container}>
        <ThemedText style={{ fontSize: 18, paddingTop:50}}>
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

  return (
    <ThemedScrollView contentContainerStyle={styles.contentContainer}>
      <ThemedText style={styles.word}>{data.word}</ThemedText>
      {data.dictionaryInfoList?.map((info, idx) => (
        <DictionaryEntry key={idx} info={info} />
      ))}
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  contentContainer: {
    padding: 24,
    paddingTop: 0,
    alignItems: "flex-start",
    minHeight: "100%",
  },
  word: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
