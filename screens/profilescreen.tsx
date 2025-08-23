import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar,
    Platform,
    Button,
    Switch,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);

    // Fetch profile data
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const authToken = await AsyncStorage.getItem('token');
                if (!authToken) {
                    console.error('No token available');
                    setLoading(false);
                    return;
                }

                const userRes = await axios.get('http://192.168.0.111:8080/auth/me', {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                setUserData(userRes.data);
                setIsPrivate(userRes.data.user?.isPrivate || false);
                console.log('User Data:', userRes.data);
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    // Logout
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
    };

    // Toggle Private Account
    const handleTogglePrivate = async () => {
        try {
            const authToken = await AsyncStorage.getItem('token');
            if (!authToken) return;

            // Call toggle private API
            await axios.patch(
                'http://192.168.0.111:8080/auth/toggle',
                {},
                { headers: { Authorization: `Bearer ${authToken}` } },
            );

            // Fetch updated profile data after toggling
            const userRes = await axios.get('http://192.168.0.111:8080/auth/me', {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            setUserData(userRes.data);
            setIsPrivate(userRes.data.user?.isPrivate || false);
            console.log('Updated User Data:', userRes.data);
        } catch (err) {
            console.error('Error toggling private setting:', err);
        }
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
            <View style={styles.header}>
                <Text style={styles.username}>{userData?.user.username}</Text>
            </View>

            <View style={styles.profileContainer}>
                <View style={styles.profileRow}>
                    <View style={styles.profileLeft}>
                        <Image
                            source={{ uri: userData?.user.profile_pic }}
                            style={styles.profilePic}
                        />
                        <Text style={styles.profileUsername}>
                            {userData?.user.username}
                        </Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>
                                {userData?.user.followersCount || 0}
                            </Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>
                                {userData?.user.followingCount || 0}
                            </Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </View>
                    </View>
                </View>

                {/* Private Account Toggle */}
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleLabel}>
                        {userData?.user?.type !== 'private'
                            ? 'Private Account'
                            : 'Private Account'}
                    </Text>
                    <Switch
                        value={userData?.user?.type === 'private'}
                        onValueChange={handleTogglePrivate}
                        thumbColor={
                            userData?.user?.type === 'private' ? '#0095f6' : '#f4f3f4'
                        }
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                    />
                </View>
            </View>

            <View style={styles.buttonWrapper}>
                <Button title="Logout" onPress={handleLogout} color="#0095f6" />
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileContainer: {
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileLeft: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    profilePic: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: '#fff',
    },
    profileUsername: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginTop: 10,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 50,
        paddingRight: 50,
    },
    stat: {
        alignItems: 'center',
    },
    statNumber: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    statLabel: {
        color: '#888',
        fontSize: 14,
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    buttonWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 15,
        paddingBottom: 10,
        borderRadius: 25,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 10,
    },
    toggleLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ProfileScreen;