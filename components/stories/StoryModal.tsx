import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  FlatList,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
  ViewToken,
  NativeSyntheticEvent,
  NativeTouchEvent,
} from 'react-native';
import React, { useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { User, Story } from '../../types';

import { startProgressBar } from './utils';

const screenWidth = Dimensions.get('window').width;

type StoryModalProps = {
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  progressBars: React.MutableRefObject<Animated.Value[]>;
  userStoryIndex: number;
  isStoryModalVisible: boolean;
  handleTap: (event: NativeSyntheticEvent<NativeTouchEvent>) => void;
  flatListRef: React.RefObject<FlatList<Story>>;
  selectedUser: User | null;
  setIsStoryModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setUserStoryIndex: (index: number) => void;
  isPaused: boolean; // <-- add this
};

export default function StoryModal({
  setIsPaused,
  progressBars,
  userStoryIndex,
  isStoryModalVisible,
  handleTap,
  flatListRef,
  selectedUser,
  setIsStoryModalVisible,
  setUserStoryIndex,
}: StoryModalProps) {
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setUserStoryIndex(viewableItems[0].index || 0);
      }
    },
  ).current;

  const pauseProgress = () => {
    setIsPaused(true);
    progressBars.current[userStoryIndex]?.stopAnimation();
  };

  const resumeProgress = () => {
    setIsPaused(false);
    startProgressBar(
      selectedUser,
      progressBars,
      userStoryIndex,
      false, // not paused
      handleTap,
    );
  };

  return (
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
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.storyContent}>
                {/* Progress bars */}
                <View style={styles.progressBarContainer}>
                  {selectedUser?.stories.map((_, index: number) => (
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

                {/* Avatar + username */}
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

                {/* Story media */}
                <Image
                  source={{ uri: item.media_url }}
                  style={styles.storyImageModal}
                />

                <Icon name="comment" size={24} style={styles.icon2} />
              </View>
            )}
          />

          {/* Close button */}
          <TouchableOpacity
            onPress={() => setIsStoryModalVisible(false)}
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </Pressable>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

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
