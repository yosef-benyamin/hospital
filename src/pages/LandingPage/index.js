import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ButtonLarge} from '../../component/ButtonLarge';
import {db} from '../../config/firebaseInit';
import {collection, getDocs} from 'firebase/firestore';
import {
  devBackup,
  resetLeave,
  uploadMockDataToFirestore,
} from '../../firestore/LandingPage';

export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (today.getFullYear() !== yesterday.getFullYear()) {
      const querySnapshot = await getDocs(collection(db, 'employess'));

      try {
        await resetLeave(querySnapshot);
        console.log('Successfully reset leave data');
      } catch (error) {
        console.error('Failed to reset leave data:', error);
      }
    }
  };

  handleLogin = () => {
    this.props.navigation.navigate('Login');
  };

  handleHome = () => {
    this.props.navigation.navigate('Home');
  };

  handleMock = () => {
    // this.props.navigation.navigate('Home');
    console.log('mock data');
    uploadMockDataToFirestore();
  };

  handleBackup = () => {
    // this.props.navigation.navigate('Home');
    console.log('backup data');
    devBackup();
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
          {/* <ButtonLarge onPress={this.handleHome} text={'Beranda'} /> */}
          {/* <ButtonLarge onPress={this.handleMock} text={'Mocking Data'} /> */}
          {/* <ButtonLarge onPress={this.handleBackup} text={'Backup to console'} /> */}
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
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 14,
  },
  viewContent: {
    padding: 30,
    width: '100%',
  },
});
