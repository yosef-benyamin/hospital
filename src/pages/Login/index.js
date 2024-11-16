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
import {ButtonLarge} from '../../component/ButtonLarge';
import {MMKV} from 'react-native-mmkv';
import {getEmployeeByIDPass} from '../../firestore/Login';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idno: '',
      password: '',
    };
  }

  onLogin = async () => {
    const storage = new MMKV();
    let employee = {};
    const {idno, password} = this.state;
    if (idno !== '' && password !== '') {
      const employees = await getEmployeeByIDPass(idno, password);
      employees.forEach(emp => {
        employee = {...emp.data(), ...{key: emp.id}};
      });
      if (Object.keys(employee).length) {
        storage.set('employee', JSON.stringify(employee));
        if (employee.Role === 'spv') {
          this.props.navigation.navigate('TabAdmin', {
            screen: 'TabHome',
            params: employee,
          });
        } else {
          this.props.navigation.navigate('TabScreen', {
            screen: 'TabHome',
            params: employee,
          });
        }
      } else {
        Alert.alert('ID atau Password salah');
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
