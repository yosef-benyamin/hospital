import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLOR_BLUE} from '../Constant';

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
    backgroundColor: COLOR_BLUE,
    color: '#FFFFFF',
    width: 100,
    textAlign: 'center',
    borderRadius: 12,
    fontSize: 12,
    padding: 2,
    fontWeight: '500',
    borderColor: COLOR_BLUE,
    borderWidth: 1.5,
  },
  buttonNonActive: {
    backgroundColor: '#FFFFFF',
    color: COLOR_BLUE,
    borderColor: COLOR_BLUE,
    borderWidth: 1.5,
  },
});
