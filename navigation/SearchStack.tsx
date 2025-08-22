import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen from '../screens/SearchScreen';

export type SearchStackParamList = {
  SearchMain: undefined;
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
    </Stack.Navigator>
  );
}
