/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useCallback, useEffect, useLayoutEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {TextInput, useTheme, Button, Text} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {setFirestoreUser} from './userSlice';
import {validateEmail, validatePhoneNumber} from '../utils/helpers';

function Welcome({navigation}) {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const {data: user} = useSelector(state => state.user) ?? {};

  const {
    firstName: stateFirstName,
    lastName: stateLastName,
    birhtDate: stateBirthDate,
    email: stateEmail,
    phoneNumber: statePhoneNumber,
    gender: stateGender,
    isPremium,
  } = user ?? {};

  const [firstName, setFirstName] = useState(stateFirstName);
  const [lastName, setLasttName] = useState(stateLastName);
  const [birhtDate, setBirthDate] = useState(stateBirthDate);
  const [birthString, setBirthString] = useState(
    stateBirthDate
      ? moment(stateBirthDate.seconds * 1000).format('DD.MM.YYYY.')
      : null,
  );
  const [email, setEmail] = useState(stateEmail);
  const [phoneNumber, setPhoneNumber] = useState(statePhoneNumber);
  const [gender, setGender] = useState(stateGender);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onNextPress = useCallback(() => {
    const userObject = {
      firstName,
      lastName,
      birhtDate,
      email,
      phoneNumber,
      gender,
      isPremium,
    };

    dispatch(setFirestoreUser(userObject));
    navigation.replace('Home');
  }, [
    birhtDate,
    dispatch,
    email,
    firstName,
    gender,
    isPremium,
    lastName,
    navigation,
    phoneNumber,
  ]);

  const onConfirmDate = useCallback(dateObject => {
    setIsModalOpen(false);
    setBirthDate(dateObject);
    const string = moment(dateObject).format('DD.MM.YYYY.');
    setBirthString(string);
  }, []);

  const onCancelDate = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const openDateModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    setFirstName(stateFirstName);
    setLasttName(stateLastName);
    setBirthDate(stateBirthDate);
    setEmail(stateEmail);
    setPhoneNumber(statePhoneNumber);
    setGender(stateGender);
    if (stateBirthDate) {
      setBirthString(
        moment(stateBirthDate.seconds * 1000).format('DD.MM.YYYY.'),
      );
    }
  }, [
    stateBirthDate,
    stateEmail,
    stateFirstName,
    stateGender,
    stateLastName,
    statePhoneNumber,
  ]);

  useEffect(() => {
    if (!user) return;
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
  }, [navigation, user]);

  return (
    <View style={styles.mainContainer(colors.surface)}>
      <View style={{flex: 1}}>
        <TextInput
          label="Ime"
          mode="outlined"
          value={firstName}
          onChangeText={setFirstName}
          maxLength={50}
        />
        <TextInput
          label="Prezime"
          mode="outlined"
          value={lastName}
          onChangeText={setLasttName}
          maxLength={50}
        />
        <TextInput
          onPressIn={openDateModal}
          label="Datum rođenja"
          mode="outlined"
          value={birthString}
          onKeyPress={() => {}}
        />
        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          maxLength={50}
          keyboardType="email-address"
          error={email && !validateEmail(email)}
        />
        <TextInput
          label="Broj telefona"
          mode="outlined"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={50}
          keyboardType="numeric"
          error={phoneNumber && !validatePhoneNumber(phoneNumber)}
        />
        <View style={{...styles.row, marginTop: 10}}>
          <Button
            mode="outlined"
            style={styles.button(
              gender === 'm' ? colors.primary : colors.disabled,
            )}
            onPress={() => setGender('m')}>
            Muško
          </Button>
          <Button
            mode="outlined"
            style={styles.button(
              gender === 'f' ? colors.primary : colors.disabled,
            )}
            onPress={() => setGender('f')}>
            Žensko
          </Button>
        </View>
        <View style={{marginTop: 10}}>
          <Text style={{fontWeight: 'bold'}}>
            AKTIVNI PAKET: {!isPremium ? 'FREE' : 'PREMIUM'}
          </Text>
        </View>
      </View>
      <Button onPress={onNextPress} mode="contained">
        Spremi
      </Button>
      <DatePicker
        modal
        open={isModalOpen}
        date={new Date()}
        mode="date"
        onConfirm={onConfirmDate}
        onCancel={onCancelDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: backgroundColor => ({
    flex: 1,
    backgroundColor,
    padding: 20,
  }),
  text: {
    marginVertical: 5,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    aligItems: 'center',
    justifyContent: 'space-between',
  },
  button: borderColor => ({
    borderColor,
    flex: 0.48,
    borderWidth: 1,
  }),
  backButton: {
    marginLeft: 20,
  },
});

export default Welcome;
