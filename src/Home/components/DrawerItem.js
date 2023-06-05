/* eslint-disable func-names */
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme, Text } from 'react-native-paper';

const DrawerItem = function ({
  IconComponent,
  text,
  style,
  onPress,
  showBadge = false,
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.mainContainer, ...style }}
    >
      <View style={styles.iconContainer}>
        {IconComponent && <IconComponent />}
      </View>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: '10%',
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DrawerItem;
