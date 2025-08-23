import React from 'react';
import { User } from '../types';
import StoryItem from './stories/StoryItem';
import { FlatList, StyleSheet } from 'react-native';
import { StartProgressBarFn } from './Header';

type StoriesListProps = {
  data: User[];
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUserStoryIndex: (index: number) => void;
  setIsStoryModalVisible: (visible: boolean) => void;
  progressBars: React.MutableRefObject<any[]>;
  startProgressBar: StartProgressBarFn;
  handleTap: (event: any) => void; // ✅ added
};

export default function StoriesList({
  data,
  setSelectedUser,
  setUserStoryIndex,
  setIsStoryModalVisible,
  progressBars,
  startProgressBar,
  handleTap, // ✅ accept here
}: StoriesListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item: any) => item.user_id.toString()}
      renderItem={({ item }) => (
        <StoryItem
          item={item}
          setSelectedUser={setSelectedUser}
          setUserStoryIndex={setUserStoryIndex}
          setIsStoryModalVisible={setIsStoryModalVisible}
          progressBars={progressBars}
          startProgressBar={startProgressBar}
          handleTap={handleTap} // ✅ forward it
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.storiesList}
    />
  );
}

const styles = StyleSheet.create({
  storiesList: {
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
});
