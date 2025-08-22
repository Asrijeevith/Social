import React, { useEffect, useState, useCallback, RefObject } from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Pressable,
  Dimensions,
  StyleSheet,
  ViewToken,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;
const storyDuration = 7000;

interface StoryModalProps {
  isVisible: boolean;
  selectedUser: any;
  setSelectedUser: (user: any) => void;
  userStoryIndex: number;
  setUserStoryIndex: (index: number) => void;
  setIsVisible: (visible: boolean) => void;
  data: any[];
  flatListRef: RefObject<FlatList>;
  progressBars: React.MutableRefObject<Animated.Value[]>;
  formatTimeAgo: (createdAt: string) => string;
}

const StoryModal: React.FC<StoryModalProps> = ({
  isVisible,
  selectedUser,
  setSelectedUser,
  userStoryIndex,
  setUserStoryIndex,
  setIsVisible,
  data,
  flatListRef,
  progressBars,
  formatTimeAgo,
}) => {
  const [isPaused, setIsPaused] = useState(false);

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
  }, [userStoryIndex, selectedUser, isPaused]);

  const pauseProgress = () => {
    setIsPaused(true);
    progressBars.current[userStoryIndex]?.stopAnimation();
  };

  const resumeProgress = () => {
    setIsPaused(false);
    startProgressBar();
  };

  useEffect(() => {
    if (isVisible && selectedUser) {
      startProgressBar();
    }
    return () => {
      progressBars.current.forEach((bar) => bar?.stopAnimation());
    };
  }, [isVisible, userStoryIndex, selectedUser, startProgressBar]);

  const handleTap = useCallback(
    (event: any) => {
      const x = event.nativeEvent.locationX;
      if (x < screenWidth / 2 && userStoryIndex > 0) {
        progressBars.current[userStoryIndex]?.setValue(0);
        setUserStoryIndex(userStoryIndex - 1);
        flatListRef.current?.scrollToIndex({ index: userStoryIndex - 1, animated: false });
      } else if (x > screenWidth / 2 && userStoryIndex < selectedUser.stories.length - 1) {
        progressBars.current[userStoryIndex]?.setValue(1);
        setUserStoryIndex(userStoryIndex + 1);
        flatListRef.current?.scrollToIndex({ index: userStoryIndex + 1, animated: false});
      } else if (x > screenWidth / 2 && userStoryIndex === selectedUser.stories.length - 1) {
        const currentUserIndex = data.findIndex((u: any) => u.user_id === selectedUser.user_id);
        const nextUser = data[currentUserIndex + 1];
        if (nextUser) {
          setSelectedUser(nextUser);
          setUserStoryIndex(0);
          // Update progressBars ref with new Animated.Values
          progressBars.current = Array(nextUser.stories.length).fill(null).map(() => new Animated.Value(0));
          flatListRef.current?.scrollToIndex({ index: 0, animated: true });
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    },
    [userStoryIndex, selectedUser, data, setUserStoryIndex, setIsVisible, flatListRef, setSelectedUser, progressBars]
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setUserStoryIndex(viewableItems[0].index || 0);
      }
    },
    [setUserStoryIndex]
  );

  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPressIn={pauseProgress} onPressOut={resumeProgress}>
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
                            width: progressBars.current[index]?.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                            }) || '0%',
                          },
                        ]}
                      />
                    </View>
                  ))}
                </View>
                <Image source={{ uri: selectedUser?.profile_pic }} style={styles.storyAvatars} />
                <View style={styles.storyTextContainer}>
                  <Text style={styles.storyUsernames}>{selectedUser?.username}</Text>
                  <Text style={styles.storyTime}>{formatTimeAgo(item.created_at)}</Text>
                </View>
                <Image source={{ uri: item.media_url }} style={styles.storyImageModal} />
                <Icon name="comment" size={24} style={styles.icon2} />
              </View>
            )}
          />
          <TouchableOpacity
            onPress={() => setIsVisible(false)}
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </Pressable>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    top: 20,
    left: 60,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  storyUsernames: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storyTime: {
    fontSize: 12,
    color: '#888',
    fontWeight: '400',
  },
});

export default StoryModal;