/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getMixedCollection, getCollection} from '../Firestore';
import {FREE_USER_QUESTIONS_PERCENTAGE, STATUS_TYPES} from '../utils/constants';

export const getQuestions = createAsyncThunk(
  'user/getQuestions',
  async (
    {
      categoryId,
      subcategoryId,
      isForInspector,
      isForPoliceman,
      isPremium,
      paymentDetails,
    },
    {dispatch},
  ) => {
    const conditions = [['categories', 'array-contains-any', [categoryId]]];
    if (subcategoryId != 'TEST')
      conditions.push(['subcategories', 'array-contains-any', [subcategoryId]]);
    if (isForInspector) {
      conditions.push(['isForInspector', '==', isForInspector]);
    }

    if (isForPoliceman) {
      conditions.push(['isForPoliceman', '==', isForPoliceman]);
    }
    if (conditions.length > 1) {
      return getMixedCollection({
        collection: 'questions',
        condition: conditions,
      }).then(response => {
        console.log(paymentDetails.categories, categoryId);
        if (isPremium && paymentDetails.categories.includes(categoryId)) {
          if (subcategoryId == 'TEST')
            dispatch(setQuestions(response.slice(0, 50)));
          else dispatch(setQuestions(response));
        } else {
          const indexAtPercengate = Math.round(
            (response.length * FREE_USER_QUESTIONS_PERCENTAGE) / 100,
          );
          console.log(indexAtPercengate);

          dispatch(setQuestions(response.slice(0, indexAtPercengate)));
        }
      });
    } else {
      return getCollection({
        collection: 'questions',
        condition: conditions,
      }).then(response => {
        if (isPremium && paymentDetails.categories.includes(categoryId)) {
          if (subcategoryId == 'TEST')
            dispatch(setQuestions(response.slice(0, 50)));
          else dispatch(setQuestions(response));
        } else {
          const indexAtPercengate = Math.round(
            (response.length * FREE_USER_QUESTIONS_PERCENTAGE) / 100,
          );
          dispatch(setQuestions(response.slice(0, indexAtPercengate)));
        }
      });
    }
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
    resetQuestions: state => {
      state.data = null;
      state.status = STATUS_TYPES.PENDING;
    },
  },
  extraReducers: {
    [getQuestions.pending]: state => {
      state.status = STATUS_TYPES.PENDING;
    },
    [getQuestions.fulfilled]: state => {
      state.status = STATUS_TYPES.SUCCESS;
    },
    [getQuestions.rejected]: state => {
      state.status = STATUS_TYPES.REJECT;
    },
  },
});

export const {setQuestions, resetQuestions} = questionsSlice.actions;

export default questionsSlice.reducer;
