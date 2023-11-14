import React, {useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, RefreshControl} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Text, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OverviewModal from '../CommonComponents/OverviewModal';
import {setFirestoreUser} from '../Welcome/userSlice';
import {getNotifications} from './notificationsSlice';

export default function Notifications() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  const rowNotifications = useSelector(state => state.notifications.data);
  const notifications = [...rowNotifications]?.sort((a, b) => {
    return a?.startingAt?.seconds < b?.startingAt?.seconds ? 1 : -1;
  });
  const seenNotifications = user?.notificationSeen || [];
  const fetchData = () => {
    dispatch(getNotifications());
    setRefreshing(false);
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={{margin: 5}}>
        {notifications.map(notification => {
          const nowInSeconds = Math.floor(Date.now() / 1000);
          const isSeen = seenNotifications.includes(notification.id);
          if (nowInSeconds < notification.endingAt.seconds)
            return (
              <TouchableOpacity
                style={[styles.shadowBox, styles.action]}
                onPress={() => {
                  if (!isSeen) {
                    dispatch(
                      setFirestoreUser({
                        notificationSeen: [
                          ...seenNotifications,
                          notification.id,
                        ],
                      }),
                    );
                  }
                  setSelectedNotification(notification);
                }}>
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
          <ScrollView
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 30,
            }}>
            <Text
              style={{
                fontSize: 25,
                marginBottom: 30,
                color: '#2074B9',
              }}>
              {selectedNotification?.title}
            </Text>
            <Text>{selectedNotification?.message}</Text>
          </ScrollView>
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
