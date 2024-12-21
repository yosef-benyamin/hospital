import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {ButtonLarge} from '../../component/ButtonLarge';
import {Picker} from '@react-native-picker/picker';
import {MMKV} from 'react-native-mmkv';
import {getSchedules} from '../../firestore/Spv/TabHome';
import {getEmployeeByID} from '../../firestore/FormLeave';
import {COLOR_GREEN_PRIMARY} from '../../component/Constant';
import {addChangeShift, getEmployeeByDept} from '../../firestore/ChangeShift';

export default class ChangeShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: {},
      employeeKey: '',
      schedulePicker: [],
      scheduleValue: {},
      shift: 'pagi',
      personPicker: [],
      personValue: '',
      currentMonth: '',
    };
  }

  componentDidMount = async () => {
    const currentMonth = new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
    });

    const storage = new MMKV();
    const jsonUser = storage.getString('employee');
    const employee = JSON.parse(jsonUser);
    const employeeDB = await getEmployeeByID(employee.NIP);

    let data = {};
    employeeDB.forEach(emp => {
      data = emp;
    });

    this.setState({
      employee: data.data(),
      employeeKey: data.id,
      currentMonth,
    });

    this.initApi();
  };

  handleDate = date => {
    return new Date(date).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  initApi = async () => {
    const {currentMonth, employee} = this.state;
    const schedulePicker = [{label: 'Silakan pilih', value: ''}];
    const schedules = await getSchedules(employee.Room, currentMonth);
    Object.values(schedules).forEach(item =>
      Object.entries(item.shift).forEach(([key, val]) => {
        if (JSON.stringify(val).includes(this.state.employee.NIP)) {
          schedulePicker.push({
            label: this.handleDate(`${currentMonth}-${item.day}`) + ` - ${key}`,
            value: {
              day: item.day,
              shift: key,
            },
          });
        }
      }),
    );

    const personPicker = [{label: 'Silakan pilih', value: ''}];
    const employees = await getEmployeeByDept(employee.Room);
    employees.forEach(emp => {
      personPicker.push({
        label: emp.data().Name,
        value: {
          NIP: emp.data().NIP,
          Name: emp.data().Name,
        },
      });
    });

    this.setState({schedulePicker, personPicker});
  };

  handleSubmit = () => {
    const {employee, scheduleValue, currentMonth, shift, personValue} =
      this.state;
    const dataMerge = {
      employee: {
        NIP: employee.NIP,
        Name: employee.Name,
      },
      Room: employee.Room,
      currentMonth,
      scheduleValue,
      shift,
      personValue,
    };
    if (this.state.personValue && this.state.scheduleValue) {
      Alert.alert('Perhatian', 'Yakin ingin mengubah jadwal?', [
        {text: 'Cancel', onPress: () => console.log('cancel')},
        {
          text: 'OK',
          onPress: () => {
            addChangeShift(dataMerge);
            this.props.navigation.goBack();
          },
        },
      ]);
    } else {
      Alert.alert('Perhatian', 'Semua pilihan wajib dipilih');
    }
  };

  onChangeText = (stateName, value) => {
    this.setState({[stateName]: value});
  };

  handlePicker = () => {
    return this.state.schedulePicker.map((item, index) => {
      return <Picker.Item key={index} label={item.label} value={item.value} />;
    });
  };

  handlePerson = () => {
    return this.state.personPicker.map((item, index) => {
      return <Picker.Item key={index} label={item.label} value={item.value} />;
    });
  };

  handleStyleRadio = shift => {
    switch (this.state.shift) {
      case shift:
        return [styles.buttonRadio, styles.wrapperRadio, styles.radio];

      default:
        return [styles.buttonRadioOff, styles.wrapperRadioOff, null];
    }
  };

  render() {
    console.log('scheduleValue', this.state.scheduleValue);
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.textTitleBold}>Ubah Jadwal</Text>
        <ScrollView
          style={styles.viewContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.textSubTitle}>Jadwal Semula</Text>
          <View style={styles.viewPicker}>
            <Picker
              selectedValue={this.state.scheduleValue}
              style={styles.picker}
              onValueChange={itemValue =>
                this.setState({scheduleValue: itemValue})
              }>
              {this.handlePicker()}
            </Picker>
          </View>
          <Text style={styles.textSubTitle}>Perubahan Jadwal</Text>
          <TouchableOpacity
            style={this.handleStyleRadio('pagi')[0]}
            onPress={() => this.setState({shift: 'pagi'})}>
            <View style={this.handleStyleRadio('pagi')[1]}>
              <View style={this.handleStyleRadio('pagi')[2]} />
            </View>
            <Text style={styles.textBlack}>Pagi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={this.handleStyleRadio('siang')[0]}
            onPress={() => this.setState({shift: 'siang'})}>
            <View style={this.handleStyleRadio('siang')[1]}>
              <View style={this.handleStyleRadio('siang')[2]} />
            </View>
            <Text style={styles.textBlack}>Siang</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={this.handleStyleRadio('malam')[0]}
            onPress={() => this.setState({shift: 'malam'})}>
            <View style={this.handleStyleRadio('malam')[1]}>
              <View style={this.handleStyleRadio('malam')[2]} />
            </View>
            <Text style={styles.textBlack}>Malam</Text>
          </TouchableOpacity>
          <Text style={styles.textSubTitle}>Tukar dengan</Text>
          <View style={styles.viewPicker}>
            <Picker
              selectedValue={this.state.personValue}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({personValue: itemValue})
              }>
              {this.handlePerson()}
            </Picker>
          </View>
          <ButtonLarge text={'Ajukan'} onPress={this.handleSubmit} />
        </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  textInput: {
    color: 'black',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
  },
  smallBtn: {
    backgroundColor: '#EAF2FF',
    borderRadius: 26,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPicker: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 10,
  },
  textSmall: {
    color: 'black',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
  },
  viewTextSmall: {
    flexDirection: 'row',
    padding: 10,
  },
  viewDayLeave: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  textBlack: {
    color: 'black',
  },
  buttonRadio: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#EAF2FF',
    padding: 12,
    marginVertical: 8,
  },
  buttonRadioOff: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4D6DD',
    padding: 12,
    marginVertical: 8,
  },
  wrapperRadio: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: COLOR_GREEN_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  wrapperRadioOff: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4D6DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radio: {
    height: 8,
    width: 8,
    borderRadius: 6,
    backgroundColor: '#FFF',
  },
});
