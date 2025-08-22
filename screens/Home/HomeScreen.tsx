// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   StatusBar,
//   Platform,
//   Dimensions,
//   Animated,
//   Easing,
//   Button,
// } from 'react-native';
// import PostItem from '../../components/posts/PostItem';
// import { useStoriesFeed } from '../../hooks/useStoriesFeed';
// import { handleLogout } from '../../utils/auth';

// import Header from '../../components/Header';

// import { User, Story } from '../../types';
// import StoryModal from '../../components/stories/StoryModal';
// import { startProgressBar } from '../../components/stories/utils';

// const screenWidth = Dimensions.get('window').width;

// const HomeScreen = () => {
//   const { data, loading } = useStoriesFeed();

//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [userStoryIndex, setUserStoryIndex] = useState(0);
//   const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
//   const flatListRef = useRef<FlatList<Story>>(null);
//   const progressBars = useRef<any[]>([]);

//   const [isPaused, setIsPaused] = useState(false);

//   useEffect(() => {
//     if (isStoryModalVisible && selectedUser) {
//       startProgressBar(
//         selectedUser,
//         progressBars,
//         userStoryIndex,
//         isPaused,
//         handleTap,
//       );
//     }
//     return () => {
//       progressBars.current.forEach((bar: any) => bar?.stopAnimation());
//     };
//   }, [isStoryModalVisible, userStoryIndex, selectedUser, startProgressBar]);

//   // const handleTap = useCallback(
//   //   (event: any) => {
//   //     const x = event.nativeEvent.locationX;

//   //     if (x < screenWidth / 2 && userStoryIndex > 0) {
//   //       // Go to previous story
//   //       progressBars.current[userStoryIndex]?.setValue(0);
//   //       setUserStoryIndex(userStoryIndex - 1);
//   //       flatListRef.current?.scrollToIndex({
//   //         index: userStoryIndex - 1,
//   //         animated: false,
//   //       });
//   //     } else if (
//   //       x > screenWidth / 2 &&
//   //       userStoryIndex < selectedUser.stories.length - 1
//   //     ) {
//   //       // Go to next story
//   //       // Fill the current bar
//   //       progressBars.current[userStoryIndex]?.setValue(1);
//   //       // Reset next bar before animating
//   //       progressBars.current[userStoryIndex + 1]?.setValue(0);

//   //       setUserStoryIndex(userStoryIndex + 1);
//   //       flatListRef.current?.scrollToIndex({
//   //         index: userStoryIndex + 1,
//   //         animated: false,
//   //       });
//   //     } else if (
//   //       x > screenWidth / 2 &&
//   //       userStoryIndex === selectedUser.stories.length - 1
//   //     ) {
//   //       // Move to next user
//   //       // 👉 Last story of this user → move to next user
//   //       const currentUserIndex = data.findIndex(
//   //         (u: any) => u.user_id === selectedUser.user_id,
//   //       );
//   //       const nextUser = data[currentUserIndex + 1];

//   //       if (nextUser) {
//   //         setSelectedUser(nextUser);
//   //         setUserStoryIndex(0);

//   //         // Reset all bars for the new user
//   //         progressBars.current = nextUser.stories.map(
//   //           () => new Animated.Value(0),
//   //         );

//   //         flatListRef.current?.scrollToIndex({ index: 0, animated: false });

//   //         // Start first bar fresh
//   //         setTimeout(() => {
//   //           startProgressBar(nextUser, progressBars, 0, isPaused, handleTap);
//   //         }, 0);
//   //       } else {
//   //         // No more users → close modal
//   //         setIsStoryModalVisible(false);
//   //       }
//   //     } else {
//   //       setIsStoryModalVisible(false);
//   //     }
//   //   },
//   //   [userStoryIndex, selectedUser, data],
//   // );

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#000" barStyle="light-content" />
//       <FlatList
//         data={data}
//         keyExtractor={(item: any) => item.user_id.toString()}
//         renderItem={({ item }) => <PostItem item={item} />}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.postsList}
//         ListHeaderComponent={
//           <Header
//             data={data}
//             setSelectedUser={setSelectedUser}
//             setUserStoryIndex={setUserStoryIndex}
//             setIsStoryModalVisible={setIsStoryModalVisible}
//             progressBars={progressBars}
//             startProgressBar={startProgressBar}
//           />
//         }
//       />
//       {/* Story modale to show multile stories */}
//       <StoryModal
//         setIsPaused={setIsPaused}
//         progressBars={progressBars}
//         userStoryIndex={userStoryIndex}
//         isStoryModalVisible={isStoryModalVisible}
//         handleTap={handleTap}
//         flatListRef={flatListRef}
//         selectedUser={selectedUser}
//         setIsStoryModalVisible={setIsStoryModalVisible}
//         setUserStoryIndex={setUserStoryIndex}
//         isPaused={isPaused}
//       />

//       <View style={styles.buttonWrapper}>
//         <Button title="Logout" onPress={handleLogout} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
//     paddingBottom: 20,
//   },
//   postsList: {
//     paddingBottom: 10,
//     paddingHorizontal: 0,
//   },
//   loadingText: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   buttonWrapper: {
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
// });

// export default HomeScreen;

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Platform,
  Dimensions,
  Button,
} from 'react-native';
import PostItem from '../../components/posts/PostItem';
import { useStoriesFeed } from '../../hooks/useStoriesFeed';
import { handleLogout } from '../../utils/auth';

import Header from '../../components/Header';

import { User, Story } from '../../types';
import StoryModal from '../../components/stories/StoryModal';
import {
  startProgressBar,
  createHandleTap,
} from '../../components/stories/utils';

const HomeScreen = () => {
  const { data, loading } = useStoriesFeed();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userStoryIndex, setUserStoryIndex] = useState(0);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const flatListRef = useRef<FlatList<Story>>(null);
  const progressBars = useRef<any[]>([]);

  const [isPaused, setIsPaused] = useState(false);

  // ✅ Create handleTap from utils (dependency injection)
  const handleTap = createHandleTap({
    data,
    userStoryIndex,
    setUserStoryIndex,
    selectedUser,
    setSelectedUser,
    flatListRef,
    progressBars,
    isPaused,
    setIsStoryModalVisible,
  });

  useEffect(() => {
    if (isStoryModalVisible && selectedUser) {
      startProgressBar(
        selectedUser,
        progressBars,
        userStoryIndex,
        isPaused,
        handleTap,
      );
    }
    return () => {
      progressBars.current.forEach((bar: any) => bar?.stopAnimation());
    };
  }, [isStoryModalVisible, userStoryIndex, selectedUser, isPaused]);

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
        ListHeaderComponent={
          <Header
            data={data}
            setSelectedUser={setSelectedUser}
            setUserStoryIndex={setUserStoryIndex}
            setIsStoryModalVisible={setIsStoryModalVisible}
            progressBars={progressBars}
            startProgressBar={startProgressBar}
          />
        }
      />
      {/* Story Modal */}
      <StoryModal
        setIsPaused={setIsPaused}
        progressBars={progressBars}
        userStoryIndex={userStoryIndex}
        isStoryModalVisible={isStoryModalVisible}
        handleTap={handleTap}
        flatListRef={flatListRef}
        selectedUser={selectedUser}
        setIsStoryModalVisible={setIsStoryModalVisible}
        setUserStoryIndex={setUserStoryIndex}
        isPaused={isPaused}
      />

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
  buttonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default HomeScreen;
