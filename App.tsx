// App.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const stories = [
  { id: '1', name: 'John', image: 'https://picsum.photos/100' },
  { id: '2', name: 'Emma', image: 'https://picsum.photos/101' },
  { id: '3', name: 'Alex', image: 'https://picsum.photos/102' },
];

const posts = [
  { id: '1', user: 'John', image: 'https://picsum.photos/400/300', likes: 120, caption: 'A nice day!' },
  { id: '2', user: 'Emma', image: 'https://picsum.photos/401/301', likes: 98, caption: 'Chilling :)' },
];

export default function App() {
  const renderStory = ({ item }) => (
    <View style={styles.story}>
      <Image source={{ uri: item.image }} style={styles.storyImage} />
      <Text style={styles.storyName}>{item.name}</Text>
    </View>
  );

  const renderPost = ({ item }) => (
    <View style={styles.post}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: item.image }} style={styles.profilePic} />
        <Text style={styles.username}>{item.user}</Text>
      </View>

      {/* Post Image */}
      <Image source={{ uri: item.image }} style={styles.postImage} />

      {/* Post Actions */}
      <View style={styles.postActions}>
        <Icon name="heart-o" size={24} style={styles.icon} />
        <Icon name="comment-o" size={24} style={styles.icon} />
        <Icon name="share" size={24} style={styles.icon} />
      </View>

      {/* Likes */}
      <Text style={styles.likes}>{item.likes} likes</Text>
      {/* Caption */}
      <Text style={styles.caption}>
        <Text style={styles.username}>{item.user} </Text>
        {item.caption}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Instagram</Text>
        <View style={styles.headerIcons}>
          <Icon name="plus-square-o" size={24} style={styles.icon} />
          <Icon name="heart-o" size={24} style={styles.icon} />
          <Icon name="paper-plane-o" size={24} style={styles.icon} />
        </View>
      </View>

      {/* Stories */}
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={renderStory}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.storiesList}
      />

      {/* Posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }} // padding for bottom bar
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 8,
    alignItems: 'center',
  },
  logo: { fontSize: 24, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  icon: { marginHorizontal: 8 },
  storiesList: { paddingVertical: 8, paddingLeft: 8 },
  story: { alignItems: 'center', marginRight: 15 },
  storyImage: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#ff8501' },
  storyName: { fontSize: 12, marginTop: 4 },
  post: { marginBottom: 20 },
  postHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 5 },
  profilePic: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  username: { fontWeight: 'bold' },
  postImage: { width: '100%', height: 300 },
  postActions: { flexDirection: 'row', padding: 8 },
  likes: { fontWeight: 'bold', paddingHorizontal: 10 },
  caption: { paddingHorizontal: 10, marginTop: 2 },
});
