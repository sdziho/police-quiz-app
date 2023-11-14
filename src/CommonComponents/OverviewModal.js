/* eslint-disable func-names */
import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ImageBackground,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Text, useTheme} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ({
  isVisible,
  hideModal,
  children,
  title = '',
  imageVisible = true,
  subtitle = '',
  headerImage,
}) {
  const {colors} = useTheme();
  const image = {uri: 'https://legacy.reactjs.org/logo-og.png'};
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={hideModal}>
      <ScrollView style={styles.modalView(colors.background)}>
        <View style={styles.buttonClose}>
          <Pressable onPress={hideModal}>
            <Ionicons name="close" size={25} color={'white'} />
          </Pressable>
        </View>
        {imageVisible && (
          <View style={styles.imageWrapper}>
            <ImageBackground
              source={{uri: headerImage ?? image.uri}}
              style={styles.backgroundImage}></ImageBackground>
            <Text style={styles.headingTitle}>{title}</Text>
            <Text style={styles.headingSubtitle}>{subtitle}</Text>
          </View>
        )}
        <View style={styles.child}>{children}</View>
      </ScrollView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalView: backgroundColor => ({
    backgroundColor,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '100%',
  }),
  buttonClose: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    zIndex: 1,
  },
  imageWrapper: {
    display: 'flex',
    backgroundColor: 'white',
    height: 400,
    width: '100%',
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
  backgroundImage: {
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  headingTitle: {
    fontSize: 22,
    paddingLeft: 20,
    paddingBottom: 5,
  },
  headingSubtitle: {
    fontSize: 14,
    paddingLeft: 20,
    color: 'grey',
  },
  child: {
    padding: 30,
    justifyContent: 'center',
  },
});
