/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-unescaped-entities */
import React, {useLayoutEffect, useState} from 'react';
import {ScrollView, StyleSheet, Linking, View, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme, Text, Button, List} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {PAYMENT_API_URL, STATUS_TYPES} from '../utils/constants';
import {randomIntFromInterval, replaceAll} from '../utils/helpers';
import ImageViewer from 'react-native-image-zoom-viewer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ONLINE_PAYMENT = 'Online plaćanje';
const INVOICE_PAYMENT = 'Plaćanje putem uplatnice';

function Payment({navigation}) {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(null);
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

  const price30 = paymentSettings.price30;
  const price60 = paymentSettings.price60;
  const price90 = paymentSettings.price90;
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
      let plan = 'price30';
      if (selectedPrice === price60) plan = 'price60';
      if (selectedPrice === price90) plan = 'price90';

      const {data} = await axios
        .post(`${PAYMENT_API_URL}/payment`, {
          orderNumber,
          price: selectedPrice * 100,
          category: plan,
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
            <Ionicons
              name="options-outline"
              size={20}
              color={colors.darkerShade}
            />
          );
        }}
        dropdownIconPosition={'right'}
        dropdownStyle={styles.dropdownDropdownStyle}
        rowStyle={styles.dropdownRowStyle}
        rowTextStyle={styles.dropdownRowTxtStyle}
      />

      {selectedValue == ONLINE_PAYMENT && (
        <>
          <Text style={styles.headline}>Izaberite plan:</Text>
          <View
            style={{
              marginTop: 30,
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={[
                {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                  width: '100%',
                },
              ]}>
              <TouchableOpacity
                onPress={() => setSelectedPrice(price30)}
                style={[
                  styles.shadowBox,
                  {
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor:
                      selectedPrice === price30 ? '#BBBBBB' : 'white',
                  },
                ]}>
                {selectedPrice === price30 && (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={40}
                    color={colors.darkerShade}
                    style={{marginTop: 10}}
                  />
                )}
                <View style={styles.price}>
                  <Text style={[{fontSize: 50, color: colors.primary}]}>
                    {price30}
                  </Text>
                  <Text style={[{color: colors.primary}]}>KM</Text>
                </View>
                <Text style={[styles.days]}>30 dana</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedPrice(price60)}
                style={[
                  styles.shadowBox,
                  {
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor:
                      selectedPrice === price60 ? '#BBBBBB' : 'white',
                  },
                ]}>
                {selectedPrice === price60 && (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={40}
                    color={colors.darkerShade}
                    style={{marginTop: 10}}
                  />
                )}
                <View style={styles.price}>
                  <Text style={[{fontSize: 50, color: colors.primary}]}>
                    {price60}
                  </Text>
                  <Text style={[{color: colors.primary}]}>KM</Text>
                </View>
                <Text style={[styles.days]}>60 dana</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.shadowBox,
                {
                  alignItems: 'center',
                  backgroundColor:
                    selectedPrice === price90 ? '#BBBBBB' : 'white',
                },
              ]}
              onPress={() => setSelectedPrice(price90)}>
              {selectedPrice === price90 && (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={40}
                  color={colors.darkerShade}
                  style={{marginTop: 10}}
                />
              )}
              <View style={styles.price}>
                <Text style={[{fontSize: 50, color: colors.primary}]}>
                  {price90}
                </Text>
                <Text style={[{color: colors.primary}]}>KM</Text>
              </View>
              <Text style={[styles.days]}>90 dana</Text>
            </TouchableOpacity>

            <Button
              onPress={onBuyPress}
              style={[styles.button(colors.primary)]}
              disabled={!selectedPrice}>
              <Text style={{color: selectedPrice ? 'white' : '#BBBBBB'}}>
                Plati
              </Text>
            </Button>
          </View>
        </>
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
const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  contentContainer: backgroundColor => ({
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
  price: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 75,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  days: {
    position: 'absolute',
    bottom: 20,
    flex: 1,
    textAlign: 'center',
    width: '100%',
  },
  button: backgroundColor => ({
    paddingHorizontal: 30,
    backgroundColor,
    color: 'red',
    marginTop: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }),
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
  shadowBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 200,
    width: width * 0.4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownBtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdownDropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdownRowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdownRowTxtStyle: {color: '#444', textAlign: 'left'},
});

export default Payment;
