/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-unescaped-entities */
import React, {useLayoutEffect, useState} from 'react';
import {ScrollView, StyleSheet, Linking, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme, Text, Button, List} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {PAYMENT_API_URL, STATUS_TYPES} from '../utils/constants';
import {randomIntFromInterval, replaceAll} from '../utils/helpers';
import ImageViewer from 'react-native-image-zoom-viewer';

const ONLINE_PAYMENT = 'Online plaćanje';
const INVOICE_PAYMENT = 'Plaćanje putem uplatnice';

function Payment({navigation}) {
  const [selectedValue, setSelectedValue] = useState('');
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
  /*const {data, status} = useSelector(state => state.categories);
   const categoriesWithoutMUP = data.filter(item => {
    const firstThreeLetters = item.name.slice(0, 3);
    return firstThreeLetters !== 'MUP';
  }); */

  const user = useSelector(state => state.user.data);
  const {paymentSettings, mupSettings} =
    useSelector(state => state.settings.data) ?? {};
  const {id} = user ?? {};

  const {colors} = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <TouchableOpacity
          {...props}
          style={styles.backButton}
          onPress={() => navigation.pop()}>
          <MaterialIcons name="arrow-back" size={25} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const onBuyPress = async () => {
    const orderNumber = `${replaceAll(id, '-', '')}_${randomIntFromInterval(
      100000,
      999999,
    )}`;
    try {
      /* const _price = selectedValue.price
        ? selectedValue.price
        : selectedValue == 'Sve kategorije'
        ? paymentSettings.mupPrice
        : paymentSettings.price;

      const _category = selectedValue.id
        ? selectedValue.id
        : selectedValue == 'Sve kategorije'
        ? 'ALL'
        : 'MUP'; */

      const {data} = await axios
        .post(`${PAYMENT_API_URL}/payment`, {
          orderNumber,
          price: paymentSettings.price * 100,
          category: 'ALL',
        })
        .catch(err => {
          console.log('err', err);
        });
      if (data) {
        Linking.openURL(data.payment_url);
      }
    } catch (error) {
      console.log('catch err', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer(colors.surface)}>
      <Text style={styles.text}>
        Korištenjem besplatnog paketa Police Quiz aplikacije imate pristup svega
        10% ukupnog broja pitanja. Aktivacijom PREMIUM paketa dobivate potpuni
        pristup svim pitanjima kako bi vaš uspjeh na testu bio zagarantovan!{' '}
      </Text>
      <Text style={styles.headline}>Način plaćanja:</Text>
      <SelectDropdown
        data={[ONLINE_PAYMENT, INVOICE_PAYMENT]}
        onSelect={selectedItem => setSelectedValue(selectedItem)}
        defaultButtonText="Izaberite način plaćanja"
        buttonTextAfterSelection={selectedItem => {
          /* if (
            selectedItem === 'Sve kategorije' ||
            selectedItem == 'Svi MUP-ovi'
          ) */
          return selectedItem;
          //else return selectedItem.name;
        }}
        rowTextForSelection={item => {
          //if (item === 'Sve kategorije' || item == 'Svi MUP-ovi') return item;
          //else return item.name;
          return item;
        }}
        buttonStyle={styles.dropdownBtnStyle}
        buttonTextStyle={styles.dropdownBtnTxtStyle}
        renderDropdownIcon={isOpened => {
          return (
            <List.Icon
              icon={isOpened ? 'chevron-up' : 'chevron-down'}
              color={'#444'}
              size={18}
            />
          );
        }}
        dropdownIconPosition={'right'}
        dropdownStyle={styles.dropdownDropdownStyle}
        rowStyle={styles.dropdownRowStyle}
        rowTextStyle={styles.dropdownRowTxtStyle}
      />

      {selectedValue == ONLINE_PAYMENT && (
        <View>
          <Text>Cijena paketa je {paymentSettings.price} KM.</Text>
          <Button
            onPress={onBuyPress}
            style={styles.button}
            disabled={selectedValue == ''}>
            Aktiviraj PREMIUM paket
          </Button>
        </View>
      )}
      {selectedValue == INVOICE_PAYMENT && (
        <>
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
          <ImageViewer
            style={styles.image}
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
        </>
      )}
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
  },
  text: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
  image: {
    marginTop: 10,
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

export default Payment;
