import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Asset } from 'react-native-image-picker';
import { openCamera, openGallery } from '../utils/mediaPicker';

const AddScreen = () => {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<Asset | null>(null);

  const handleCamera = async () => {
    const picked = await openCamera();
    if (picked) setMedia(picked);
  };

  const handleGallery = async () => {
    const picked = await openGallery();
    if (picked) setMedia(picked);
  };

  const handlePost = async () => {
    if (!media?.uri) {
      Alert.alert('No Media', 'Please select an image from gallery or camera.');
      return;
    }

    try {
      console.log('Posting image:', { uri: media.uri, type: media.type, caption });
      setCaption('');
      setMedia(null);
      Alert.alert('Posted!', 'Your post has been added.');
    } catch (error) {
      console.error('handlePost: Failed to save post:', error);
      Alert.alert('Error', 'Failed to post image.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Icon name="upload" size={50} color="#abababff" style={styles.icon} />
      <Text style={styles.title}>Create New Post</Text>
      <Text style={styles.description}>
        Upload photos from your gallery or capture using camera.
      </Text>

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.button} onPress={handleGallery}>
        <Text style={styles.buttonText}>Choose from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleCamera}
      >
        <Text style={styles.secondaryButtonText}>Open Camera</Text>
      </TouchableOpacity>

      {media?.uri && (
        <Image source={{ uri: media.uri }} style={styles.previewImage} />
      )}

      <View style={styles.captionContainer}>
        <Text style={styles.captionLabel}>Add a Caption</Text>
        <TextInput
          style={styles.captionInput}
          multiline
          value={caption}
          onChangeText={setCaption}
        />
      </View>

      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    padding: 30,
    paddingTop: 120,
  },
  icon: { marginBottom: 10 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: '#abababff',
  },
  description: {
    fontSize: 14,
    color: '#abababff',
    textAlign: 'center',
    marginBottom: 0,
  },
  button: {
    backgroundColor: '#abababff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#000', fontWeight: '600', fontSize: 16 },
  secondaryButton: { backgroundColor: '#abababff' },
  secondaryButtonText: { color: '#000', fontWeight: '600', fontSize: 16 },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginVertical: 20,
  },
  captionContainer: { width: '100%' },
  captionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#abababff',
    marginBottom: 8,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#abababff',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#abababff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  postButton: {
    marginTop: 25,
    backgroundColor: '#abababff',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  postButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },
  spacer: { height: 80 },
});

export default AddScreen;
