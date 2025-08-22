import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Text,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Login: undefined;
  Home: { token: string };
  Profile: { token: string };
  Search: { token: string };
};

type SearchScreenRouteProp = RouteProp<RootStackParamList, 'Search'>;

const SearchScreen: React.FC = () => {
  const route = useRoute<SearchScreenRouteProp>();
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { token } = route.params || {};

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);

    try {
      const authToken = token || (await AsyncStorage.getItem('token'));
      if (!authToken) {
        console.error('No token available');
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `http://192.168.0.111:8080/auth/${search}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setProfile(res.data.user);
      console.log(res.data);
    } catch (err) {
      console.log('Search error:', err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
  if (!profile) return;
  setLoading(true);

  try {
    const authToken = token || (await AsyncStorage.getItem('token'));
    if (!authToken) return;

    if (profile.isFollowing || profile.isRequested) {
      // Unfollow or cancel request
      await axios.delete(
        `http://192.168.0.111:8080/follow/${profile.id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    } else {
      // Follow (backend decides direct follow or request)
      await axios.post(
        `http://192.168.0.111:8080/follow/${profile.id}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    }

    // Fetch fresh profile data by username for live update
    const res = await axios.get(
      `http://192.168.0.111:8080/auth/${profile.username}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    setProfile(res.data.user); // Update profile state
  } catch (err) {
    console.log('Follow/Unfollow error:', err);
  } finally {
    setLoading(false);
  }
};


  const renderButton = () => {
    if (!profile) return null;

    let btnText = 'Follow';
    if (profile.isFollowing) btnText = 'Following';
    else if (profile.isRequested) btnText = 'Requested';

    return (
      <TouchableOpacity
        style={[styles.followBtn, { backgroundColor: '#555' }]} // Gray button
        onPress={handleFollowToggle}
      >
        <Text style={styles.btnText}>{btnText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Search by username"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={handleSearch}>
            <Icon name="search" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile View */}
      {loading && <Text style={{ color: '#fff', marginTop: 10 }}>Loading...</Text>}
      {profile && !loading && (
        <View style={styles.profileContainer}>
          <Image source={{ uri: profile.profile_pic }} style={styles.avatar} />
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.counts}>
            {profile.followersCount} Followers • {profile.followingCount} Following
          </Text>
          {renderButton()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    alignItems: 'center',
  },
  inputContainer: {
    width: '90%',
    marginVertical: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
    borderRadius: 25,
  },
  iconContainer: {
    padding: 10,
  },
  profileContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  counts: {
    color: '#aaa',
    marginBottom: 15,
  },
  followBtn: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SearchScreen;
