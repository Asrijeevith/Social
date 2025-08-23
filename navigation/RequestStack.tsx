import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RequestScreen from '../screens/RequestScreen';

export type RequestStackParamList = {
  Request: undefined;
};

const Stack = createNativeStackNavigator<RequestStackParamList>();

export default function RequestStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Request" component={RequestScreen} />
    </Stack.Navigator>
  );
}
