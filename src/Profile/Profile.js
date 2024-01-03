import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Modal,
} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {default as versionInfo} from '../../version.json';
import {useSelector} from 'react-redux';
import {format} from 'date-fns';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

function Profile() {
  const {colors} = useTheme();
  const [historyModal, setHistoryModal] = useState(false);
  const user = useSelector(state => state.user.data);
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
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
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
                  <Text>Status: </Text>
                  <Text style={[styles.secondaryText(colors.primary)]}>
                    Premium
                  </Text>
                </View>
                {createdAt && (
                  <View style={[styles.flexRow, styles.mb]}>
                    <Text>Uplaćeno: </Text>
                    <Text style={[styles.secondaryText(colors.primary)]}>
                      {paymentDate}
                    </Text>
                  </View>
                )}
                {expiresAt && (
                  <View style={[styles.flexRow, styles.mb]}>
                    <Text>Ističe: </Text>
                    <Text style={[styles.secondaryText(colors.primary)]}>
                      {expireDate}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={[styles.flexRow, styles.mb]}>
                <Text>Status: </Text>
                <Text style={[styles.secondaryText(colors.primary)]}>
                  Besplatna verzija
                </Text>
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
          onPress={() => setHistoryModal(isPremium ? true : false)}>
          <View style={styles.flexRow}>
            <View style={styles.flexRow}>
              <Ionicons name="bar-chart" size={15} color={colors.darkerShade} />
              <Text style={[styles.secondaryText, styles.ml]}>
                Historija testova
              </Text>
            </View>
            <Ionicons
              name={isPremium ? 'chevron-forward-sharp' : 'lock-closed'}
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={historyModal}
          onRequestClose={() => {
            setHistoryModal(false);
          }}>
          <View style={styles.buttonClose}>
            <Pressable
              onPress={() => {
                setHistoryModal(false);
              }}>
              <Ionicons name="close" size={25} color={'white'} />
            </Pressable>
          </View>
          <View style={[styles.modal]}>
            {user?.testHistory?.map(element => {
              const date = format(
                new Date(element?.date?._seconds * 1000),
                'dd.MM.yyyy. HH:mm',
              );
              return (
                <View
                  style={[
                    styles.shadowBox,
                    {
                      padding: 10,
                      marginTop: 5,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    },
                  ]}>
                  <View>
                    <Text style={{color: 'black'}}>{element.name}</Text>
                    <Text>{date}</Text>
                  </View>
                  <View>
                    <AnimatedCircularProgress
                      style={styles.circle}
                      rotation={0}
                      size={40}
                      width={3}
                      fill={element.result}
                      tintColor={colors.darkerShade}
                      backgroundColor="lightgray">
                      {fill => (
                        <Text style={{fontSize: 12}}>{element.result}%</Text>
                      )}
                    </AnimatedCircularProgress>
                  </View>
                </View>
              );
            })}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  color: backgroundColor => ({
    color: backgroundColor,
  }),
  modal: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    overflow: 'hidden',
    paddingTop: 100,
    paddingBottom: 50,
    paddingHorizontal: 30,
  },
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
  buttonClose: {
    position: 'absolute',
    top: 50,
    left: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    zIndex: 10,
    height: 35,
    width: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  circle: {
    backgroundColor: 'white',
  },
  secondaryText: color => ({
    color,
  }),
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
