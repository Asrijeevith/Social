import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Story {
  id: string;
  name: string;
  image: string;
}

interface Post {
  id: string;
  user: string;
  image: string;
  likes: number;
  caption: string;
}

// Health & professional themed dummy data

const stories: Story[] = [
  { id: '1', name: 'Dr. Meera', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '2', name: 'Fitness Coach Arjun', image: 'https://randomuser.me/api/portraits/men/46.jpg' },
  { id: '3', name: 'Dietician Priya', image: 'https://randomuser.me/api/portraits/women/50.jpg' },
  { id: '4', name: 'Yoga Trainer Ravi', image: 'https://randomuser.me/api/portraits/men/53.jpg' },
];

const posts: Post[] = [
  {
    id: '1',
    user: 'Nutrition Expert Kavya',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    likes: 230,
    caption: 'A healthy breakfast sets the tone for the day!',
  },
  {
    id: '2',
    user: 'Dr. Sanjay',
    image: 'https://images.pexels.com/photos/765957/pexels-photo-765957.jpeg',
    likes: 190,
    caption: 'Regular check-ups keep you ahead of health risks.',
  },
  {
    id: '3',
    user: 'Yoga Master Nisha',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
    likes: 310,
    caption: 'Breathe deeply, live fully.',
  },
];


export default function App() {
  const renderStory = ({ item }: { item: Story }) => (
    <TouchableOpacity style={styles.story}>
      <View style={styles.storyContainer}>
        <Image source={{ uri: item.image }} style={styles.storyImage} />
      </View>
      <Text style={styles.storyName} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.image }} style={styles.profilePic} />
        <Text style={styles.username}>{item.user}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.postImage} />
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
      <Text style={styles.likes}>{item.likes} likes</Text>
      <Text style={styles.caption}>
        <Text style={styles.username}>{item.user} </Text>
        {item.caption}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.logo}>Instagram</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Icon name="heart-o" size={24} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="share" size={24} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={renderStory}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesList}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsList}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  logo: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'System',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
    color: '#fff',
  },
  storiesList: {
    paddingVertical: 10,
    paddingHorizontal: 1,
  },
  story: {
    alignItems: 'center',
    marginRight: 0,
    width: 100,
  },
  storyContainer: {
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fcaf45',
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
    marginTop: 5,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    width: '100%',
    paddingHorizontal: 10,
  },
  postsList: {
    paddingBottom: 10,
    paddingHorizontal: 0,
  },
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