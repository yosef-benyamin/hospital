import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {ButtonLarge} from '../../component/ButtonLarge';
import {Picker} from '@react-native-picker/picker';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {MMKV} from 'react-native-mmkv';
import {
  addLeave,
  getEmployeeByID,
  getSpvByDept,
} from '../../firestore/FormLeave';

export default class FormLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onLeave: 'annual',
      dateLeave: new Date(),
      reason: '',
      address: '',
      dayLeave: 1,
      dayLeaveRemain: 0,
      employee: {},
      employeeKey: '',
      spvPicker: [],
      spv: '',
    };
  }

  componentDidMount = async () => {
    const storage = new MMKV();
    const jsonUser = storage.getString('employee');
    const employee = JSON.parse(jsonUser);
    const employeeDB = await getEmployeeByID(employee.id);
    let data = {};
    employeeDB.forEach(emp => {
      data = emp;
    });

    this.setState({
      employee: data.data(),
      employeeKey: data.id,
      dayLeaveRemain: data.data().leave?.annual,
    });

    const spvPicker = [{label: 'Silakan pilih', value: ''}];
    const employees = await getSpvByDept(employee.Room);
    employees.forEach(emp => {
      spvPicker.push({
        label: emp.data().name,
        value: {
          id: emp.data().id,
          name: emp.data().name,
        },
      });
    });
    this.setState({spvPicker});
  };

  handleSubmit = () => {
    const {
      onLeave,
      dateLeave,
      reason,
      address,
      spv,
      dayLeave,
      employee,
      employeeKey,
    } = this.state;

    const date = dateLeave.toLocaleDateString('en-CA');

    if (reason && address && spv) {
      const dataMerge = {
        onLeave,
        reason,
        address,
        spv,
        dayLeave,
        name: employee.name,
        Room: employee.Room,
        approval: 'waiting',
        employeeKey,
        date,
      };
      // updateEmployeeLeave(9, '2024-10-31', 'Cuti-Tahunan');
      addLeave(dataMerge);
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        'Perhatian',
        'Alasan Cuti, Alamat Selamat Cuti, dan Pemberi Cuti tidak boleh kosong',
      );
    }
  };

  onChangeDate = (event, dateLeave) => {
    this.setState({dateLeave});
  };

  showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: this.state.dateLeave,
      onChange: this.onChangeDate,
      mode: 'date',
      minimumDate: new Date(),
    });
  };

  onChangeText = (stateName, value) => {
    this.setState({[stateName]: value});
  };

  handlePicker = () => {
    return this.state.spvPicker.map((item, index) => {
      return <Picker.Item key={index} label={item.label} value={item.value} />;
    });
  };

  render() {
    const {employee} = this.state;
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.textTitleBold}>Pengajuan Cuti</Text>
        <ScrollView
          style={styles.viewContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.textSubTitle}>Jenis Cuti yang diambil</Text>
          <View style={styles.viewPicker}>
            <Picker
              selectedValue={this.state.onLeave}
              style={styles.picker}
              onValueChange={itemValue =>
                this.setState({
                  onLeave: itemValue,
                  dayLeaveRemain: employee?.leave[itemValue],
                })
              }>
              <Picker.Item
                label="Tahunan"
                value="annual"
                enabled={employee?.leave?.annual !== 0}
              />
              <Picker.Item label="Cuti Sakit" value="sick" />
              <Picker.Item
                label="Cuti Alasan Penting"
                value="urgent"
                enabled={employee?.leave?.urgent !== 0}
              />
              <Picker.Item
                label="Cuti Besar"
                value="holiday"
                enabled={employee?.leave?.holiday !== 0}
              />
              <Picker.Item
                label="Cuti Melahirkan"
                value="maternity"
                enabled={employee?.leave?.maternity !== 0}
              />
              <Picker.Item
                label="Cuti di Luar Tanggungan"
                value="unpaid"
                enabled={employee?.leave?.unpaid !== 0}
              />
            </Picker>
          </View>
          <Text style={styles.textSubTitle}>Sisa Cuti</Text>
          <View style={styles.viewTextSmall}>
            <View>
              <Text style={styles.textSmall}>Tahunan</Text>
              <Text style={styles.textSmall}>Cuti Sakit</Text>
              <Text style={styles.textSmall}>Cuti Alasan Penting</Text>
              <Text style={styles.textSmall}>Cuti Besar</Text>
              <Text style={styles.textSmall}>Cuti Melahirkan</Text>
              <Text style={styles.textSmall}>Cuti di Luar Tanggungan</Text>
            </View>
            <View>
              <Text style={styles.textSmall}>{employee?.leave?.annual}</Text>
              <Text style={styles.textSmall}>{employee?.leave?.sick}</Text>
              <Text style={styles.textSmall}>{employee?.leave?.urgent}</Text>
              <Text style={styles.textSmall}>{employee?.leave?.holiday}</Text>
              <Text style={styles.textSmall}>{employee?.leave?.maternity}</Text>
              <Text style={styles.textSmall}>{employee?.leave?.unpaid}</Text>
            </View>
          </View>
          <Text style={styles.textSubTitle}>Tanggal Cuti</Text>
          <TouchableOpacity onPress={this.showDatepicker}>
            <TextInput
              style={styles.textInput}
              value={this.state.dateLeave.toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              editable={false}
            />
          </TouchableOpacity>
          <Text style={styles.textSubTitle}>Alasan Cuti</Text>
          <TextInput
            style={styles.textInput}
            value={this.state.reason}
            onChangeText={value => this.onChangeText('reason', value)}
          />
          <View style={styles.viewDayLeave}>
            <Text style={styles.textSubTitle}>Lama Cuti (Hari)</Text>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() =>
                this.setState(prevState => ({
                  dayLeave:
                    prevState.dayLeave === 1
                      ? prevState.dayLeave
                      : prevState.dayLeave - 1,
                }))
              }>
              <Text style={styles.textBlack}>-</Text>
            </TouchableOpacity>
            <Text style={styles.textBlack}>{this.state.dayLeave}</Text>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() =>
                this.setState(prevState => ({dayLeave: prevState.dayLeave + 1}))
              }>
              <Text style={styles.textBlack}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.textSubTitle}>Alamat Selama Cuti</Text>
          <TextInput
            style={styles.textInput}
            value={this.state.address}
            onChangeText={value => this.onChangeText('address', value)}
          />
          <Text style={styles.textSubTitle}>
            Pejabat pemberi cuti (Kepala Ruangan)
          </Text>
          <View style={styles.viewPicker}>
            <Picker
              selectedValue={this.state.spv}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({spv: itemValue})
              }>
              {this.handlePicker()}
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
});
