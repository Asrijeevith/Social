import { Animated, Easing, Dimensions } from 'react-native';

const storyDuration = 7000;
const screenWidth = Dimensions.get('window').width;

export const startProgressBar = (
  selectedUser: any,
  progressBars: React.MutableRefObject<any[]>,
  userStoryIndex: number,
  isPaused: boolean,
  handleTap: (event: any) => void,
) => {
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
};

// ✅ Factory function to create handleTap with dependencies injected
export const createHandleTap = ({
  data,
  userStoryIndex,
  setUserStoryIndex,
  selectedUser,
  setSelectedUser,
  flatListRef,
  progressBars,
  isPaused,
  setIsStoryModalVisible,
}: any) => {
  return (event: any) => {
    if (!selectedUser) return;

    const x = event.nativeEvent.locationX;

    if (x < screenWidth / 2 && userStoryIndex > 0) {
      // Previous story
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
      // Next story
      progressBars.current[userStoryIndex]?.setValue(1);
      progressBars.current[userStoryIndex + 1]?.setValue(0);

      setUserStoryIndex(userStoryIndex + 1);
      flatListRef.current?.scrollToIndex({
        index: userStoryIndex + 1,
        animated: false,
      });
    } else if (
      x > screenWidth / 2 &&
      userStoryIndex === selectedUser.stories.length - 1
    ) {
      // Next user
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

        setTimeout(() => {
          startProgressBar(
            nextUser,
            progressBars,
            0,
            isPaused,
            createHandleTap({
              data,
              userStoryIndex: 0,
              setUserStoryIndex,
              selectedUser: nextUser,
              setSelectedUser,
              flatListRef,
              progressBars,
              isPaused,
              setIsStoryModalVisible,
            }),
          );
        }, 0);
      } else {
        // No more users → close modal
        setIsStoryModalVisible(false);
      }
    } else {
      setIsStoryModalVisible(false);
    }
  };
};
