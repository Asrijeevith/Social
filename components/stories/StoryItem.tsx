import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export const StoryItem = ({ item, onPress }: any) => (
  <TouchableOpacity style={styles.story} onPress={() => onPress(item)}>
    <View style={[styles.container, { borderColor: item.all_seen ? '#888' : '#c33052ff' }]}>
      <Image source={{ uri: item.profile_pic }} style={styles.image} />
    </View>
    <Text style={styles.name} numberOfLines={1}>{item.username}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  story: { alignItems: 'center', width: 100 },
  container: { borderRadius: 35, borderWidth: 2, padding: 2 },
  image: { width: 62, height: 62, borderRadius: 31 },
  name: { fontSize: 11, color: '#fff', textAlign: 'center', marginTop: 5 },
});
