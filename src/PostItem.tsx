import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface PostItemProps {
  item: any;
}

const PostItem: React.FC<PostItemProps> = ({ item }) => {
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.profile_pic }} style={styles.profilePic} />
        <Text style={styles.username}>{item.username}</Text>
      </View>
      {item.stories.length > 0 && (
        <Image source={{ uri: item.stories[0].media_url }} style={styles.postImage} />
      )}
      <View style={styles.postActions}>
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
        {item.stories[0]?.media_type === 'image' ? 'Shared a new Post!' : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    marginBottom: 15,
    backgroundColor: '#000',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  },
  postImage: {
    width: '100%',
    height: 375,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  icon: {
    marginHorizontal: 10,
    color: '#fff',
  },
  likes: {
    fontWeight: '600',
    fontSize: 14,
    paddingHorizontal: 15,
    paddingVertical: 5,
    color: '#fff',
  },
  caption: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    fontSize: 14,
    lineHeight: 20,
    color: '#fff',
  },
});

export default PostItem;