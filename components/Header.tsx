import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const Header = () => (
  <View style={styles.header}>
    <Text style={styles.logo}>Instagram</Text>
    <View style={styles.icons}>
      <TouchableOpacity>
        <Icon name="heart-o" size={24} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="share" size={24} style={styles.icon} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  logo: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  icons: { flexDirection: 'row' },
  icon: { marginHorizontal: 10, color: '#fff' },
});
