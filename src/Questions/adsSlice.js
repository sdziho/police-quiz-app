/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment';
import { getCollection } from '../Firestore';
import { STATUS_TYPES } from '../utils/constants';

export const getAds = createAsyncThunk(
  'user/getAds',
  async (payload, { dispatch }) => {
    return getCollection({ collection: 'advertisments' }).then((response) => {
      const filterData = response.filter(item => moment(item?.endDate).isAfter(moment()));
      dispatch(setAds(filterData));
    });
  },
);

export const adsSlice = createSlice({
  name: 'ads',
  initialState: {
    data: null,
    status: STATUS_TYPES.PENDING,
  },
  reducers: {
    setAds: (state, action) => {
      state.data = action.payload;
    },
    resetAds: (state) => {
      state.data = null;
      state.status = STATUS_TYPES.PENDING;
    },
  },
  extraReducers: {
    [getAds.pending]: (state) => {
      state.status = STATUS_TYPES.PENDING;
    },
    [getAds.fulfilled]: (state) => {
      state.status = STATUS_TYPES.SUCCESS;
    },
    [getAds.rejected]: (state) => {
      state.status = STATUS_TYPES.REJECT;
    },
  },
});

export const {
  setAds, resetAds,
} = adsSlice.actions;

export default adsSlice.reducer;
