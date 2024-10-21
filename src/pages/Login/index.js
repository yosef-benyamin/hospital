import {getDatabase, ref} from 'firebase/database';
import React, {Component} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {firebaseInit} from '../../config/firebaseInit';
import {ButtonLarge} from '../../component/ButtonLarge';
import {MMKV} from 'react-native-mmkv';
import {getEmployee} from '../../utils';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idno: '',
      password: '',
    };
  }

  componentDidMount = () => {
    ref(getDatabase(firebaseInit));
  };

  onLogin = async () => {
    const storage = new MMKV();
    const {idno, password} = this.state;
    if (idno !== '' && password !== '') {
      const snapshot = await getEmployee(idno);
      if (snapshot.exists()) {
        if (Object.values(snapshot.val())[0].password === password) {
          storage.set('employee', JSON.stringify(snapshot.val()));
          if (Object.values(snapshot.val())[0].role === 'admin') {
            this.props.navigation.navigate('TabAdmin', {
              screen: 'TabHome',
              params: Object.values(snapshot.val())[0],
            });
          } else {
            this.props.navigation.navigate('TabScreen', {
              screen: 'TabHome',
              params: Object.values(snapshot.val())[0],
            });
          }
        } else {
          Alert.alert('ID atau Password salah');
        }
      } else {
        Alert.alert('ID atau Password salah');
        console.log('No Data Available');
      }
    } else {
      console.log('password belum ada');
    }
  };

  onChangeText = (stateName, value) => {
    this.setState({[stateName]: value});
  };

  render() {
    return (
      <ScrollView>
        <Image
          source={require('../../../assets/hospital.png')}
          style={styles.image}
        />
        <View style={styles.viewContent}>
          <Text style={styles.textTitle}>Selamat Datang!</Text>
          <TextInput
            style={styles.textLogin}
            placeholder="NIP"
            placeholderTextColor="grey"
            onChangeText={value => this.onChangeText('idno', value)}
          />
          <TextInput
            style={styles.textLogin}
            placeholder="Password"
            placeholderTextColor="grey"
            onChangeText={value => this.onChangeText('password', value)}
            secureTextEntry
          />
          <ButtonLarge onPress={this.onLogin} text={'Masuk'} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 380,
    height: 380,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textTitle: {
    color: 'black',
    fontWeight: '900',
    fontSize: 24,
  },
  viewContent: {
    padding: 30,
  },
  textLogin: {
    borderWidth: 1,
    marginVertical: 14,
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: '100%',
    color: 'black',
  },
});
