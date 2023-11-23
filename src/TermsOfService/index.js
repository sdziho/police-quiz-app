/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import React, {useLayoutEffect} from 'react';
import {Linking, ScrollView, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme, Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';

function TermsOfService({navigation}) {
  const {colors} = useTheme();
  const {paymentSettings} = useSelector(state => state.settings.data) ?? {};
  return (
    <ScrollView contentContainerStyle={styles.contentContainer(colors.surface)}>
      <Text>{paymentSettings?.termsOfConditions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: backgroundColor => ({
    padding: 20,
    backgroundColor,
  }),
  text: {
    fontSize: 16,
  },
  backButton: {
    marginLeft: 20,
  },
});

export default TermsOfService;
