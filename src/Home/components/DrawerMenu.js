/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {View, StyleSheet, Linking, Image, Platform} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import DrawerItem from './DrawerItem';

function DrawerMenu({navigation}) {
  const {colors} = useTheme();
  const {paymentSettings} = useSelector(state => state.settings.data) ?? {};

  const openEmail = () => {
    Linking.openURL(
      'mailto:policequizbih@gmail.com?subject=Police Quiz - Upit korisnika',
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <DrawerItem
          onPress={() => navigation.navigate('About')}
          text="O nama"
          IconComponent={() => (
            <AntDesign name="infocirlceo" size={20} color={colors.text} />
          )}
        />
        <DrawerItem
          onPress={() => navigation.navigate('Payment')}
          text="Postani premium član"
          IconComponent={() => (
            <AntDesign name="staro" size={20} color={colors.text} />
          )}
        />
        <DrawerItem
          onPress={() => navigation.navigate('Invoice')}
          text="Pošalji uplatnicu"
          IconComponent={() => (
            <AntDesign name="filetext1" size={20} color={colors.text} />
          )}
        />
        <DrawerItem
          onPress={() => navigation.navigate('TermsOfService')}
          text="Uslovi korištenja"
          IconComponent={() => (
            <AntDesign name="file1" size={20} color={colors.text} />
          )}
        />
        <DrawerItem
          onPress={openEmail}
          text="Kontaktirajte nas"
          IconComponent={() => (
            <AntDesign name="mail" size={20} color={colors.text} />
          )}
        />
      </View>
      {(paymentSettings?.isEnabledAndroid && Platform.OS === 'android') ||
      (paymentSettings?.isEnabledApple && Platform.OS === 'ios') ? (
        <Image
          source={require('../../assets/monri.png')}
          style={styles.monri}
          resizeMode="contain"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  monri: {
    width: '100%',
    height: 80,
  },
});

export default DrawerMenu;
