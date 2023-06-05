/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-unescaped-entities */
import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme, Text } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function About({ navigation }) {
  const { colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <TouchableOpacity
          {...props}
          style={styles.backButton}
          onPress={() => navigation.pop()}
        >
          <MaterialIcons name="arrow-back" size={25} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer(colors.surface)}>
      <Text style={{ ...styles.text, fontWeight: 'bold' }}>
        Obrtnička djelatnost "NEA"
      </Text>
      <Text style={styles.text}>
        ID broj: 4303708640007
      </Text>
      <Text style={styles.text}>
        Adresa: Gradačačka 118, Sarajevo, BiH
      </Text>
      <Text style={styles.text}>
        Broj telefona: +38761809244
      </Text>
      <Text style={styles.text}>
        Email: policequizbih@gmail.com
      </Text>
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
});

export default About;
