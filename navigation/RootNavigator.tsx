// src/navigation/MainNavigator.tsx
import React from 'react';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeStack from './HomeStack.tsx';
import SearchStack from './SearchStack.tsx';
import ProfileStack from './ProfileStack.tsx';
import AddStack from './AddStack.tsx';
import RequestStack from './RequestStack.tsx';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#000' : '#fff',
          },
          tabBarActiveTintColor: isDarkMode ? 'white' : 'black',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="search" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="plus" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Request"
          component={RequestStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="heart" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="user" color={color} size={size} />
            ),
          }}
        />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
