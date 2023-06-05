import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';

function MenuButton({ onPress }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.mainContainer}
    >
      <Feather
        name="menu"
        size={20}
        color={colors.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default MenuButton;
