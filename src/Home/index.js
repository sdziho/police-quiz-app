/* eslint-disable no-shadow */
/* eslint-disable react/no-unstable-nested-components */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useTheme, ActivityIndicator, Text, Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Modal from '../CommonComponents/Modal';
import {resetAds} from '../Questions/adsSlice';
import {resetQuestions} from '../Questions/questionsSlice';
import {STATUS_TYPES} from '../utils/constants';
import {randomIntFromInterval, replaceAll} from '../utils/helpers';
import {setFirestoreUser} from '../Welcome/userSlice';
import {getCategories} from './categoriesSlice';
import {getSubcategories} from './subcategoriesSlice';
import PaymentModal from './components/PaymentModal';
import UpdateModal from './components/UpdateModal';
import SuccessModal from './components/SuccessModal';
import {getSettings} from '../Settings/settingsSlice';
import {getNotifications} from '../Notifications/notificationsSlice';
import {default as versionInfo} from '../../version.json';

import HomeCard from './components/HomeCard';
import {ScrollView} from 'react-native-gesture-handler';
import {getKonkursi} from './konkursiSlice';
import SwiperFlatList from 'react-native-swiper-flatlist';
import LinearGradient from 'react-native-linear-gradient';

const {height} = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;

function Home({navigation, route}) {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const {data, status} = useSelector(state => state.categories) ?? {};
  const cardsData = useSelector(state => state.konkursi.data);
  const user = useSelector(state => state.user.data);
  const konkursi = cardsData?.konkursi ?? [];
  const sprema = cardsData?.fizicka_sprema ?? [];
  const ishrana = cardsData?.plan_ishrane ?? [];
  const video = cardsData?.video ?? [];

  const {paymentSettings} = useSelector(state => state.settings.data) ?? {};
  const {isPremium, id} = user ?? {};
  const slideImages = paymentSettings?.images ?? [];
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
      if (status?.length > 0) {
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

  useEffect(() => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const oneMonthInSeconds = 30 * 24 * 60 * 60; // 30 days * 24 hours * 60 minutes * 60 seconds * 3 months

    const expired = nowInSeconds > user?.paymentDetails?.expiresAt?.seconds;
    if (!user?.paymentDetails?.expiresAt && isPremium) {
      let dateExpires = new Date(0);
      dateExpires.setUTCSeconds(nowInSeconds + oneMonthInSeconds);
      dispatch(
        setFirestoreUser({
          paymentDetails: {
            expiresAt: dateExpires,
          },
        }),
      );
    } else if (expired) {
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
    dispatch(
      getKonkursi({
        collections: ['konkursi', 'fizicka_sprema', 'plan_ishrane'],
      }),
    );
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
      const monthInSeconds = 30 * 24 * 60 * 60;
      const nowInSeconds = Math.floor(Date.now() / 1000);
      let expiresAt = nowInSeconds;

      if (match[1] === 'price30') expiresAt = expiresAt + monthInSeconds;
      if (match[1] === 'price60') expiresAt = expiresAt + monthInSeconds * 2;
      if (match[1] === 'price90') expiresAt = expiresAt + monthInSeconds * 3;

      let dateExpires = new Date(0);
      dateExpires.setUTCSeconds(expiresAt);
      dispatch(
        setFirestoreUser({
          isPremium: true,
          paymentDetails: {
            orderNumber,
            createdAt: new Date(),
            categories,
            expiresAt: dateExpires,
          },
        }),
      );
      navigation.setParams({status: null});
      setIsSuccesPaymentModalVisible(true);
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

  /* useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <UserButton />,
      headerLeft: () => <MenuButton onPress={toggleMenu} />,
    });
  }, [navigation, toggleMenu]); */

  const onFocus = useCallback(() => {
    dispatch(resetQuestions());
    dispatch(resetAds());
  }, [dispatch]);

  useFocusEffect(onFocus);

  useEffect(() => {
    if (!isPremium) {
      //pogkedat kad se runa na androidu

      const timer = setInterval(() => {
        setIsPaymentModalVisible(true);
      }, 1000 * 60 * 2);
      return () => clearInterval(timer);
    }
  }, [isPremium, isPaymentModalVisible]);

  let filteredData = data ? [...data] : [];

  filteredData?.sort((a, b) => {
    if ('order' in a && 'order' in b) {
      return a?.order - b?.order;
    } else if (a?.order) {
      return -1;
    } else if (b?.order) {
      return 1;
    }
    return 0;
  });
  const drzavni = filteredData.filter(element => element?.isDrzavni);
  const image = {uri: 'https://legacy.reactjs.org/logo-og.png'};

  return (
    <>
      <View style={styles.mainContainer(colors.surface)}>
        <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />

        {isLoading && data ? (
          <ActivityIndicator
            style={{flex: 1, paddingTop: HEADER_HEIGHT}}
            size="small"
          />
        ) : (
          <ScrollView style={{backgroundColor: colors.background}}>
            {slideImages.length > 0 && (
              <View style={styles.imageWrapper}>
                <SwiperFlatList
                  style={{backgroundColor: colors.background}}
                  data={slideImages}
                  autoplay
                  autoplayDelay={5}
                  autoplayLoop
                  renderItem={({item}) => (
                    <TouchableOpacity style={[styles.child, styles.shadowBox]}>
                      <ImageBackground
                        source={{uri: item}}
                        style={styles.backgroundImage}>
                        <Text style={styles.insideSwiper}>{item.name}</Text>
                        <LinearGradient
                          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']}
                          style={styles.gradientOverlay}
                        />
                      </ImageBackground>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            <HomeCard
              data={filteredData.filter(element => !element?.isDrzavni)}
              title="Kategorije"
              key="Kategorije"
            />
            {drzavni.length > 0 && (
              <HomeCard
                data={drzavni}
                title="Državni ispiti"
                key="Državni ispiti"
              />
            )}
            <HomeCard data={filteredData} title={'Test'} key="Test" />
            <HomeCard data={filteredData} title="Zakoni" key="Zakon" />
            {konkursi.length > 0 && (
              <HomeCard
                data={konkursi}
                title="Aktuelni konkursi"
                key="Aktuelni konkursi"
              />
            )}
            {sprema.length > 0 && (
              <HomeCard
                data={sprema}
                title="Video fizičke spreme"
                key="Video fizičke spreme"
              />
            )}
            <HomeCard
              data={filteredData}
              title="Uplata premium paketa"
              key="Uplata premium paketa"
            />
            {video.length > 0 && (
              <HomeCard
                data={video}
                title="Priprema fizičke spreme"
                key="Priprema fizičke spreme"
              />
            )}
            {ishrana.length > 0 && (
              <HomeCard
                data={ishrana}
                title="Plan ishrane"
                key="Plan ishrane"
              />
            )}
          </ScrollView>
        )}
        <Modal
          isVisible={paymentSettings?.deprecatedVersions?.includes(
            versionInfo.version,
          )}>
          <UpdateModal />
        </Modal>
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
          hideModal={() => {
            setIsSuccesPaymentModalVisible(false);
            navigation.navigate('MainTab');
          }}>
          <SuccessModal />
        </Modal>
        <Modal
          isVisible={isNotificationModal}
          hideModal={() => setIsNotificationModal(false)}
          style={styles.modal}>
          <View style={styles.mainModalContainer}>
            <Text style={styles.headline}>{`OBAVJEŠTENJE`}</Text>
            {items?.map((item, index) => (
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
    </>
  );
}
const {width} = Dimensions.get('window');

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
  child: {
    width: width * 0.9,
    justifyContent: 'center',
    margin: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 10,
  },
  imageWrapper: {
    height: 250,
    flex: 1,
    backgroundColor: 'white',
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
