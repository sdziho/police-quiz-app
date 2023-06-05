/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

function SuccessModal() {
  const { colors } = useTheme();

  return (
    <View style={styles.mainContainer}>
      <AntDesign
        name="checkcircle"
        size={80}
        color={colors.accent}
      />
      <Text style={styles.headline}>PREMIUM</Text>
      <Text style={styles.text}>Čestitamo! Upješno ste kupili PREMIUM Police Quiz paket. </Text>
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
  },
  text: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SuccessModal;
