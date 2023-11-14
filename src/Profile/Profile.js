import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {default as versionInfo} from '../../version.json';
import {useSelector} from 'react-redux';
import {format} from 'date-fns';

const {width} = Dimensions.get('window');

function Profile() {
  const {colors} = useTheme();
  const user = useSelector(state => state.user.data);
  const {paymentSettings} = useSelector(state => state.settings.data) ?? {};
  const {isPremium, id} = user ?? {};
  const navigation = useNavigation();
  const navigateTo = nav => {
    navigation.navigate(nav);
  };
  const createdAt = user?.paymentDetails?.createdAt?.seconds;
  const expiresAt = user?.paymentDetails?.expiresAt?.seconds;
  const paymentDate = createdAt
    ? format(new Date(createdAt * 1000), 'dd.MM.yyyy.')
    : null;
  const expireDate = expiresAt
    ? format(new Date(expiresAt * 1000), 'dd.MM.yyyy.')
    : null;
  return (
    <View style={styles.container(colors.surface)}>
      <View style={styles.flexColumn}>
        <View style={styles.flexRow}>
          <Ionicons name="person-circle-outline" size={80} />

          <View style={[styles.flexColumn, styles.ml]}>
            <Text style={[styles.primaryText, styles.color(colors.primary)]}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={[styles.secondaryText]}>{user.email}</Text>
          </View>
        </View>
        <View style={styles.flexColumn}>
          {isPremium ? (
            <>
              <View style={[styles.flexRow, styles.mb]}>
                <Text style={[styles.secondaryText]}>Status: </Text>
                <Text>Premium</Text>
              </View>
              {createdAt && (
                <View style={[styles.flexRow, styles.mb]}>
                  <Text style={[styles.secondaryText]}>Uplaćeno: </Text>
                  <Text>{paymentDate}</Text>
                </View>
              )}
              {expiresAt && (
                <View style={[styles.flexRow, styles.mb]}>
                  <Text style={[styles.secondaryText]}>Ističe: </Text>
                  <Text>{expireDate}</Text>
                </View>
              )}
            </>
          ) : (
            <View style={[styles.flexRow, styles.mb]}>
              <Text style={[styles.secondaryText]}>Status: </Text>
              <Text>Besplatna verzija</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.shadowBox, styles.action]}
        onPress={() => navigateTo('Welcome')}>
        <View style={styles.flexRow}>
          <View style={styles.flexRow}>
            <Ionicons
              name="pencil-sharp"
              size={15}
              color={colors.darkerShade}
            />
            <Text style={[styles.secondaryText, styles.ml]}>
              Ažuriraj profil
            </Text>
          </View>
          <Ionicons
            name="chevron-forward-sharp"
            size={20}
            color={colors.darkerShade}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.shadowBox, styles.action]}
        onPress={() => navigateTo('About')}>
        <View style={styles.flexRow}>
          <View style={styles.flexRow}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color={colors.darkerShade}
            />
            <Text style={[styles.secondaryText, styles.ml]}>O nama</Text>
          </View>
          <Ionicons
            name="chevron-forward-sharp"
            size={20}
            color={colors.darkerShade}
          />
        </View>
      </TouchableOpacity>
      <View style={{position: 'absolute', bottom: 40, width: width}}>
        <Text style={{textAlign: 'center'}}>
          Verzija: {versionInfo.version}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  color: backgroundColor => ({
    color: backgroundColor,
  }),
  action: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  ml: {
    marginLeft: 10,
  },
  mb: {
    marginBottom: 3,
  },
  container: backgroundColor => ({
    paddingVertical: 10,
    paddingHorizontal: 30,
    flex: 1,
    backgroundColor,
  }),
  primaryText: {
    fontSize: 20,
  },
  secondaryText: {},
  borders: {
    scaleX: 1.2,
    scaleY: 1.2,
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'red',
  },
  shadowBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
export default Profile;
