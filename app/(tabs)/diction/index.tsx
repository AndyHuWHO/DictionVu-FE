// app/(tabs)/diction/index.tsx
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { TextInput, Button, View, StyleSheet } from 'react-native';

export default function DictionTabScreen() {
  const [term, setTerm] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (!term.trim()) return;
    router.push(`/(word-result)/${encodeURIComponent(term.trim())}`);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter a word..."
        value={term}
        onChangeText={setTerm}
        style={styles.input}
        autoCapitalize="none"
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    fontSize: 18,
  },
});
