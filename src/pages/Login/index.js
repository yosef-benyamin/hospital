import {child, get, getDatabase, ref} from 'firebase/database';
import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {firebaseInit} from '../../config/firebaseInit';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idno: '',
      name: '',
      password: '',
      confirmPassword: '',
    };
  }

  onLogin = () => {
    if (this.state.password !== '' && this.state.confirmPassword === '') {
      const db = ref(getDatabase(firebaseInit));
      get(child(db, 'Contact')).then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(item => {
            if (item.val().idno === this.state.idno) {
              if (item.val().password === this.state.password) {
                return console.log('password benar');
              } else {
                return console.log('password salah');
              }
            } else {
            }
          });
        } else {
          console.log('No Data Available');
        }
      });
    } else {
      console.log('password belum ada');
    }
  };

  initApi = () => {
    const db = ref(getDatabase(firebaseInit));
    get(child(db, 'Contact')).then(snapshot => {
      if (snapshot.exists()) {
        snapshot.forEach(item => {
          if (item.val().password && item.val().idno === this.state.idno) {
            console.log('ada passwordnya');
          } else {
            console.log('tidak ada passwordnya');
          }
        });
      } else {
        console.log('No Data Available');
      }
    });
  };

  onChangeText = (stateName, value) => {
    this.setState({[stateName]: value});
  };

  onBlur = value => {
    console.log('value', this.state.idno);
    this.initApi();
  };

  render() {
    return (
      <View>
        <Image
          source={require('../../../assets/login.jpeg')}
          style={styles.image}
        />
        <View style={styles.viewContent}>
          <Text style={styles.textTitle}>Selamat Datang!</Text>
          <TextInput
            style={styles.textLogin}
            placeholder="NIP"
            placeholderTextColor="grey"
            onChangeText={value => this.onChangeText('idno', value)}
            onBlur={() => this.onBlur()}
          />
          <TextInput
            style={styles.textLogin}
            placeholder="Password"
            placeholderTextColor="grey"
            onChangeText={value => this.onChangeText('password', value)}
            secureTextEntry
          />
          <TouchableOpacity style={styles.buttonLogin} onPress={this.onLogin}>
            <Text style={styles.textBtnSubmit}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '50%',
    objectFit: 'contain',
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
  buttonLogin: {
    backgroundColor: '#006FFD',
    padding: 6,
    borderRadius: 10,
    width: '100%',
    marginVertical: 14,
  },
  textBtnSubmit: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    padding: 10,
  },
});