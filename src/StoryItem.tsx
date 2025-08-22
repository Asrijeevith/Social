import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface StoryItemProps {
  item: any;
  onPress: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.story} onPress={onPress}>
      <View style={[styles.storyContainer, { borderColor: item.all_seen ? '#888' : '#c33052ff' }]}>
        <Image source={{ uri: item.profile_pic }} style={styles.storyImage} />
      </View>
      <View>
        <Text style={styles.storyName} numberOfLines={1} ellipsizeMode="tail">
          {item.username}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  story: {
    alignItems: 'center',
    marginRight: -10,
    width: 100,
  },
  storyContainer: {
    borderRadius: 35,
    borderWidth: 2,
    padding: 2,
    backgroundColor: '#000',
  },
  storyImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: '#000',
  },
  storyName: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    width: '100%',
    paddingHorizontal: 0,
  },
});

export default StoryItem;