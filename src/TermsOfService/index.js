/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
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
