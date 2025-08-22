import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, FlatList, StyleSheet, StatusBar, Platform, Text, Button,Animated } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Header from '../src/Header';
import StoryItem from '../src/StoryItem';
import PostItem from '../src/PostItem';
import StoryModal from '../src/StoryModal';

type RootStackParamList = {
  Login: undefined;
  Home: { token: string };
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ route }) => {
  const navigation = useNavigation<any>();
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userStoryIndex, setUserStoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const progressBars = useRef<any[]>([]);

  // Get token from navigation params or AsyncStorage
  const { token } = route.params || {};
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = token || (await AsyncStorage.getItem('token'));
        if (!authToken) {
          console.error('No token available');
          setLoading(false);
          return;
        }
        const res = await axios.get('http://192.168.0.111:8080/stories/feed', {
          headers: {
            Authorization: `Bearer ${authToken}`,
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
  }, [token]);

  const formatTimeAgo = (createdAt: string): string => {
    const now = new Date();
    const storyDate = new Date(createdAt);
    const diffInMs = now.getTime() - storyDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}min${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}hr${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays}day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const handlelogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

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
        renderItem={({ item }) => (
          <PostItem item={item} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsList}
        ListHeaderComponent={() => (
          <Header
            data={data}
            onStoryPress={(item) => {
              setSelectedUser(item);
              setUserStoryIndex(0);
              setIsStoryModalVisible(true);
              progressBars.current = item.stories.map(() => new Animated.Value(0));
            }}
          />
        )}
      />
      <StoryModal
        isVisible={isStoryModalVisible}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser} // Added setSelectedUser prop
        userStoryIndex={userStoryIndex}
        setUserStoryIndex={setUserStoryIndex}
        setIsVisible={setIsStoryModalVisible}
        data={data}
        flatListRef={flatListRef}
        progressBars={progressBars}
        formatTimeAgo={formatTimeAgo}
      />
      <View style={styles.buttonWrapper}>
        <Button title="Logout" onPress={handlelogout} />
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