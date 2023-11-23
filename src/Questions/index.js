/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
  ImageBackground,
  Modal,
  Pressable,
  Linking,
} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {STATUS_TYPES} from '../utils/constants';
import QuestionItem from './components/QuestionItem';
import ResultsModal from './components/ResultsModal';
import NoData from '../CommonComponents/NoData';
import {shuffle} from '../utils/helpers';
import AdItem from './components/AdItem';
import AdSlider from './components/AdSlider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {setFirestoreUser} from '../Welcome/userSlice';

const {height, width} = Dimensions.get('screen');

function Questions({navigation, route}) {
  const {colors} = useTheme();
  const {data: questionsData, status: questionsStatus} = useSelector(
    state => state.questions,
  );
  const {data: adsData, status: adsStatus} = useSelector(state => state.ads);
  const randomizedAds = shuffle(
    adsData?.filter(item => item?.isQuestionAd) ?? [],
  ).map(item => ({...item, isAd: true}));
  const user = useSelector(state => state.user.data);
  const dispatch = useDispatch();
  const [sliderData, setSliderData] = useState([]);
  const [openAddModal, setOpenAdModal] = useState(null);
  const [permanentAdsData, setPermanentAdsData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  const getPermanentAdsData = useCallback(() => {
    if (!adsData) return;

    return shuffle(adsData.filter(item => item?.isPermanentAd));
  }, [adsData]);

  const getSliderData = useCallback(() => {
    if (!questionsData || !adsData) return [];

    const randomizedQuestions = shuffle(questionsData);

    let questionCounter = 0;
    let adCounter = 0;
    const finalData = [];
    let i = 0;
    while (questionCounter < randomizedQuestions.length) {
      /* if (i && i % 11 === 0) {
        finalData.push(randomizedAds[adCounter++]);
        if (adCounter === randomizedAds.length) {
          adCounter = 0;
        }
      } else  */
      if (questionCounter < randomizedQuestions.length) {
        finalData.push(randomizedQuestions[questionCounter++]);
      }
      i++;
    }
    return finalData;
  }, [adsData, questionsData]);

  const getResult = useCallback(() => {
    if (!sliderData) return 0;

    const answeredQuestions = sliderData.filter(item => item?.isAnswered);
    const correctAnswers = answeredQuestions.filter(item => item?.isCorrect);
    return !answeredQuestions
      ? 0
      : correctAnswers.length / answeredQuestions.length;
  }, [sliderData]);

  const answerQuestion = useCallback(
    ({answerIndex, questionId}) => {
      const newData = sliderData.map(item =>
        item?.id === questionId
          ? {
              ...item,
              answerIndex,
              isAnswered: true,
              isCorrect: item.answers[answerIndex].correctAnswer,
            }
          : item,
      );
      setSliderData(newData);
    },
    [sliderData],
  );

  // const onScroll = useCallback((event) => {
  //   const slideSize = event.nativeEvent.layoutMeasurement.width;
  //   const index = event.nativeEvent.contentOffset.x / slideSize;
  //   const roundIndex = Math.round(index);
  //   console.log({ roundIndex, questionIndex });
  //   if (!sliderData[roundIndex]?.isAd) {
  //     if (roundIndex > questionIndex) { setQuestionIndex(questionIndex + 1); } else { setQuestionIndex(questionIndex - 1); }
  //   }
  //   setActiveIndex(roundIndex);
  // }, [questionIndex, sliderData]);

  const flatListRef = useRef(null);

  const scrollToIndex = index => {
    flatListRef.current.scrollToIndex({
      animated: true,
      index,
    });
    setActiveIndex(index);
  };

  const onNextPress = useCallback(() => {
    if ((activeIndex + 1) % 10 === 0) {
      const randomNumber = Math.floor(Math.random() * randomizedAds.length);
      setOpenAdModal(randomizedAds[randomNumber]);
    }
    if (activeIndex < sliderData.length) {
      scrollToIndex(activeIndex + 1);
      if (!sliderData[activeIndex + 1]?.isAd) {
        setQuestionIndex(prevValue => prevValue + 1);
      }
    }
  }, [activeIndex, questionIndex, sliderData]);

  const onPreviousPress = useCallback(() => {
    if (activeIndex >= 1) {
      scrollToIndex(activeIndex - 1);
      if (!sliderData[activeIndex - 1]?.isAd) {
        setQuestionIndex(prevValue => prevValue - 1);
      }
    }
  }, [activeIndex, questionIndex, sliderData]);

  const onFinishPress = () => {
    console.log(
      'zavrsavam test',
      getResult() * 100 || 0,
      route.params.testName,
    );
    let tests = user?.testHistory ?? [];
    if (tests.length >= 100) tests.splice(99);
    dispatch(
      setFirestoreUser({
        testHistory: [
          {
            name: route.params.testName,
            result: getResult() * 100 || 0,
            date: new Date(),
          },
          ...tests,
        ],
      }),
    );
    setIsResultsVisible(true);
  };

  const hideResultModal = useCallback(() => {
    setIsResultsVisible(false);
  }, []);

  const onBackPress = useCallback(() => {
    if (questionsData && questionsData.length) {
      setIsResultsVisible(true);
    } else {
      navigation.replace('MainTab');
    }
  }, [questionsData, navigation]);

  const isLoading =
    questionsStatus === STATUS_TYPES.PENDING ||
    adsStatus === STATUS_TYPES.PENDING;

  const keyExtractor = useCallback(item => {
    return item?.id;
  }, []);
  const renderItem = useCallback(
    ({item}) => {
      return item?.isAd ? (
        <AdItem item={item} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <QuestionItem
            item={item}
            answerQuestion={answerQuestion}
            number={questionIndex + 1}
            questionsSize={questionsData.length}
          />
        </ScrollView>
      );
    },
    [answerQuestion, questionIndex],
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <TouchableOpacity
          {...props}
          style={styles.backButton}
          onPress={onBackPress}>
          <MaterialIcons name="arrow-back" size={25} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [questionsData, navigation, onBackPress, questionIndex]);

  useEffect(() => {
    const backAction = () => {
      if (questionsData && questionsData.length) {
        setIsResultsVisible(true);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [questionsData]);

  useLayoutEffect(() => {
    setSliderData(getSliderData());
    setPermanentAdsData(getPermanentAdsData());
  }, [getPermanentAdsData, getSliderData]);

  return (
    <View style={styles.mainContainer(colors.surface)}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          style={{flex: 1}}
          color={colors.primary}
        />
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={sliderData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            initialScrollIndex={0}
            getItemLayout={getItemLayout}
            showsHorizontalScrollIndicator={false}
            // onMomentumScrollEnd={onScroll}
            ListEmptyComponent={() => <NoData />}
            initialNumToRender={5}
            windowSize={10}
            maxToRenderPerBatch={10}
            scrollEventThrottle={100}
          />
          <View style={styles.footer}>
            <View style={styles.navigationContainer}>
              {activeIndex > 0 ? (
                <TouchableOpacity
                  onPress={onPreviousPress}
                  style={[styles.classicButton(colors.primary)]}>
                  <Ionicons
                    name="chevron-back-sharp"
                    size={20}
                    color={colors.accent}
                  />
                  <Button>Nazad</Button>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              {activeIndex < sliderData.length - 1 ? (
                <TouchableOpacity
                  onPress={onNextPress}
                  style={[styles.classicButton(colors.primary)]}>
                  <Button>Dalje</Button>
                  <Ionicons
                    name="chevron-forward-sharp"
                    size={20}
                    color={colors.accent}
                  />
                </TouchableOpacity>
              ) : null}
              {activeIndex === sliderData.length - 1 ? (
                <Button
                  onPress={onFinishPress}
                  style={styles.finishButton(colors.primary)}>
                  <Text style={{color: 'white'}}>Završi</Text>
                </Button>
              ) : null}
            </View>
            {questionsData && questionsData.length ? (
              <AdSlider data={permanentAdsData} />
            ) : null}
          </View>
        </>
      )}

      <ResultsModal
        isVisible={isResultsVisible}
        onHide={hideResultModal}
        progress={getResult()}
        name={route.params.testName}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={openAddModal !== null}
        onRequestClose={() => {
          setOpenAdModal(null);
        }}>
        <View style={styles.buttonClose}>
          <Pressable
            onPress={() => {
              setOpenAdModal(null);
            }}>
            <Ionicons name="close" size={25} color={'white'} />
          </Pressable>
        </View>
        <View style={styles.imageWrapper}>
          <ImageBackground
            source={{uri: openAddModal?.imageQuestion.src}}
            style={styles.backgroundImage}></ImageBackground>
          <View style={styles.adNameWrapper}>
            <Text style={styles.adName}>{openAddModal?.name}</Text>
          </View>
          <View style={styles.moreButton}>
            <Button
              style={styles.viewButton}
              onPress={() => {
                Linking.openURL(openAddModal?.reddirectUrl ?? '');
              }}>
              VIDI VIŠE
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: backgroundColor => ({
    flex: 1,
    backgroundColor,
  }),
  contentContainer: {
    // width,
  },
  footer: {
    height: height * 0.25,
  },
  adNameWrapper: {
    flex: 1,
    justifyContent: 'flex-start', // align to the top
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
  },
  adName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowOffset: {width: 2, height: 2},
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowRadius: 5,
  },
  viewButton: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  moreButton: {
    flex: 1,
    justifyContent: 'flex-end', // align to the bottom
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    aligItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    marginLeft: 20,
  },
  imageWrapper: {
    height: '100%',
    width: '100%',
    display: 'flex',
    backgroundColor: 'white',
    overflow: 'hidden',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonClose: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    zIndex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  finishButton: borderColor => ({
    color: 'white',
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: borderColor,
  }),
  classicButton: borderColor => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor,
    paddingHorizontal: 20,
  }),
});

export default Questions;
