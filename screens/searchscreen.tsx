import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor="#888"
      />
      <Icon
        name="user-plus"
        size={20}
        color="#888"
        style={{ position: 'absolute', right: 20, top: 210 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',

    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,

    right: 25,
    marginTop: 200,
    color: '#fff',
    width: '80%',
  },
});

export default SearchScreen;
