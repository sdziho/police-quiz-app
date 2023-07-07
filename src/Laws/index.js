/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-unescaped-entities */
import React, {useLayoutEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme, Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Linkify from 'react-linkify';
import HyperlinkedText from 'react-native-hyperlinked-text';
function Laws({navigation, route}) {
  const {law} = route.params;

  const {colors} = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <TouchableOpacity
          {...props}
          style={styles.backButton}
          onPress={() => navigation.pop()}>
          <MaterialIcons name="arrow-back" size={25} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer(colors.surface)}>
      <HyperlinkedText style={styles.text}>{law}</HyperlinkedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: backgroundColor => ({
    flex: 1,
    padding: 20,
    backgroundColor,
  }),

  text: {
    fontSize: 16,
  },
  backButton: {
    marginLeft: 20,
  },

  text: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default Laws;
