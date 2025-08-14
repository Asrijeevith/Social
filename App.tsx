import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Pressable,
  ViewToken,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;
const storyDuration = 7000; 

export default function App() {
  const [data, setData] = useState([]);
  const [flattenedStories, setFlattenedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [visibleStoryId, setVisibleStoryId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://192.168.0.111:8080/stories/feed', {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTU0MjUzODIsImlhdCI6MTc1NTE2NjE4MiwidXNlcl9pZCI6NX0.HJeClZMeZ-CWgD_Ms_IEScIYPtt3x4OEZbWkwk_QjXQ',
          },
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const flat = data.flatMap(user => user.stories.map(story => ({ user, story })));
      setFlattenedStories(flat);
    }
  }, [data]);

  const startProgressBar = useCallback(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: storyDuration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !isPaused) {
        handleTap({ nativeEvent: { locationX: screenWidth + 1 } });
      }
    });
  }, [progress, isPaused]);

  const pauseProgress = () => {
    setIsPaused(true);
    progress.stopAnimation();
  };

  const resumeProgress = () => {
    setIsPaused(false);
    startProgressBar();
  };

  useEffect(() => {
    if (isStoryModalVisible) {
      startProgressBar();
    }
    return () => {
      progress.stopAnimation();
    };
  }, [isStoryModalVisible, storyIndex, startProgressBar]);

  const handleTap = useCallback(
    (event: any) => {
      const x = event.nativeEvent.locationX;
      if (x < screenWidth / 2 && storyIndex > 0) {
        const newIndex = storyIndex - 1;
        setStoryIndex(newIndex);
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      } else if (x > screenWidth / 2 && storyIndex < flattenedStories.length - 1) {
        const newIndex = storyIndex + 1;
        setStoryIndex(newIndex);
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      } else {
        setIsStoryModalVisible(false);
      }
    },
    [storyIndex, flattenedStories]
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setVisibleStoryId(viewableItems[0].item.story.id);
    }
  }).current;

  const onStoryItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      setVisibleStoryId(visibleItem.item.story.id);

      const newIndex = flattenedStories.findIndex((post: any) => post.story.id === visibleItem.item.story.id);
      if (newIndex !== -1) {
        setStoryIndex(newIndex);
      }
    }
  }).current;

  const renderStory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.story}
      onPress={() => {
        const startIndex = flattenedStories.findIndex((s: any) => s.user.user_id === item.user_id);
        if (startIndex !== -1) {
          setStoryIndex(startIndex);
          setIsStoryModalVisible(true);
        }
      }}
    >
      <View style={[styles.storyContainer, { borderColor: item.all_seen ? '#888' : '#c33052ff' }]}>
        <Image source={{ uri: item.profile_pic }} style={styles.storyImage} />
      </View>
      <Text style={styles.storyName} numberOfLines={1} ellipsizeMode="tail">
        {item.username}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: any }) => (
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
        {item.stories[0]?.media_type === 'image' ? 'Shared a new story!' : ''}
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
        data={data}
        keyExtractor={(item: any) => item.user_id}
        renderItem={renderStory}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesList}
      />
    </>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <FlatList
        data={data}
        keyExtractor={(item: any) => item.user_id.toString()}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsList}
        ListHeaderComponent={renderHeader}
      />
      <Modal visible={isStoryModalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPressIn={pauseProgress} onPressOut={resumeProgress}>
          <Pressable style={styles.modalContainer} onPress={handleTap}>
            <FlatList
              ref={flatListRef}
              data={flattenedStories}
              horizontal
              pagingEnabled
              initialScrollIndex={storyIndex}
              getItemLayout={(_, index) => ({
                length: screenWidth,
                offset: screenWidth * index,
                index,
              })}
              onViewableItemsChanged={onStoryItemsChanged}
              viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
              keyExtractor={(item: any) => item.story.id.toString()}
              renderItem={({ item }: { item: any }) => (
                <View style={styles.storyContent}>
                  <View style={styles.progressBarContainer}>
                    <Animated.View
                      style={[
                        styles.progressBar,
                        {
                          width: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]}
                    />
                  </View>
                  <Image source={{ uri: item.user.profile_pic }} style={styles.storyAvatars} />
                  <Text style={styles.storyUsernames}>{item.user.username}</Text>
                  <Image source={{ uri: item.story.media_url }} style={styles.storyImageModal} />
                  <Icon2 name="message1" size={24} style={styles.icon2} />
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() => setIsStoryModalVisible(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </Pressable>
        </TouchableWithoutFeedback>
      </Modal>
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
    paddingHorizontal: 0,
  },
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
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyContent: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    width: '100%',
    backgroundColor: '#555',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  storyAvatars: {
    position: 'absolute',
    top: 20,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyUsernames: {
    position: 'absolute',
    top: 30,
    left: 60,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storyImageModal: {
    width: '100%',
    height: 375,
    resizeMode: 'cover',
  },
  icon2: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    color: '#fff',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 28,
  },
});