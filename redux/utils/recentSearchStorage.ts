import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "recentSearchWords";

export const saveRecentSearches = async (searches: { word: string; brief: string }[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  } catch (error) {
    console.error("Error saving recent searches", error);
  }
};

export const loadRecentSearches = async (): Promise<{ word: string; brief: string }[]> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Error loading recent searches", error);
    return [];
  }
};

export const clearRecentSearchesStorage = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing recent searches", error);
  }
};
