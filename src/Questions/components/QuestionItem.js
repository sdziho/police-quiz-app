/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
import React, { useCallback } from 'react';
import {
  StyleSheet, Dimensions, TouchableOpacity, View,
} from 'react-native';
import { useTheme, Text } from 'react-native-paper';

const { width, height } = Dimensions.get('window');
function QuestionItem({ item, answerQuestion }) {
  const {
    question, answers, isAnswered, id, answerIndex, isCorrect,
  } = item ?? {};
  const { colors } = useTheme();

  const AnswerButton = useCallback(({ item, index }) => {
    const borderColor = (() => {
      if (isAnswered) {
        return answerIndex === index ? isCorrect ? colors.accent : colors.error : answers[index].correctAnswer ? colors.accent : colors.backdrop;
      }
      return colors.backdrop;
    })();

    const backgroundColor = (() => {
      if (isAnswered) {
        return answerIndex === index ? isCorrect ? colors.accent : colors.error : answers[index].correctAnswer ? colors.accent : 'transparent';
      }
      return 'transparent';
    })();

    const onPress = () => {
      answerQuestion({ answerIndex: index, questionId: id });
    };

    return (
      <TouchableOpacity
        disabled={isAnswered}
        onPress={onPress}
        style={{ ...styles.answerButton(borderColor), backgroundColor }}
      >
        <Text
          style={styles.answerText}
        >
          {item?.answer}
        </Text>
      </TouchableOpacity>
    );
  }, [answerIndex, answerQuestion, answers, colors.accent, colors.backdrop, colors.error, id, isAnswered, isCorrect]);

  return (
    <View
      style={styles.mainContainer}
      // contentContainerStyle={styles.contentContainer}
      // showsVerticalScrollIndicator={false}
    >
      <Text
        style={styles.questionText}
      >
        {question}
      </Text>
      {
        answers && answers.map((item, index) => (<AnswerButton item={item} index={index} />))
    }
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
  questionText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 40,
  },
  answerButton: borderColor => ({
    borderRadius: 5,
    borderColor,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  }),
  answerText: {
    fontSize: 16,
  },
});

export default QuestionItem;
