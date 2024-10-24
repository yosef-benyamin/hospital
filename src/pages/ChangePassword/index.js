import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput, Alert} from 'react-native';
import {ButtonLarge} from '../../component/ButtonLarge';
import {getEmployee, updatePassword} from '../../utils';
import {MMKV} from 'react-native-mmkv';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: {},
      employeeKey: '',
      showCurrentPass: false,
      currentPass: '',
      showNewPass: false,
      newPass: '',
      showConfirmPass: false,
      confirmPass: '',
    };
  }

  componentDidMount = async () => {
    const storage = new MMKV();
    const jsonUser = storage.getString('employee');
    const employee = JSON.parse(jsonUser);
    const employeeDB = await getEmployee(Object.values(employee)[0].id);

    this.setState({
      employee: Object.values(employeeDB.val())[0],
      employeeKey: Object.keys(employee)[0],
    });
  };

  handleSubmit = () => {
    const {currentPass, newPass, confirmPass} = this.state;

    if (currentPass && newPass && confirmPass) {
      if (currentPass === this.state.employee.password) {
        if (newPass === confirmPass) {
          updatePassword(this.state.employeeKey, newPass);
          Alert.alert('Berhasil', 'Password berhasil diganti');
          this.props.navigation.popToTop();
        } else {
          Alert.alert(
            'Perhatian',
            'Password Baru dan konfirmasi password harus sama',
          );
        }
      } else {
        Alert.alert('Perhatian', 'Password salah');
      }
    } else {
      Alert.alert('Perhatian', 'Password dan Password Baru harus diisi');
    }
  };

  onChangeText = (stateName, value) => {
    this.setState({[stateName]: value});
  };

  setIcon = show => {
    this.setState(prevState => ({[show]: !prevState[show]}));
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.textTitleBold}>Ganti Password</Text>
        <View style={styles.viewContent}>
          <Text style={styles.textSubTitle}>Password saat ini</Text>
          <View style={styles.viewTextInput}>
            <TextInput
              style={styles.textInput}
              value={this.state.currentPass}
              onChangeText={value => this.onChangeText('currentPass', value)}
              placeholder="Password"
              secureTextEntry={!this.state.showCurrentPass}
            />
            <MaterialCommunityIcons
              name={this.state.showCurrentPass ? 'eye' : 'eye-off'}
              color={'grey'}
              size={18}
              onPress={() => this.setIcon('showCurrentPass')}
            />
          </View>
          <Text style={styles.textSubTitle}>Password Baru</Text>
          <View style={styles.viewTextInput}>
            <TextInput
              style={styles.textInput}
              value={this.state.newPass}
              onChangeText={value => this.onChangeText('newPass', value)}
              placeholder="Buat Password"
              secureTextEntry={!this.state.showNewPass}
            />
            <MaterialCommunityIcons
              name={this.state.showNewPass ? 'eye' : 'eye-off'}
              color={'grey'}
              size={18}
              onPress={() => this.setIcon('showNewPass')}
            />
          </View>
          <View style={styles.viewTextInput}>
            <TextInput
              style={styles.textInput}
              value={this.state.confirmPass}
              onChangeText={value => this.onChangeText('confirmPass', value)}
              placeholder="Konfirmasi Password"
              secureTextEntry={!this.state.showConfirmPass}
            />
            <MaterialCommunityIcons
              name={this.state.showConfirmPass ? 'eye' : 'eye-off'}
              color={'grey'}
              size={18}
              onPress={() => this.setIcon('showConfirmPass')}
            />
          </View>
          <ButtonLarge text={'Submit'} onPress={this.handleSubmit} />
        </View>
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
  viewContent: {
    width: '90%',
  },
  textSubTitle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  viewTextInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'black',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
  },
  textInput: {
    width: '90%',
  },
});
