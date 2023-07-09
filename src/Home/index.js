/* eslint-disable no-shadow */
/* eslint-disable react/no-unstable-nested-components */
import {useFocusEffect} from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Animated,
  RefreshControl,
  StatusBar,
  Platform,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {
  useTheme,
  ActivityIndicator,
  List,
  Text,
  Button,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import SideMenu from 'react-native-side-menu';
import Modal from '../CommonComponents/Modal';
import NoData from '../CommonComponents/NoData';
import UserButton from '../CommonComponents/UserButton';
import {resetAds} from '../Questions/adsSlice';
import {resetQuestions} from '../Questions/questionsSlice';
import {STATUS_TYPES} from '../utils/constants';
import {randomIntFromInterval, replaceAll} from '../utils/helpers';
import {setFirestoreUser} from '../Welcome/userSlice';
import {getCategories} from './categoriesSlice';
import {getSubcategories} from './subcategoriesSlice';
import CategoryItem from './components/CategoryItem';
import PaymentModal from './components/PaymentModal';
import SuccessModal from './components/SuccessModal';
import DrawerMenu from './components/DrawerMenu';
import MenuButton from '../CommonComponents/MenuButton';
import {getSettings} from '../Settings/settingsSlice';
import {getNotifications} from '../Notifications/notificationsSlice';
import {updateCollection} from '../Firestore';

const {height} = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;

function Home({navigation, route}) {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const {data, status} = useSelector(state => state.categories);

  const user = useSelector(state => state.user.data);
  const {paymentSettings} = useSelector(state => state.settings.data) ?? {};
  const {isPremium, id} = user ?? {};
  const isLoading = status === STATUS_TYPES.PENDING;
  const orderNumber = `${replaceAll(id, '-', '')}_${randomIntFromInterval(
    100000,
    999999,
  )}`;

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isSuccesPaymentModalVisible, setIsSuccesPaymentModalVisible] =
    useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationModal, setIsNotificationModal] = useState(false);
  const [items, setItems] = useState([]);
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const toggleNotificationModal = useCallback(
    status => {
      if (status.length > 0) {
        setIsNotificationModal(true);
        setItems(prevItems => {
          const newItems = new Set(prevItems); // Create a new Set from the previous items
          newItems.add(status); // Add the new item to the Set
          return Array.from(newItems); // Convert the Set back to an array
        });
      }
    },
    [isNotificationModal, setIsNotificationModal],
  );
  const offset = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: offset}}}],
    {useNativeDriver: false},
  );

  const headerHeight = offset.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  const renderItem = useCallback(
    ({item}) => {
      return (
        <CategoryItem item={item} notificationModal={toggleNotificationModal} />
      );
    },
    [toggleNotificationModal],
  );

  const keyExtractor = useCallback(item => item.id, []);

  const onRefresh = useCallback(() => {
    dispatch(getCategories());
    dispatch(getSubcategories());
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const threeMonthInSeconds = 30 * 24 * 60 * 60 * 3; // 30 days * 24 hours * 60 minutes * 60 seconds * 3 months
    const expired =
      nowInSeconds >
      user?.paymentDetails?.createdAt._seconds + threeMonthInSeconds;

    if (expired) {
      dispatch(
        setFirestoreUser({
          isPremium: false,
        }),
      );
    }
    dispatch(getCategories());
    dispatch(getSubcategories());
    dispatch(getSettings());
    dispatch(getNotifications());
  }, [dispatch]);

  useEffect(() => {
    //updateCollection();

    const {status} = route.params ?? {};

    const categoryIdRegex = /category=([^&]+)/;

    const match = route.path?.match(categoryIdRegex);

    const categories = user?.paymentDetails?.categories
      ? [...user?.paymentDetails?.categories]
      : [];

    if (status === 'success') {
      if (match[1] === 'ALL') {
        data.forEach(category => {
          if (!categories.includes(category.id)) categories.push(category.id);
        });
      } else if (match[1] === 'MUP') {
        data.forEach(category => {
          if (
            !categories.includes(category.id) &&
            category.name.includes('MUP')
          )
            categories.push(category.id);
        });
      } else if (!categories.includes(match[1])) categories.push(match[1]);

      dispatch(
        setFirestoreUser({
          isPremium: true,
          paymentDetails: {
            orderNumber,
            createdAt: new Date(),
            categories,
          },
        }),
      );
      setIsSuccesPaymentModalVisible(true);
      navigation.setParams({status: null});
    }
  }, [dispatch, navigation, orderNumber, route.params, user]);

  useEffect(() => {
    (async () => {
      setIsPaymentModalVisible(false);
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
  }, [
    isPremium,
    paymentSettings?.isEnabled,
    paymentSettings?.isEnabledAndroid,
    paymentSettings?.isEnabledApple,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <UserButton />,
      headerLeft: () => <MenuButton onPress={toggleMenu} />,
    });
  }, [navigation, toggleMenu]);

  const onFocus = useCallback(() => {
    dispatch(resetQuestions());
    dispatch(resetAds());
  }, [dispatch]);

  useFocusEffect(onFocus);

  const menu = <DrawerMenu navigation={navigation} />;
  useEffect(() => {
    if (!isPremium) {
      //pogkedat kad se runa na androidu
      const timer = setInterval(() => {
        setIsPaymentModalVisible(true);
      }, 1000 * 60 * 2);
      return () => clearInterval(timer);
    }
  }, [isPremium, isPaymentModalVisible]);
  let filteredData = [...data];
  filteredData.sort((a, b) => {
    if ('order' in a && 'order' in b) {
      return a?.order - b?.order;
    } else if ('order' in a) {
      return -1;
    } else if ('order' in b) {
      return 1;
    }
    return 0;
  });
  return (
    <SideMenu isOpen={isMenuOpen} menu={menu}>
      <View style={styles.mainContainer(colors.surface)}>
        <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
        <Animated.View style={styles.logoContainer(headerHeight)}>
          <Image
            source={require('../assets/pqLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        {isLoading && data ? (
          <ActivityIndicator
            style={{flex: 1, paddingTop: HEADER_HEIGHT}}
            size="small"
          />
        ) : (
          <FlatList
            onScroll={onScroll}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={() => (
              <List.Subheader style={{backgroundColor: colors.surface}}>
                Kategorije
              </List.Subheader>
            )}
            keyExtractor={keyExtractor}
            data={filteredData}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
            ListEmptyComponent={() => <NoData />}
            refreshControl={
              <RefreshControl onRefresh={onRefresh} refreshing={isLoading} />
            }
          />
        )}
        <Modal
          isVisible={isPaymentModalVisible}
          hideModal={() => setIsPaymentModalVisible(false)}>
          <PaymentModal
            orderNumber={orderNumber}
            price={paymentSettings?.price}
            hide={() => setIsPaymentModalVisible(false)}
          />
        </Modal>
        <Modal
          isVisible={isSuccesPaymentModalVisible}
          hideModal={() => setIsSuccesPaymentModalVisible(false)}>
          <SuccessModal />
        </Modal>
        <Modal
          isVisible={isNotificationModal}
          hideModal={() => setIsNotificationModal(false)}
          style={styles.modal}>
          <View style={styles.mainModalContainer}>
            <Text style={styles.headline}>{`OBAVJEŠTENJE`}</Text>
            {items.map((item, index) => (
              <Text key={index} style={styles.text}>
                {item}
              </Text>
            ))}

            <Button
              onPress={() => setIsNotificationModal(false)}
              style={styles.button}>
              Close
            </Button>
          </View>
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
  logoContainer: height => ({
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
  contentContainer: {
    paddingTop: HEADER_HEIGHT,
  },
  container: {
    backgroundColor: '#e5f4f9',
    borderRadius: 14,
    padding: 10,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 3,
  },
  message: {
    color: '#005a76',
    paddingRight: 15,
  },
  mainModalContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default Home;
