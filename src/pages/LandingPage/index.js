import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ButtonLarge} from '../../component/ButtonLarge';

export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idno: '',
      name: '',
      password: '',
      confirmPassword: '',
    };
  }

  handleLogin = () => {
    this.props.navigation.navigate('Login');
  };

  handleHome = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <Image
          source={require('../../../assets/hospital.png')}
          style={styles.image}
        />
        <View style={styles.viewContent}>
          <Text style={styles.textTitle}>
            RUMAH SAKIT UMUM DAERAH HAMBA BATANGHARI
          </Text>
          <ButtonLarge onPress={this.handleLogin} text={'Login'} />
          <ButtonLarge onPress={this.handleHome} text={'Beranda'} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  image: {
    width: 380,
    height: 380,
    resizeMode: 'contain',
  },
  textTitle: {
    color: 'black',
    fontWeight: '900',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 14,
  },
  viewContent: {
    padding: 30,
    width: '100%',
  },
});
