import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {useTheme, Text, Button} from 'react-native-paper';
import * as Progress from 'react-native-progress';
import {useDispatch} from 'react-redux';
import {setSelectedCategory} from '../../Home/categoriesSlice';

function ResultsModal({isVisible, progress, onHide, params}) {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onButtonPress = () => {
    onHide();
    setTimeout(() => {
      dispatch(setSelectedCategory(params));
    }, 200);
    setTimeout(() => {
      navigation.replace('MainTab');
    }, 100);
  };
  //console.log(progress);
  return (
    <Modal transparent visible={isVisible} animationType="slide">
      <TouchableOpacity
        onPress={onHide}
        activeOpacity={1}
        style={styles.mainContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.contentContainer(colors.surface)}>
          {isVisible && (
            <Progress.Circle
              progress={progress || 0}
              size={200}
              color={colors.primary}
              animated={false}
              borderWidth={2}
              thickness={10}
              showsText
            />
          )}

          <Text style={styles.detailsText}>
            Rezultat iznad označava postotak tačnih odgovora na već odgovorena
            pitanja.
          </Text>

          {/* <Text
            style={styles.resultText}
          >
            Rezultat
          </Text> */}

          <Button
            onPress={onButtonPress}
            mode="contained"
            style={styles.button}>
            Nazad na kategorije
          </Button>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: backgroundColor => ({
    width: '100%',
    backgroundColor,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  }),
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsText: {
    marginVertical: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
  resultText: {
    position: 'absolute',
    alingSelft: 'center',
  },
});

export default ResultsModal;
