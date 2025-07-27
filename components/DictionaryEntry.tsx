import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";

type WordSense = {
  definitionEn: string;
  translationZh: string;
  sampleExpressions: string[];
  sampleSentences: string[];
};

type DictionaryInfo = {
  partOfSpeech: string;
  pronunciation: { uk: string; us: string };
  wordSenseList: WordSense[];
};

export function DictionaryEntry({ info }: { info: DictionaryInfo }) {
  return (
    <ThemedView style={styles.infoBlock}>
      {/* <ThemedText style={styles.partOfSpeech}>{info.partOfSpeech}</ThemedText> */}
      <ThemedText style={styles.pronunciation}>
        uk: / {info.pronunciation.uk} /{"\n"}us: / {info.pronunciation.us} /
      </ThemedText>
      {info.wordSenseList.map((sense, sIdx) => (
        <ThemedView key={sIdx} style={styles.senseBlock}>
          <ThemedText style={styles.translation}>
            {sIdx + 1}. 中文翻译： {sense.translationZh}
          </ThemedText>
          <ThemedText style={styles.definition}>
            {sense.definitionEn}
          </ThemedText>
          {sense.sampleExpressions.length > 0 && (
            <ThemedView style={styles.examplesBlock}>
              <ThemedText style={styles.examplesHeader}>
                Sample Expressions:
              </ThemedText>
              {sense.sampleExpressions.map((exp, eIdx) => (
                <ThemedText style={styles.example} key={eIdx}>
                  • {exp}
                </ThemedText>
              ))}
            </ThemedView>
          )}
          {sense.sampleSentences.length > 0 && (
            <ThemedView style={styles.examplesBlock}>
              <ThemedText style={styles.examplesHeader}>
                Sample Sentences:
              </ThemedText>
              {sense.sampleSentences.map((sent, seIdx) => (
                <ThemedText style={styles.example} key={seIdx}>
                  • {sent}
                </ThemedText>
              ))}
            </ThemedView>
          )}
        </ThemedView>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  infoBlock: {
    marginBottom: 24,
    width: "100%",
  },
  partOfSpeech: {
    fontSize: 18,
    fontWeight: "600",
    color: "#70d0fcff",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  pronunciation: {
    fontSize: 15,
    color: "#cee5acff",
    marginBottom: 8,
  },
  senseBlock: {
    marginBottom: 14,
    marginLeft: 8,
  },
  definition: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  translation: {
    fontSize: 16,
    color: "#e092c2ff",
    marginBottom: 8,
  },
  examplesBlock: {
    marginTop: 8,
    marginLeft: 8,
  },
  examplesHeader: {
    fontSize: 15,
    fontWeight: "600",
  },
  example: {
    fontSize: 15,
    marginBottom: 4,
    marginTop: 4,
    marginLeft: 8,
  },
});
