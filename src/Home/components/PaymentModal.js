/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import { PAYMENT_API_URL } from '../../utils/constants';

function PaymentModal({ hide, orderNumber, price }) {
  const { colors } = useTheme();
  console.log({ orderNumber });
  const onBuyPress = async () => {
    try {
      const { data } = await axios.post(`${PAYMENT_API_URL}/payment`, {
        orderNumber,
      }).catch((err) => {
        console.log('err', err);
      });
      if (data) {
        Linking.openURL(data.payment_url);
      }
      hide();
    } catch (error) {
      console.log('catch err', error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <AntDesign
        name="warning"
        size={80}
        color={colors.primary}
      />
      <Text style={styles.headline}>{`PREMIUM paket \nza samo ${price} KM`}</Text>
      <Text style={styles.text}>Korištenjem besplatnog paketa Police Quiz aplikacije imate pristup svega 10% ukupnog broja pitanja. Aktivacijom PREMIUM paketa dobivate potpuni pristup svim pitanjima kako bi vaš uspjeh na testu bio zagarantovan! </Text>
      <Button onPress={onBuyPress} style={styles.button}>
        Aktiviraj PREMIUM paket
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

export default PaymentModal;
