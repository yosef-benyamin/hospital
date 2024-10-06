import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

export const Header = () => (
  <View style={styles.viewContainer}>
    <Image
      source={require('../../../assets/hospital.png')}
      style={styles.image}
    />
    <Text style={styles.textHeader}>RSUD HAMBA BATANGHARI</Text>
  </View>
);

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  image: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    marginRight: 8,
  },
  textHeader: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 26,
    top: 6,
  },
});
