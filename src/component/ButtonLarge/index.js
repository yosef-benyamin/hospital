import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLOR_BLUE} from '../Constant';

export const ButtonLarge = ({onPress, text, styleButton}) => (
  <TouchableOpacity
    style={[styles.buttonLanding, styleButton]}
    onPress={onPress}>
    <Text style={styles.textBtnLanding}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonLanding: {
    backgroundColor: COLOR_BLUE,
    padding: 6,
    borderRadius: 10,
    width: '100%',
    marginVertical: 8,
  },
  textBtnLanding: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    padding: 10,
  },
});

export default ButtonLarge;
