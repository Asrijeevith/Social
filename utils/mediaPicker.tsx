import { launchCamera, launchImageLibrary, Asset, ImagePickerResponse } from 'react-native-image-picker';
import { Alert } from 'react-native';

export const openCamera = async (): Promise<Asset | null> => {
  try {
    const result: ImagePickerResponse = await launchCamera({ mediaType: 'photo', includeBase64: false });

    if (result.didCancel) return null;
    if (result.errorCode) {
      Alert.alert('Camera Error', result.errorMessage || 'Failed to capture image.');
      return null;
    }

    return result.assets?.[0] || null;
  } catch (error) {
    Alert.alert('Camera Error', 'An unexpected error occurred.');
    console.error('openCamera:', error);
    return null;
  }
};

export const openGallery = async (): Promise<Asset | null> => {
  try {
    const result: ImagePickerResponse = await launchImageLibrary({ mediaType:'photo', includeBase64: false });

    if (result.didCancel) return null;
    if (result.errorCode) {
      Alert.alert('Gallery Error', result.errorMessage || 'Failed to select image.');
      return null;
    }

    return result.assets?.[0] || null;
  } catch (error) {
    Alert.alert('Gallery Error', 'An unexpected error occurred.');
    console.error('openGallery:', error);
    return null;
  }
};
