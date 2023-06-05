import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

function UserButton() {
  const navigation = useNavigation();
  const navigateToWelcome = () => {
    navigation.navigate('Welcome');
  };
  return (
    <TouchableOpacity
      onPress={navigateToWelcome}
    >
      <Image
        style={styles.mainContainer}
        source={require('../assets/defaultUser.png')}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: 30,
    width: 30,
    borderRadius: 30,
    marginRight: 20,
  },
});

export default UserButton;
