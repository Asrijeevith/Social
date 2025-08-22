import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Search Field 1 */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Follow </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.iconContainer}>
            <Icon name="search" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Field 2 */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Unfollow</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.iconContainer}>
            <Icon name="search" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Field 3 */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Acccept Request</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.iconContainer}>
            <Icon name="search" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Field 4 */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Decline Request</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.iconContainer}>
            <Icon name="search" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inputContainer: {
    width: '90%',
    marginVertical: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    color: '#fff',
    backgroundColor: '#1e1e1e',
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute',
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchScreen;