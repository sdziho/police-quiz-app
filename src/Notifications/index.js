import React, {useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Text, useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OverviewModal from '../CommonComponents/OverviewModal';

export default function Notifications() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const {colors} = useTheme();

  const user = useSelector(state => state.user.data);
  const notifications = useSelector(state => state.notifications.data);

  return (
    <ScrollView style={styles.container}>
      <View style={{margin: 5}}>
        {notifications.map(notification => {
          const isSeen = false;
          return (
            <TouchableOpacity
              style={[styles.shadowBox, styles.action]}
              onPress={() => setSelectedNotification(notification)}>
              <View style={styles.flexRow}>
                <View style={styles.flexRow}>
                  <View
                    style={{
                      opacity: isSeen ? 0 : 1,
                      backgroundColor: colors.primary,
                      borderRadius: 50,
                      height: 12,
                      width: 12,
                    }}></View>
                  <Text
                    style={[
                      styles.secondaryText,
                      styles.ml,
                      {
                        fontWeight: isSeen ? 'normal' : 'bold',
                      },
                    ]}>
                    {notification?.title ?? notification?.message}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward-sharp"
                  size={20}
                  color={colors.darkerShade}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <OverviewModal
        imageVisible={false}
        isVisible={selectedNotification ? true : false}
        hideModal={() => setSelectedNotification(null)}
        children={
          <View style={styles.flexColumn}>
            <Text>{selectedNotification?.title}</Text>
          </View>
        }
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  color: backgroundColor => ({
    color: backgroundColor,
  }),
  action: {
    marginTop: 5,
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
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: 'white',
  },
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
  circle: backgroundColor => ({
    backgroundColor,
    borderRadius: 50,
    height: 10,
    width: 10,
    fontWeight: 'bold',
  }),
});
