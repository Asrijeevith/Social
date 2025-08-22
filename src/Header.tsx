import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import StoryItem from './StoryItem';

interface HeaderProps {
  data: any[];
  onStoryPress: (item: any) => void;
}

const Header: React.FC<HeaderProps> = ({ data, onStoryPress }) => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.logo}>Instagram</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Icon name="heart-o" size={24} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="share" size={24} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item: any) => item.user_id}
        renderItem={({ item }) => (
          <StoryItem item={item} onPress={() => onStoryPress(item)} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesList}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  logo: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'System',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
    color: '#fff',
  },
  storiesList: {
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
});

export default Header;