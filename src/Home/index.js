/* eslint-disable no-shadow */
/* eslint-disable react/no-unstable-nested-components */
import { useFocusEffect } from '@react-navigation/native';
import React, {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import {
  View, StyleSheet, FlatList,Text, Dimensions, Image, Animated, RefreshControl, StatusBar, Platform,
} from 'react-native';
import {
  useTheme, ActivityIndicator, List,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import SideMenu from 'react-native-side-menu';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Modal from '../CommonComponents/Modal';
import NoData from '../CommonComponents/NoData';
import UserButton from '../CommonComponents/UserButton';
import { resetAds } from '../Questions/adsSlice';
import { resetQuestions } from '../Questions/questionsSlice';
import { STATUS_TYPES } from '../utils/constants';
import { randomIntFromInterval, replaceAll } from '../utils/helpers';
import { setFirestoreUser } from '../Welcome/userSlice';
import { getCategories } from './categoriesSlice';
import CategoryItem from './components/CategoryItem';
import PaymentModal from './components/PaymentModal';
import SuccessModal from './components/SuccessModal';
import DrawerMenu from './components/DrawerMenu';
import MenuButton from '../CommonComponents/MenuButton';
import { getSettings } from '../Settings/settingsSlice';
import TermsOfService from '../TermsOfService';
import FirstComponent from './components/topTabComponents/firstComponent';
import SecondComponent from './components/topTabComponents/secondComponent';
import { ScrollView } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.35;

function Home({ navigation, route }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { data, status } = useSelector(state => state.categories);
  const user = useSelector(state => state.user.data);
  const { paymentSettings } = useSelector(state => state.settings.data) ?? {};
  const { isPremium, id } = user ?? {};
  const isLoading = status === STATUS_TYPES.PENDING;

  const orderNumber = `${replaceAll(id, '-', '')}_${randomIntFromInterval(100000, 999999)}`;

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isSuccesPaymentModalVisible, setIsSuccesPaymentModalVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const offset = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: offset } } }],
    { useNativeDriver: false },
  );

  const headerHeight = offset.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  const Tab = createMaterialTopTabNavigator()

  const renderItem = useCallback(({ item }) => (
    <CategoryItem item={item} />
  ), []);

  const keyExtractor = useCallback((item) => item.id, []);

  const onRefresh = useCallback(() => {
    dispatch(getCategories());
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    const { status } = route.params ?? {};
    console.log({ status });
    if (status === 'success') {
      dispatch(setFirestoreUser({
        isPremium: true,
        paymentDetails: {
          orderNumber,
          createdAt: new Date(),
        },
      }));
      setIsSuccesPaymentModalVisible(true);
      navigation.setParams({ status: null });
    }
  }, [dispatch, navigation, orderNumber, route.params, user]);

  useEffect(() => {
    (async () => {
      if (!isPremium) {
        if (Platform.OS === 'android' && paymentSettings?.isEnabledAndroid) {
          setIsPaymentModalVisible(true);
        }
        if (Platform.OS === 'ios' && paymentSettings?.isEnabledApple) {
          setIsPaymentModalVisible(true);
        }
      } else {
        setIsPaymentModalVisible(false);
      }
    })();
  }, [isPremium, paymentSettings?.isEnabled, paymentSettings?.isEnabledAndroid, paymentSettings?.isEnabledApple]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (<UserButton />),
      headerLeft: () => (<MenuButton onPress={toggleMenu} />),
    });
  }, [navigation, toggleMenu]);

  const onFocus = useCallback(() => {
    dispatch(resetQuestions());
    dispatch(resetAds());
  }, [dispatch]);

  useFocusEffect(onFocus);


  const menu = <DrawerMenu navigation={navigation} />;

  return (
    <SideMenu isOpen={isMenuOpen} menu={menu}>
      <View
        style={styles.mainContainer(colors.surface)}
      >
        <StatusBar
          backgroundColor={colors.surface}
          barStyle="dark-content"
        />
        <Animated.View
          style={styles.logoContainer(headerHeight)}
        >
          <Image
            source={require('../assets/pqLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        {isLoading ? (
          <ActivityIndicator
            style={{ flex: 1, paddingTop: HEADER_HEIGHT }}
            size="small"
          />
        )
          : (
      <Animated.View style={styles.tabContainer(headerHeight)}>

             <Tab.Navigator screenOptions={styles.tabScreenOptions} >
              <Tab.Screen  name='Screen 1' component={(props)=><FirstComponent {...props} onScroll={onScroll}/>}/>
              <Tab.Screen  name='Screen 2' component={(props)=><SecondComponent {...props} onScroll={onScroll}/>} />
             </Tab.Navigator>
      </Animated.View>
             
            // <FlatList
            //   onScroll={onScroll}
            //   stickyHeaderIndices={[0]}
            //   ListHeaderComponent={() => (
            //     <List.Subheader
            //       style={{ backgroundColor: colors.surface }}
            //     >Kategorije
            //     </List.Subheader>
            //   )}
            //   keyExtractor={keyExtractor}
            //   data={data}
            //   renderItem={renderItem}
            //   contentContainerStyle={styles.contentContainer}
            //   ListEmptyComponent={() => (<NoData />)}
            //   refreshControl={(
            //     <RefreshControl
            //       onRefresh={onRefresh}
            //       refreshing={isLoading}
            //     />
            // )}
            // />
          )}
        <Modal
          isVisible={isPaymentModalVisible}
          hideModal={() => setIsPaymentModalVisible(false)}
        >
          <PaymentModal
            orderNumber={orderNumber}
            price={paymentSettings?.price}
            hide={() => setIsPaymentModalVisible(false)}
          />
        </Modal>
        <Modal
          isVisible={isSuccesPaymentModalVisible}
          hideModal={() => setIsSuccesPaymentModalVisible(false)}
        >
          <SuccessModal />
        </Modal>
      </View>
    </SideMenu>
  );
}

const styles = StyleSheet.create({
  mainContainer: backgroundColor => ({
    backgroundColor,
    flex: 1,
  }),
  logoContainer: (height) => ({
    height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
  }),
  logo: {
    height: 200,
    width: 200,
  },
 tabContainer:(height)=>({
  marginTop: height,
  flexGrow: 1,
  borderTopColor: "#f8f9fa",
  borderTopWidth: 2

 }),

 tabScreenOptions:{
  tabBarLabelStyle: { fontSize: 14 },
  tabBarItemStyle: { height: 60 },
 }

});

export default Home;
