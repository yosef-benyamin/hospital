import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLOR_BLUE, COLOR_RED} from '../Constant';

export class SmallCard extends Component {
  handleColor() {
    let viewInnerCard = styles.viewInnerCard;
    let textCardBold = styles.textCardBold;
    switch (this.props.color) {
      case 'red':
        viewInnerCard = [viewInnerCard, styles.borderRed];
        textCardBold = [textCardBold, styles.colorRed];
        break;
      case 'blue':
        viewInnerCard = [viewInnerCard, styles.borderBlue];
        textCardBold = [textCardBold, styles.colorBlue];
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
  borderBlue: {
    borderColor: COLOR_BLUE,
  },
  colorBlue: {
    color: COLOR_BLUE,
  },
  viewInnerCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textCardBold: {
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default SmallCard;
