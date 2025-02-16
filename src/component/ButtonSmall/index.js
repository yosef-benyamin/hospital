import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLOR_GREEN_PRIMARY} from '../Constant';

export const ButtonSmall = ({onPress, active, text}) => (
  <TouchableOpacity style={styles.btnStyle} onPress={onPress}>
    <Text style={[styles.buttonActive, !active && styles.buttonNonActive]}>
      {text}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btnStyle: {
    margin: 4,
  },
  buttonActive: {
    backgroundColor: COLOR_GREEN_PRIMARY,
    color: '#FFFFFF',
    width: 100,
    textAlign: 'center',
    borderRadius: 12,
    fontSize: 12,
    height: 36,
    textAlignVertical: 'center',
    fontWeight: '500',
    borderColor: COLOR_GREEN_PRIMARY,
    borderWidth: 1.5,
  },
  buttonNonActive: {
    backgroundColor: '#FFFFFF',
    color: COLOR_GREEN_PRIMARY,
    borderColor: COLOR_GREEN_PRIMARY,
    borderWidth: 1.5,
  },
});
