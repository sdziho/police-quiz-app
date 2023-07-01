import React, {useEffect, useLayoutEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import Welcome from '../Welcome';
import {commonNavigationOptions, linking} from './settings';
import Home from '../Home';
import Questions from '../Questions';
import TermsOfService from '../TermsOfService';
import About from '../About';
import Payment from '../Payment';
import Laws from '../Laws';

const Stack = createStackNavigator();

function MainNavigator() {
  const {data} = useSelector(state => state.user) ?? {};

  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    if (data !== null) {
      setIsLoading(false);
    }
  }, [data]);

  return isLoading ? null : (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={commonNavigationOptions}
        initialRouteName={data ? 'Home' : 'Welcome'}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            title: 'Više o Vama',
          }}
        />
        <Stack.Screen
          name="TermsOfService"
          component={TermsOfService}
          options={{
            title: 'Uslovi korištenja',
          }}
        />
        <Stack.Screen
          name="About"
          component={About}
          options={{
            title: 'O nama',
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Dobrodošli',
          }}
        />
        <Stack.Screen
          name="Questions"
          component={Questions}
          options={{
            title: 'Pitanje',
          }}
        />
        <Stack.Screen
          name="Laws"
          component={Laws}
          options={{
            title: 'Zakoni',
          }}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{
            title: 'Postani PREMIUM član',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
