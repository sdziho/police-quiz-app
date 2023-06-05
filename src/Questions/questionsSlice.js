/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCollection } from '../Firestore';
import { FREE_USER_QUESTIONS_PERCENTAGE, STATUS_TYPES } from '../utils/constants';

export const getQuestions = createAsyncThunk(
  'user/getQuestions',
  async ({
    categoryId, isForInspector, isForPoliceman, isPremium,
  }, { dispatch }) => {
    const conditions = [['categories', 'array-contains-any', [categoryId]],
    ];
    if (isForInspector) {
      conditions.push(['isForInspector', '==', isForInspector]);
    }

    if (isForPoliceman) {
      conditions.push(['isForPoliceman', '==', isForPoliceman]);
    }

    return getCollection({ collection: 'questions', condition: conditions }).then((response) => {
      if (isPremium) {
        dispatch(setQuestions(response));
      } else {
        const indexAtPercengate = Math.round((response.length * FREE_USER_QUESTIONS_PERCENTAGE) / 100);
        dispatch(setQuestions(response.slice(0, indexAtPercengate)));
      }
    });
  },
);

export const questionsSlice = createSlice({
  name: 'questions',
  initialState: {
    data: null,
    status: STATUS_TYPES.PENDING,
  },
  reducers: {
    setQuestions: (state, action) => {
      state.data = action.payload;
    },
    resetQuestions: (state) => {
      state.data = null;
      state.status = STATUS_TYPES.PENDING;
    },
  },
  extraReducers: {
    [getQuestions.pending]: (state) => {
      state.status = STATUS_TYPES.PENDING;
    },
    [getQuestions.fulfilled]: (state) => {
      state.status = STATUS_TYPES.SUCCESS;
    },
    [getQuestions.rejected]: (state) => {
      state.status = STATUS_TYPES.REJECT;
    },
  },
});

export const {
  setQuestions, resetQuestions,
} = questionsSlice.actions;

export default questionsSlice.reducer;
