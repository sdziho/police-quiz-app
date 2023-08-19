/* eslint-disable max-len */
import React from 'react';
import {View, StyleSheet, Linking, Platform} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

function UpdateModal() {
  const {colors} = useTheme();

  const onPress = async () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/ba/app/police-quiz/id1645107031');
    } else if (Platform.OS === 'android') {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.policequiz',
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <AntDesign name="warning" size={80} color={colors.primary} />
      <Text style={styles.text}>
        Da biste nastavili sa korištenjem, potrebno je da ažurirate aplikaciju{' '}
      </Text>
      <Button onPress={onPress} style={styles.button}>
        Ažuriraj aplikaciju
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default UpdateModal;
