/* eslint-disable func-names */
import React from 'react';
import {
  View, Modal, TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';

export default function ({
  isVisible,
  hideModal,
  children,
}) {
  const { colors } = useTheme();
  return (
    <Modal animationType="slide" transparent visible={isVisible}>
      <TouchableOpacity
        onPress={hideModal}
        activeOpacity={1}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          disabled
          style={{
            width: '80%',
            backgroundColor: colors.surface,
            padding: 20,
            elevation: 10,
            shadowOpacity: 0.2,
            shadowOffset: {
              height: 2,
            },
            borderRadius: 5,
          }}
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
