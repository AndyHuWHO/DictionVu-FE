// app/(tabs)/diction/term/[term]/dictionary.tsx
import { Text, View, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';

export default function DictionaryScreen() {
  const { term } = useLocalSearchParams();

  return (
    <View style={{ padding: 16 }}>
      <Text>Dictionary info for: {term}</Text>
    </View>
  );
}
