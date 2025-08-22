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
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostItem from '../../src/PostItem';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { useStoriesFeed } from '../../hooks/useStoriesFeed';
import { logout } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const screenWidth = Dimensions.get('window').width;
const storyDuration = 7000;

// A single story item
type Story = {
  id: number;
  media_url: string;
  media_type: 'image' | 'video'; // restrict since only 2 types exist
  created_at: string;
  seen: boolean;
};

// A user with stories
type User = {
  user_id: number; // you showed "1", so it's a number (not string)
  username: string;
  profile_pic: string;
  all_seen: boolean;
  stories: Story[];
};

const HomeScreen = () => {
  const dispatch = useDispatch();

  const { data, loading, error } = useStoriesFeed();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userStoryIndex, setUserStoryIndex] = useState(0);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const progressBars = useRef<any[]>([]);

  const startProgressBar = useCallback(() => {
    if (selectedUser && progressBars.current[userStoryIndex]) {
      progressBars.current[userStoryIndex].setValue(0);
      Animated.timing(progressBars.current[userStoryIndex], {
        toValue: 1,
        duration: storyDuration,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && !isPaused) {
          handleTap({ nativeEvent: { locationX: screenWidth + 1 } });
        }
      });
    }
  }, [userStoryIndex, selectedUser]);

  const [isPaused, setIsPaused] = useState(false);

  const pauseProgress = () => {
    setIsPaused(true);
    progressBars.current[userStoryIndex]?.stopAnimation();
  };

  const resumeProgress = () => {
    setIsPaused(false);
    startProgressBar();
  };

  useEffect(() => {
    if (isStoryModalVisible && selectedUser) {
      startProgressBar();
    }
    return () => {
      progressBars.current.forEach((bar: any) => bar?.stopAnimation());
    };
  }, [isStoryModalVisible, userStoryIndex, selectedUser, startProgressBar]);

  const handleTap = useCallback(
    (event: any) => {
      const x = event.nativeEvent.locationX;
      if (x < screenWidth / 2 && userStoryIndex > 0) {
        // Go to previous story
        progressBars.current[userStoryIndex]?.setValue(0);
        setUserStoryIndex(userStoryIndex - 1);
        flatListRef.current?.scrollToIndex({
          index: userStoryIndex - 1,
          animated: false,
        });
      } else if (
        x > screenWidth / 2 &&
        userStoryIndex < selectedUser.stories.length - 1
      ) {
        // Go to next story
        progressBars.current[userStoryIndex]?.setValue(1); // Reset next story's progress bar
        setUserStoryIndex(userStoryIndex + 1);
        flatListRef.current?.scrollToIndex({
          index: userStoryIndex + 1,
          animated: false,
        });
      } else if (
        x > screenWidth / 2 &&
        userStoryIndex === selectedUser.stories.length - 1
      ) {
        // Move to next user
        const currentUserIndex = data.findIndex(
          (u: any) => u.user_id === selectedUser.user_id,
        );
        const nextUser = data[currentUserIndex + 1];
        if (nextUser) {
          setSelectedUser(nextUser);
          setUserStoryIndex(0);
          progressBars.current = nextUser.stories.map(
            () => new Animated.Value(0),
          );
          flatListRef.current?.scrollToIndex({ index: 0, animated: false });
        } else {
          setIsStoryModalVisible(false);
        }
      } else {
        setIsStoryModalVisible(false);
      }
    },
    [userStoryIndex, selectedUser, data],
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch(logout());
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setVisibleStoryId(viewableItems[0].item.id);
        setUserStoryIndex(viewableItems[0].index || 0);
      }
    },
  ).current;

  const renderStory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.story}
      onPress={() => {
        setSelectedUser(item);
        setUserStoryIndex(0);
        setIsStoryModalVisible(true);
        progressBars.current = item.stories.map(() => new Animated.Value(0));
      }}
    >
      <View
        style={[
          styles.storyContainer,
          { borderColor: item.all_seen ? '#888' : '#c33052ff' },
        ]}
      >
        <Image source={{ uri: item.profile_pic }} style={styles.storyImage} />
      </View>
      <View>
        <Text style={styles.storyName} numberOfLines={1} ellipsizeMode="tail">
          {item.username}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: any }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.profile_pic }} style={styles.profilePic} />
        <Text style={styles.username}>{item.username}</Text>
      </View>
      {item.stories.length > 0 && (
        <Image
          source={{ uri: item.stories[0].media_url }}
          style={styles.postImage}
        />
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
        renderItem={({ item }) => <PostItem item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsList}
        ListHeaderComponent={renderHeader}
      />
      <Modal visible={isStoryModalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback
          onPressIn={pauseProgress}
          onPressOut={resumeProgress}
        >
          <Pressable style={styles.modalContainer} onPress={handleTap}>
            <FlatList
              ref={flatListRef}
              data={selectedUser?.stories || []}
              horizontal
              pagingEnabled
              initialScrollIndex={userStoryIndex}
              getItemLayout={(_, index) => ({
                length: screenWidth,
                offset: screenWidth * index,
                index,
              })}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
              keyExtractor={(item: any) => item.id.toString()}
              renderItem={({ item }: { item: any }) => (
                <View style={styles.storyContent}>
                  <View style={styles.progressBarContainer}>
                    {selectedUser?.stories.map((_: any, index: number) => (
                      <View
                        key={index}
                        style={[
                          styles.progressBarSegment,
                          { width: `${100 / selectedUser.stories.length}%` },
                        ]}
                      >
                        <Animated.View
                          style={[
                            styles.progressBar,
                            {
                              width:
                                progressBars.current[index]?.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ['0%', '100%'],
                                }) || '0%',
                            },
                          ]}
                        />
                      </View>
                    ))}
                  </View>
                  <Image
                    source={{ uri: selectedUser?.profile_pic }}
                    style={styles.storyAvatars}
                  />
                  <View style={styles.storyTextContainer}>
                    <Text style={styles.storyUsernames}>
                      {selectedUser?.username}
                    </Text>
                    <Text style={styles.storyTime}>
                      {formatTimeAgo(item.created_at)}
                    </Text>
                  </View>
                  <Image
                    source={{ uri: item.media_url }}
                    style={styles.storyImageModal}
                  />
                  <Icon name="comment" size={24} style={styles.icon2} />
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
      <View style={styles.buttonWrapper}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};

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
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    width: '100%',
    paddingHorizontal: 0,
  },
  postsList: {
    paddingBottom: 10,
    paddingHorizontal: 0,
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
    flexDirection: 'row',
  },
  progressBarSegment: {
    height: 3,
    backgroundColor: '#555',
    marginHorizontal: 1,
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

  storyImageModal: {
    width: '100%',
    height: 375,
    resizeMode: 'contain',
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

  storyTextContainer: {
    position: 'absolute',
    top: 20, // Align with storyAvatars
    left: 60, // Position to the right of storyAvatars (40 width + 10 left + 10 margin)
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  storyUsernames: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storyTime: {
    fontSize: 12, // Slightly larger for better readability
    color: '#888',
    fontWeight: '400',
  },
  buttonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default HomeScreen;
