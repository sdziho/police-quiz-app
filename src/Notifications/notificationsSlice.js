/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getCollection} from '../Firestore';
import {STATUS_TYPES} from '../utils/constants';

export const getNotifications = createAsyncThunk(
  'user/getNotifications',
  async (payload, {dispatch}) => {
    return getCollection({collection: 'notifications'}).then(response => {
      dispatch(setNotifications(response));
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
