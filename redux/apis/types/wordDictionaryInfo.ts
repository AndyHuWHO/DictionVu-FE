export interface WordSense {
  definitionEn: string;
  translationZh: string;
  sampleExpressions: string[];
  sampleSentences: string[];
}

export interface DictionaryInfo {
  partOfSpeech: string;
  pronunciation: {
    uk: string;
    us: string;
  };
  wordSenseList: WordSense[];
}

export interface WordResponse {
  id: string;
  word: string;
  dictionaryInfoList: DictionaryInfo[];
}
