// app/(tabs)/vu/feed.tsx
import { ThemedText } from '@/components/themed/ThemedText';
import { ThemedView } from '@/components/themed/ThemedView';
import { Text, View } from 'react-native';

export default function LikedTopTabScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>🎥 Liked Top Tab</ThemedText>
    </ThemedView>
  );
}
