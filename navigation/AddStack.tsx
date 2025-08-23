import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddScreen from '../screens/AddScreen';

export type AddStackParamList = {
  Add: undefined;
};

const Stack = createNativeStackNavigator<AddStackParamList>();

export default function AddStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Add" component={AddScreen} />
    </Stack.Navigator>
  );
}
