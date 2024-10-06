import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {ModalConfirm} from '../../../component/ModalConfirm';

export default class TabAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  logout = () => {
    this.setState({showModal: true});
  };

  handleRender = () => {
    return (
      <View style={styles.viewRender}>
        <Image
          source={require('../../../../assets/avatar.png')}
          style={styles.image}
        />
        <View style={styles.wrapperText}>
          <Text style={styles.textHugeCenter}>Dian Sastro</Text>
          <Text style={styles.textSmall}>Dokter Anak</Text>
        </View>
        <TouchableOpacity style={styles.btnWrapper}>
          <Text style={styles.textBlack}>Ganti Password</Text>
          <Text style={styles.textBlack}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnWrapper}>
          <Text style={styles.textBlack}>Ubah Jadwal</Text>
          <Text style={styles.textBlack}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnWrapper} onPress={this.logout}>
          <Text style={styles.textBlack}>Keluar</Text>
          <Text style={styles.textBlack}>&gt;</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.textTitleBold}>Akun</Text>
        {this.handleRender()}
        <ModalConfirm
          visible={this.state.showModal}
          negativeButton={() => this.setState({showModal: false})}
          positiveButton={() => this.props.navigation.popToTop()}
        />
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
  viewRender: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  wrapperText: {
    padding: 14,
  },
  textTitleBold: {
    fontWeight: 'bold',
    color: '#000000',
    padding: 30,
  },
  textHugeCenter: {
    fontWeight: '900',
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
  },
  textBlack: {
    color: 'black',
  },
  image: {
    width: 100,
    height: 100,
  },
  textSmall: {
    textAlign: 'center',
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
});