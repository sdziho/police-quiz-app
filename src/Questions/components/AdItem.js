import React from 'react';
import {
  View, StyleSheet, Dimensions, Image, Linking,
} from 'react-native';
import { Text, Button } from 'react-native-paper';

const { width } = Dimensions.get('screen');

function AdItem({ item }) {
  const { imageQuestion, name, reddirectUrl } = item ?? {};

  // console.log('IMAGE', imageQuestion?.src);

  const onButtonPress = () => {
    if (!reddirectUrl) return;

    if (Linking.canOpenURL(reddirectUrl)) {
      Linking.openURL(reddirectUrl);
    }
  };

  return (
    <View
      style={styles.mainContainer}
    >
      <Text
        style={styles.title}
      >{name}
      </Text>
      <Image
        style={styles.image}
        resizeMode="cover"
        source={{ uri: imageQuestion?.src }}
      />
      <Button
        onPress={onButtonPress}
        mode="contained"
        style={styles.button}
      >
        Vidi više
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
  button: {
    marginTop: 20,
  },
});

export default AdItem;
