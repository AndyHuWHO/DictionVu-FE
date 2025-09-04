// app/(tabs)/message/index.tsx
import { ThemedText } from '@/components/themed/ThemedText';
import { ThemedView } from '@/components/themed/ThemedView';

export default function MessageTabScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText style={{ fontSize: 17 }}>Messaging functionality is coming soon!</ThemedText>
    </ThemedView>
  );
}

