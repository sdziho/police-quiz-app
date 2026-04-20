import {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {initAppOpenTracking} from './src/analytics';
import {
  DefaultTheme,
  Provider as PaperProvider,
  useTheme,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';
import {getUser} from './src/Firestore';
import MainNavigator from './src/Navigation';
import {setUser} from './src/Welcome/userSlice';
import {getSettings} from './src/Settings/settingsSlice';
import {setCustomText} from 'react-native-global-props';
import {
  registerDeviceForPush,
  subscribeMessagingListeners,
} from './src/push/fcm';

function App() {
  const {colors} = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    return subscribeMessagingListeners();
  }, []);
  useEffect(() => {
    return initAppOpenTracking();
  }, []);

  useEffect(() => {
    getUser()
      .then(response => {
        const userData = response.data();
        dispatch(setUser(userData));
        void registerDeviceForPush({isPremium: !!userData?.isPremium});
      })
      .finally(() => {
        dispatch(getSettings());
        setTimeout(() => {
          RNBootSplash.hide({fade: true});
        }, 1000);
      });
  }, [dispatch]);

  setCustomText({
    style: {
      fontFamily: 'Roboto-Regular',
    },
  });
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#2074B9',
      accent: '#81c88d',
      error: '#e76b6f',
      orange: '#FFA500',
      lighterShade: '#a9e2b9',
      darkerShade: '#599d68',
    },
  };
  return (
    <PaperProvider theme={theme}>
      <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
      <SafeAreaView
        style={{flex: 1, backgroundColor: 'white'}}
        forceInset={{top: 'always'}}>
        <MainNavigator />
      </SafeAreaView>
    </PaperProvider>
  );
}

export default App;
