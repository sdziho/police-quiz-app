import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserReducer from '../Welcome/userSlice';
import CategoriesReducer from '../Home/categoriesSlice';
import SubcategoriesReducer from '../Home/subcategoriesSlice';
import QuestionsReducer from '../Questions/questionsSlice';
import AdsReducer from '../Questions/adsSlice';
import SettingsSlice from '../Settings/settingsSlice';
import NotificationsReducer from '../Notifications/notificationsSlice';

const appReducer = combineReducers({
  user: UserReducer,
  categories: CategoriesReducer,
  subcategories: SubcategoriesReducer,
  questions: QuestionsReducer,
  ads: AdsReducer,
  settings: SettingsSlice,
  notifications: NotificationsReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const middlewares = [];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(middlewares),
});

const persistor = persistStore(store);

export {store, persistor};
