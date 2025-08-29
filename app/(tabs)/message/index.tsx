// app/(tabs)/message/index.tsx
import { ThemedText } from '@/components/themed/ThemedText';
import { ThemedView } from '@/components/themed/ThemedView';
import { Text, View } from 'react-native';

export default function MessageTabScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>Messaging functionality is coming soon!</ThemedText>
    </ThemedView>
  );
}

