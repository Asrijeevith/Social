import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

export const handleLogout = async () => {
  const dispatch = useDispatch();

  await AsyncStorage.removeItem('token');
  dispatch(logout());
};
