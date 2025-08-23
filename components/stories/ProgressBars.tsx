import { Animated, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { User } from '../../types';

export default function ProgressBars({
  selectedUser,
  progressBars,
}: {
  selectedUser: User | null;
  progressBars: any;
}) {
  return (
    <>
      {/* Progress bars */}
      <View style={styles.progressBarContainer}>
        {selectedUser?.stories.map((_: any, index: number) => (
          <View
            key={index}
            style={[
              styles.progressBarSegment,
              { width: `${100 / selectedUser.stories.length}%` },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width:
                    progressBars.current[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }) || '0%',
                },
              ]}
            />
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    width: '100%',
    flexDirection: 'row',
  },
  progressBarSegment: {
    height: 3,
    backgroundColor: '#555',
    marginHorizontal: 1,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
});
