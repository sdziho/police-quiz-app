/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import {ScrollView, StyleSheet, Linking, Image} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useTheme, Text} from 'react-native-paper';

function Invoice() {
  const openEmail = () => {
    Linking.openURL(
      'mailto:policequizbih@gmail.com?subject=Police Quiz - Upit korisnika',
    );
  };
  const openNumber = () => {
    let number = '';
    if (Platform.OS === 'ios') {
      number = 'telprompt:${38761809244}';
    } else {
      number = 'tel:${38761809244}';
    }
    Linking.openURL(number);
  };
  const {colors} = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.contentContainer(colors.surface)}>
      <Text style={styles.text}>
        U slučaju neuspješne uplate novca preko Monri aplikacije, pošaljite
        uplatnicu sa ličnim podacima na mail{' '}
        <Text onPress={openEmail} style={{color: colors.primary}}>
          policequizbih@gmail.com{' '}
        </Text>
        ili Viberom na broj
        <Text onPress={openNumber} style={{color: colors.primary}}>
          {' '}
          +38761809244
        </Text>
      </Text>
      <Text style={styles.headline}>Primjer uplatnice:</Text>

      {/* <Image source={require('../assets/uplatnica.png')} /> */}
      <ImageViewer
        imageUrls={[
          {
            url: '',
            props: {
              // Or you can set source directory.
              source: require('../assets/uplatnica.png'),
            },
          },
        ]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: backgroundColor => ({
    flex: 1,
    padding: 20,
    backgroundColor,
  }),
  bottomTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  bottomText: {
    textAlign: 'left',
    color: '#333',
    fontSize: 14,
  },
  text: {
    fontSize: 16,
  },
  backButton: {
    marginLeft: 20,
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },

  dropdownBtnStyle: {
    marginTop: 10,
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdownBtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdownDropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdownRowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdownRowTxtStyle: {color: '#444', textAlign: 'left'},
});

export default Invoice;
