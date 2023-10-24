/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getCollection} from '../Firestore';
import {STATUS_TYPES} from '../utils/constants';

export const getKonkursi = createAsyncThunk(
  'user/getKonkursi',
  async (payload, {dispatch}) => {
    return getCollection({
      collection: 'konkursi',
    }).then(response => {
      dispatch(setKonkursi(response));
    });
  },
);

export const konkursiSlice = createSlice({
  name: 'konkursi',
  initialState: {
    data: null,
    status: STATUS_TYPES.PENDING,
  },
  reducers: {
    setKonkursi: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: {
    [getKonkursi.pending]: state => {
      state.status = STATUS_TYPES.PENDING;
    },
    [getKonkursi.fulfilled]: state => {
      state.status = STATUS_TYPES.SUCCESS;
    },
    [getKonkursi.rejected]: state => {
      state.status = STATUS_TYPES.REJECT;
    },
  },
});

export const {setKonkursi} = konkursiSlice.actions;

export default konkursiSlice.reducer;
