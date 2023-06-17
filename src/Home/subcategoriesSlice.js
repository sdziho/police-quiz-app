/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getCollection} from '../Firestore';
import {STATUS_TYPES} from '../utils/constants';

export const getSubcategories = createAsyncThunk(
  'user/getSubcategories',
  async (payload, {dispatch}) => {
    return getCollection({
      collection: 'subcategories',
    }).then(response => {
      dispatch(setSubcategories(response));
    });
  },
);

export const subcategoriesSlice = createSlice({
  name: 'subcategories',
  initialState: {
    data: null,
    status: STATUS_TYPES.PENDING,
  },
  reducers: {
    setSubcategories: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: {
    [getSubcategories.pending]: state => {
      state.status = STATUS_TYPES.PENDING;
    },
    [getSubcategories.fulfilled]: state => {
      state.status = STATUS_TYPES.SUCCESS;
    },
    [getSubcategories.rejected]: state => {
      state.status = STATUS_TYPES.REJECT;
    },
  },
});

export const {setSubcategories} = subcategoriesSlice.actions;

export default subcategoriesSlice.reducer;
