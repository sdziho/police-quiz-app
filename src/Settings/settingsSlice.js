/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCollection } from '../Firestore';
import { STATUS_TYPES } from '../utils/constants';

export const getSettings = createAsyncThunk(
  'user/getSettings',
  async (payload, { dispatch }) => {
    return getCollection({ collection: 'settings' }).then(response => {
      dispatch(setSettings({
        paymentSettings: response[0],
      }));
    });
  },
);

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    data: null,
    status: STATUS_TYPES.PENDING,
  },
  reducers: {
    setSettings: (state, action) => {
      state.data = action.payload;
    },
    resetSettings: (state) => {
      state.data = null;
      state.status = STATUS_TYPES.PENDING;
    },
  },
  extraReducers: {
    [getSettings.pending]: (state) => {
      state.status = STATUS_TYPES.PENDING;
    },
    [getSettings.fulfilled]: (state) => {
      state.status = STATUS_TYPES.SUCCESS;
    },
    [getSettings.rejected]: (state) => {
      state.status = STATUS_TYPES.REJECT;
    },
  },
});

export const {
  setSettings, resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
