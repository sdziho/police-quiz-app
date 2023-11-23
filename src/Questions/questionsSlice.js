/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getMixedCollection, getCollection} from '../Firestore';
import {FREE_USER_QUESTIONS_PERCENTAGE, STATUS_TYPES} from '../utils/constants';
import {shuffle} from '../utils/helpers';

export const getQuestions = createAsyncThunk(
  'user/getQuestions',
  async (
    {
      categoryId,
      subcategoryId,
      superSubcategory,
      isForInspector,
      isForPoliceman,
      isPremium,
      paymentDetails,
      numberOfQuestions = 50,
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

    const trimQuestions = response => {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      console.log('jel premium', isPremium);
      console.log('super', superSubcategory);
      console.log('det', paymentDetails?.expiresAt?._seconds || 0);
      const expired = nowInSeconds > (paymentDetails?.expiresAt?._seconds || 0);
      console.log('exp', expired);
      if (superSubcategory) {
        response = response.filter(question => {
          return question.subcategories.includes(superSubcategory);
        });
      }
      if (isPremium && !expired) {
        if (subcategoryId == 'TEST') {
          shuffledResponse = shuffle(response);
          dispatch(setQuestions(shuffledResponse.slice(0, numberOfQuestions)));
        } else dispatch(setQuestions(response));
      } else {
        const indexAtPercengate = Math.round(
          (response.length * FREE_USER_QUESTIONS_PERCENTAGE) / 100,
        );
        console.log('response', response.slice(0, indexAtPercengate));

        dispatch(setQuestions(response.slice(0, indexAtPercengate)));
      }
    };

    if (conditions.length > 1) {
      return getMixedCollection({
        collection: 'questions',
        condition: conditions,
      }).then(response => {
        trimQuestions(response);
      });
    } else {
      return getCollection({
        collection: 'questions',
        condition: conditions,
      }).then(response => {
        trimQuestions(response);
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
