// app/(tabs)/profile/index.tsx
import { ThemedText } from '@/components/themed/ThemedText';
import { ThemedView } from '@/components/themed/ThemedView';
import { Text, View } from 'react-native';

export default function ProfileTabScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>👤 Profile Tab</ThemedText>
    </ThemedView>
  );
}

