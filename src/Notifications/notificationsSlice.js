/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getCollection} from '../Firestore';
import {STATUS_TYPES} from '../utils/constants';
import {store} from '../state/store';

export const getNotifications = createAsyncThunk(
  'user/getNotifications',
  async (payload, {dispatch}) => {
    return getCollection({collection: 'notifications'}).then(response => {
      const threeDaysInSeconds = 86400 * 3;
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const expires =
        store.getState()?.user?.data?.paymentDetails?.expiresAt?.seconds ?? 0;
      const resultTime = expires - nowInSeconds;
      if (
        resultTime > 0 &&
        resultTime < threeDaysInSeconds &&
        store.getState()?.user?.data?.isPremium
      ) {
        const secondsInMinute = 60;
        const secondsInHour = 60 * secondsInMinute;
        const secondsInDay = 24 * secondsInHour;

        const days = Math.floor(resultTime / secondsInDay);
        const hours = Math.floor((resultTime % secondsInDay) / secondsInHour);

        let formattedTime = '';

        if (days >= 1) {
          formattedTime += `${days} ${days === 1 ? 'dan' : 'dana'}`;
        } else {
          formattedTime += ` ${hours} sati`;
        }
        const premiumNotificaiton = {
          id: 'premium',
          message: `Vaš premium paket ističe za ${formattedTime}.`,
          title: 'Vaš premium paket ubrzo ističe!',
          startingAt: {seconds: nowInSeconds - 100},
          endingAt: {seconds: nowInSeconds + resultTime + 100},
        };
        console.log('ovdje cemo dispecovat nove notifikacije', response);
        dispatch(setNotifications([...response, premiumNotificaiton]));
      } else dispatch(setNotifications(response));
    });
  },
);

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    data: null,
    status: STATUS_TYPES.PENDING,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.data = action.payload;
    },
    resetNotifications: state => {
      state.data = null;
      state.status = STATUS_TYPES.PENDING;
    },
  },
  extraReducers: {
    [getNotifications.pending]: state => {
      state.status = STATUS_TYPES.PENDING;
    },
    [getNotifications.fulfilled]: state => {
      state.status = STATUS_TYPES.SUCCESS;
    },
    [getNotifications.rejected]: state => {
      state.status = STATUS_TYPES.REJECT;
    },
  },
});

export const {setNotifications, resetNotifications} =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
