import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';

const { width } = Dimensions.get('screen');

function NoData() {
  return (
    <View
      style={styles.mainContainer}
    >
      <Text
        style={styles.text}
      >
        Nema podataka
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default React.memo(NoData);
