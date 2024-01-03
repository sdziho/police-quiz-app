/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getCollection} from '../Firestore';
import {STATUS_TYPES} from '../utils/constants';

export const getCategories = createAsyncThunk(
  'user/getCategories',
  async (payload, {dispatch}) => {
    return getCollection({
      collection: 'categories',
    }).then(response => {
      dispatch(setCategories(response));
    });
  },
);

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    data: null,
    status: STATUS_TYPES.PENDING,
    selectedCategory: null,
  },
  reducers: {
    setCategories: (state, action) => {
      state.data = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: {
    [getCategories.pending]: state => {
      state.status = STATUS_TYPES.PENDING;
    },
    [getCategories.fulfilled]: state => {
      state.status = STATUS_TYPES.SUCCESS;
    },
    [getCategories.rejected]: state => {
      state.status = STATUS_TYPES.REJECT;
    },
  },
});

export const {setCategories, setSelectedCategory} = categoriesSlice.actions;

export default categoriesSlice.reducer;
