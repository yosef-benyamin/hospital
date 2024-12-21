import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {handleDate} from '../../utils';
import SmallCard from '../../component/SmallCard';

export default class DetailSchedule extends Component {
  handleRenderName() {
    return (
      <View style={styles.viewTable}>
        <View style={styles.viewName}>
          <Text style={styles.textNameBold}>NIP</Text>
          <Text style={styles.textNameBold}>Nama</Text>
        </View>

        {Object.entries(this.props.route.params.value)
          .sort(([, namA], [, namB]) => namA.localeCompare(namB))
          .map(([key, value]) => {
            return (
              <View key={key} style={styles.viewName}>
                <Text style={styles.textName}>{key}</Text>
                <Text style={styles.textName}>{value}</Text>
              </View>
            );
          })}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.textTitleBold}>
          {handleDate(this.props.route.params.date)}
        </Text>
        <SmallCard text={this.props.route.params.shift} color="green" />
        {this.handleRenderName()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  textTitleBold: {
    fontWeight: 'bold',
    color: '#000000',
    padding: 30,
  },
  viewTable: {
    marginVertical: 20,
  },
  viewName: {
    flexDirection: 'row',
    width: '70%',
  },
  textNameBold: {
    width: '50%',
    padding: 4,
    color: '#000000',
    fontWeight: 'bold',
  },
  textName: {
    width: '50%',
    padding: 4,
    color: '#000000',
  },
});
