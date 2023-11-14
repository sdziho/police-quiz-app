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
import Invoice from '../Invoice';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Profile from '../Profile/Profile';
import {useTheme} from 'react-native-paper';
import Notifications from '../Notifications';

const Tab = createBottomTabNavigator();
const headerStyle = {
  borderBottomWidth: 1,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};
const Stack = createStackNavigator();
const MainTabNavigator = () => {
  const user = useSelector(state => state.user.data);
  const notifications = useSelector(state => state.notifications.data);
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const seenNotifications = user?.notificationSeen || [];
  const numberOfNotSeenNotifications = notifications.filter(
    notification =>
      nowInSeconds < notification.endingAt.seconds &&
      !seenNotifications.includes(notification.id),
  ).length;

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Početna') {
            iconName = focused ? 'home-sharp' : 'home-outline';
          } else if (route.name === 'Obavjesti') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Uputstvo') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={20} color={color} />;
        },
        tabBarActiveTintColor: '#2074B9',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
        },
      })}>
      <Tab.Screen
        name="Početna"
        component={Home}
        options={{
          title: 'Police Quiz',
          headerStyle,
        }}
      />
      <Tab.Screen
        name="Obavjesti"
        component={Notifications}
        options={{
          title: 'Obavijesti',
          headerStyle,
          ...(numberOfNotSeenNotifications > 0 && {
            tabBarBadge: numberOfNotSeenNotifications,
          }),
        }}
      />
      <Tab.Screen
        name="Uputstvo"
        component={TermsOfService}
        options={{
          title: 'Uputstvo',
          headerStyle,
        }}
      />
      <Tab.Screen
        name="Profil"
        component={Profile}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};
function MainNavigator() {
  const {data} = useSelector(state => state.user) ?? {};
  const {colors} = useTheme();
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
        initialRouteName={data ? 'MainTab' : 'Welcome'}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            title: 'Više o Vama',
            headerStyle,
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
            title: 'Pitanja',
            headerStyle,
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
            headerStyle,
          }}
        />
        <Stack.Screen
          name="Invoice"
          component={Invoice}
          options={{
            title: 'Pošaljice uplatnicu',
          }}
        />
        <Stack.Screen
          name="MainTab"
          component={MainTabNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
