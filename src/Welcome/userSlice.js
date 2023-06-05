/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setUser as setUserReq } from '../Firestore';
import { STATUS_TYPES } from '../utils/constants';

export const setFirestoreUser = createAsyncThunk(
  'user/setFirestoreUser',
  async (payload, { dispatch }) => {
    return setUserReq(payload).then((response) => {
      dispatch(setUser(response.data()));
    });
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    status: STATUS_TYPES.PENDING,
  },
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
      state.status = STATUS_TYPES.SUCCESS;
    },
  },
  extraReducers: {
    [setFirestoreUser.pending]: (state) => {
      state.status = STATUS_TYPES.PENDING;
    },
    [setFirestoreUser.fulfilled]: (state) => {
      state.status = STATUS_TYPES.SUCCESS;
    },
    [setFirestoreUser.rejected]: (state) => {
      state.status = STATUS_TYPES.REJECT;
    },
  },
});

export const {
  setUser,
} = userSlice.actions;

export default userSlice.reducer;
