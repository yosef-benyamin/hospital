import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLOR_GREEN_PRIMARY, COLOR_RED} from '../Constant';

export class SmallCard extends Component {
  handleColor() {
    let viewInnerCard = styles.viewInnerCard;
    let textCardBold = styles.textCardBold;
    switch (this.props.color) {
      case 'red':
        viewInnerCard = [viewInnerCard, styles.borderRed];
        textCardBold = [textCardBold, styles.colorRed];
        break;
      case 'green':
        viewInnerCard = [viewInnerCard, styles.borderGreen];
        textCardBold = [textCardBold, styles.colorGreen];
        break;
      default:
        break;
    }
    return {viewInnerCard, textCardBold};
  }

  render() {
    const {viewInnerCard, textCardBold} = this.handleColor();
    return (
      <View style={viewInnerCard}>
        <Text style={textCardBold}>{this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  borderRed: {
    borderColor: COLOR_RED,
  },
  colorRed: {
    color: COLOR_RED,
  },
  borderGreen: {
    borderColor: COLOR_GREEN_PRIMARY,
  },
  colorGreen: {
    color: COLOR_GREEN_PRIMARY,
  },
  viewInnerCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '25%',
  },
  textCardBold: {
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'capitalize',
    textAlign: 'center',
    fontSize: 11,
  },
});

export default SmallCard;
