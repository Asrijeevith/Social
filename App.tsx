// App.tsx
import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { StyleSheet, useColorScheme } from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { restoreToken } from './redux/slices/authSlice';
import { store } from './redux/store';


export default function App() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  function AuthInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
      const loadToken = async () => {
        const token = await AsyncStorage.getItem('token');
        dispatch(restoreToken(token));
      };
      loadToken();
    }, [dispatch]);

    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: isDarkMode ? '#000' : '#fff' },
          ]}
        >
          <AuthInitializer />
          <RootNavigator />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
