// app/(tabs)/diction/term/[term]/media.tsx
import { Text, View, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';

export default function MediaScreen() {
  const { term } = useLocalSearchParams();

  return (
    <View style={{ padding: 16 }}>
      <Text>Media for: {term}</Text>
    </View>
  );
}
