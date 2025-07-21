import React, { useState } from 'react';
import { View, Button, Text, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';

export default function UploadTabScreen() {
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setMediaUri(asset.uri);
      setMediaType(asset.type as 'image' | 'video');
      Alert.alert('Media selected', asset.uri);
    }
  };

  const takeWithCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setMediaUri(asset.uri);
      setMediaType(asset.type as 'image' | 'video');
      Alert.alert('Media captured', asset.uri);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pick from Library" onPress={pickFromLibrary} />
      <Button title="Take Photo or Video" onPress={takeWithCamera} />
      {uploading && <ActivityIndicator />}
      {mediaUri && mediaType === 'image' && (
        <Image source={{ uri: mediaUri }} style={{ width: 200, height: 300, marginTop: 20 }} />
      )}
      {mediaUri && mediaType === 'video' && (
        <Video
          source={{ uri: mediaUri }}
          style={{ width: 200, height: 300, marginTop: 20 }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />
      )}
    </View>
  );
} 