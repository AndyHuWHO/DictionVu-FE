import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import debugBorder from '@/constants/debugBorder';
import { useLocalSearchParams } from "expo-router";

export default function MyCustomHeader() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ backgroundColor: '#fff', padding:0}}>
      <View style={[styles.header, debugBorder("white")]}> 
        <TouchableOpacity onPress={() => router.dismiss()} style={styles.icon}>
          {/* <Icon name="arrow-back" size={24} /> */}
          <Text style={styles.iconText}>{'<'}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="Search ..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.icon}>
          {/* <Icon name="search" size={24} /> */}
          <Text style={styles.iconText}>{'🔍'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    padding: 5,
  },
  iconText: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#222',
    marginHorizontal: 8,
    paddingVertical: 4,
    color: '#222',
  },
}); 