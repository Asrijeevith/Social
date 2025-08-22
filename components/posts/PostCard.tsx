import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const PostCard = ({ item }: any) => (
  <View style={styles.post}>
    <View style={styles.header}>
      <Image source={{ uri: item.profile_pic }} style={styles.avatar} />
      <Text style={styles.username}>{item.username}</Text>
    </View>

    {item.stories.length > 0 && (
      <Image source={{ uri: item.stories[0].media_url }} style={styles.image} />
    )}

    <View style={styles.actions}>
      <TouchableOpacity>
        <Icon name="heart-o" size={24} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="comment" size={24} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="share" size={24} style={styles.icon} />
      </TouchableOpacity>
    </View>

    <Text style={styles.likes}>0 likes</Text>
    <Text style={styles.caption}>
      <Text style={styles.username}>{item.username} </Text>
      {item.stories[0]?.media_type === 'image' ? 'Shared a new story!' : ''}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  post: { marginBottom: 15 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10 },
  username: { fontWeight: '600', fontSize: 14, color: '#fff' },
  image: { width: '100%', height: 375, resizeMode: 'cover' },
  actions: { flexDirection: 'row', padding: 10 },
  icon: { marginHorizontal: 10, color: '#fff' },
  likes: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
    paddingHorizontal: 15,
  },
  caption: { color: '#fff', paddingHorizontal: 15 },
});
