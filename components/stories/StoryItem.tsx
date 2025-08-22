import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import React from 'react';
import { User } from '../../types';
import { StartProgressBarFn } from '../Header';

type StoryItemProps = {
  item: User;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUserStoryIndex: (index: number) => void;
  setIsStoryModalVisible: (visible: boolean) => void;
  progressBars: React.MutableRefObject<any[]>;
  startProgressBar: StartProgressBarFn;
  handleTap: (event: any) => void; // ✅ added here
};

export default function StoryItem({
  item,
  setSelectedUser,
  setUserStoryIndex,
  setIsStoryModalVisible,
  progressBars,
  startProgressBar,
  handleTap, // ✅ accept it
}: StoryItemProps) {
  return (
    <TouchableOpacity
      style={styles.story}
      onPress={() => {
        setSelectedUser(item);
        setUserStoryIndex(0);
        setIsStoryModalVisible(true);

        // Reset progress bars for this user
        progressBars.current = item.stories.map(() => new Animated.Value(0));

        // Start the first bar
        setTimeout(() => {
          startProgressBar(
            item, // selectedUser
            progressBars, // progressBars ref
            0, // userStoryIndex
            false, // isPaused
            handleTap, // ✅ now passes actual tap handler
          );
        }, 0);
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
}

const styles = StyleSheet.create({
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
});
