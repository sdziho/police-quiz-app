/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import React, {useCallback} from 'react';
import {StyleSheet, Dimensions, TouchableOpacity, View} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import CircularProgress from 'react-native-circular-progress-indicator';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const {width, height} = Dimensions.get('window');
function QuestionItem({item, answerQuestion, number, questionsSize}) {
  const {question, answers, isAnswered, id, answerIndex, isCorrect} =
    item ?? {};
  const {colors} = useTheme();
  console.log(number, questionsSize);
  const AnswerButton = useCallback(
    ({item, index}) => {
      const borderColor = (() => {
        if (isAnswered) {
          return answerIndex === index
            ? isCorrect
              ? colors.accent
              : colors.error
            : answers[index].correctAnswer
            ? colors.accent
            : colors.backdrop;
        }
        return colors.backdrop;
      })();

      const backgroundColor = (() => {
        if (isAnswered) {
          return answerIndex === index
            ? isCorrect
              ? colors.darkerShade
              : colors.error
            : answers[index].correctAnswer
            ? colors.accent
            : 'white';
        }
        return 'white';
      })();

      const onPress = () => {
        answerQuestion({answerIndex: index, questionId: id});
      };

      return (
        <TouchableOpacity
          disabled={isAnswered}
          onPress={onPress}
          style={{...styles.answerButton(borderColor), backgroundColor}}>
          <Text style={styles.answerText}>{item?.answer}</Text>
        </TouchableOpacity>
      );
    },
    [
      answerIndex,
      answerQuestion,
      answers,
      colors.accent,
      colors.backdrop,
      colors.error,
      id,
      isAnswered,
      isCorrect,
    ],
  );

  return (
    <View
      style={styles.mainContainer}
      // contentContainerStyle={styles.contentContainer}
      // showsVerticalScrollIndicator={false}
    >
      <View style={styles.textWrapper}>
        <Text style={styles.questionText}>{question}</Text>
        <AnimatedCircularProgress
          style={styles.circle}
          rotation={0}
          size={40}
          width={7}
          fill={(number / questionsSize) * 100}
          tintColor={colors.primary}
          backgroundColor="lightgray">
          {fill => <Text>{number}</Text>}
        </AnimatedCircularProgress>
      </View>
      {answers &&
        answers.map((item, index) => (
          <AnswerButton item={item} index={index} />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width,
    padding: 20,
  },
  contentContainer: {
    paddingBottom: height * 0.15,
  },
  textWrapper: {
    display: 'flex',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 3,
    paddingVertical: 25,
    marginBottom: 40,
  },
  questionText: {
    textAlign: 'center',
    fontSize: 18,
  },
  answerButton: borderColor => ({
    borderRadius: 50,
    borderColor,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 8,
  }),
  answerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  badge: color => ({
    color, // Set text color
    fontWeight: 'bold',
  }),
  circle: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 20,
    bottom: -15,
  },
});

export default QuestionItem;
