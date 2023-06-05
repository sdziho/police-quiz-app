/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import React, {
  useCallback, useRef, useState, useEffect, useLayoutEffect,
} from 'react';
import {
  View, StyleSheet, ActivityIndicator, BackHandler, TouchableOpacity, Dimensions, FlatList, ScrollView,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { STATUS_TYPES } from '../utils/constants';
import QuestionItem from './components/QuestionItem';
import ResultsModal from './components/ResultsModal';
import NoData from '../CommonComponents/NoData';
import { shuffle } from '../utils/helpers';
import AdItem from './components/AdItem';
import AdSlider from './components/AdSlider';

const { height, width } = Dimensions.get('screen');

function Questions({ navigation }) {
  const { colors } = useTheme();
  const { data: questionsData, status: questionsStatus } = useSelector(state => state.questions);

  const { data: adsData, status: adsStatus } = useSelector(state => state.ads);

  const [sliderData, setSliderData] = useState([]);
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

    const randomizedAds = shuffle(adsData.filter(item => item?.isQuestionAd)).map(item => ({ ...item, isAd: true }));

    let questionCounter = 0;
    let adCounter = 0;
    const finalData = [];
    let i = 0;
    while (questionCounter < randomizedQuestions.length) {
      if (i && i % 11 === 0) {
        finalData.push(randomizedAds[adCounter++]);
        if (adCounter === randomizedAds.length) {
          adCounter = 0;
        }
      } else if (questionCounter < randomizedQuestions.length) {
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
    return !answeredQuestions ? 0
      : correctAnswers.length / answeredQuestions.length;
  }, [sliderData]);

  const answerQuestion = useCallback(({ answerIndex, questionId }) => {
    const newData = sliderData.map(item => (item?.id === questionId ? {
      ...item, answerIndex, isAnswered: true, isCorrect: item.answers[answerIndex].correctAnswer,
    } : item));
    setSliderData(newData);
  }, [sliderData]);

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

  const scrollToIndex = (index) => {
    flatListRef.current.scrollToIndex({
      animated: true,
      index,
    });
    setActiveIndex(index);
  };

  const onNextPress = useCallback(() => {
    if (activeIndex < sliderData.length) {
      scrollToIndex(activeIndex + 1);
      if (!sliderData[activeIndex + 1]?.isAd) { setQuestionIndex(questionIndex + 1); }
    }
  }, [activeIndex, questionIndex, sliderData]);

  const onPreviousPress = useCallback(() => {
    if (activeIndex >= 1) {
      scrollToIndex(activeIndex - 1);
      if (!sliderData[activeIndex - 1]?.isAd) { setQuestionIndex(questionIndex - 1); }
    }
  }, [activeIndex, questionIndex, sliderData]);

  const onFinishPress = () => {
    setIsResultsVisible(true);
  };

  const hideResultModal = useCallback(() => {
    setIsResultsVisible(false);
  }, []);

  const onBackPress = useCallback(() => {
    if (questionsData && questionsData.length) {
      setIsResultsVisible(true);
    } else {
      navigation.pop();
    }
  }, [questionsData, navigation]);

  const isLoading = questionsStatus === STATUS_TYPES.PENDING || adsStatus === STATUS_TYPES.PENDING;

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(({ item }) => (item?.isAd ? (
    <AdItem
      item={item}
    />
  ) : (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <QuestionItem
        item={item}
        answerQuestion={answerQuestion}
      />
    </ScrollView>
  )), [answerQuestion]);

  const getItemLayout = useCallback((_, index) => ({
    length: width,
    offset: width * index,
    index,
  }), []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: questionsData ? `Pitanje ${questionIndex + 1}/${questionsData.length}` : '',
      headerLeft: (props) => (
        <TouchableOpacity
          {...props}
          style={styles.backButton}
          onPress={onBackPress}
        >
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
    <View
      style={styles.mainContainer(colors.surface)}
    >
      { isLoading ? (
        <ActivityIndicator
          size="large"
          style={{ flex: 1 }}
          color={colors.primary}
        />
      )
        : (
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
              ListEmptyComponent={() => (<NoData />)}
              initialNumToRender={5}
              windowSize={10}
              maxToRenderPerBatch={10}
              scrollEventThrottle={100}
            />
            <View
              style={styles.footer}
            >
              <View
                style={styles.navigationContainer}
              >
                {activeIndex > 0 ? (
                  <Button
                    onPress={onPreviousPress}
                  >
                    Nazad
                  </Button>
                ) : <View />}
                {activeIndex < sliderData.length - 1 ? (
                  <Button
                    onPress={onNextPress}
                  >
                    Dalje
                  </Button>
                ) : null}
                {activeIndex === sliderData.length - 1 ? (
                  <Button
                    onPress={onFinishPress}
                  >
                    Završi
                  </Button>
                ) : null}
              </View>
              {questionsData && questionsData.length ? (
                <AdSlider
                  data={permanentAdsData}
                />
              ) : null}
            </View>
          </>
        )}

      <ResultsModal
        isVisible={isResultsVisible}
        onHide={hideResultModal}
        progress={getResult()}
      />
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
    height: height * 0.15,
  },
  navigationContainer: {
    flexDirection: 'row',
    aligItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    marginLeft: 20,
  },
});

export default Questions;
