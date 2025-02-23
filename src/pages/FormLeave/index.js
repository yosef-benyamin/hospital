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
  approveLeaveEmp,
  getDataLeave,
  getEmployeeByID,
  getSpvByDept,
} from '../../firestore/FormLeave';

export default class FormLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onLeave: '',
      dateLeave: new Date(),
      endDate: new Date(),
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
    const dataLeave = await getDataLeave();
    const storage = new MMKV();
    const jsonUser = storage.getString('employee');
    const employee = JSON.parse(jsonUser);
    const employeeDB = await getEmployeeByID(employee.NIP);
    let data = {};
    employeeDB.forEach(emp => {
      data = emp;
    });

    const spvPicker = [{label: 'Silakan pilih', value: ''}];
    const employees = await getSpvByDept(employee.Room);
    employees.forEach(emp => {
      spvPicker.push({
        label: emp.data().Name,
        value: {
          NIP: emp.data().NIP,
          Name: emp.data().Name,
        },
      });
    });

    this.setState({
      employee: data.data(),
      employeeKey: data.id,
      dayLeaveRemain: data.data().Leaves?.annual,
      dataLeave,
      spvPicker,
    });
  };

  handleSubmit = () => {
    const {
      onLeave,
      dateLeave,
      endDate,
      reason,
      address,
      spv,
      dayLeave,
      employee,
      employeeKey,
    } = this.state;

    const date = dateLeave.toLocaleDateString('en-CA');
    const dateEnd = endDate.toLocaleDateString('en-CA');
    const dateSubmit = new Intl.DateTimeFormat('en-CA').format(new Date());

    if (reason && address && spv) {
      const dataMerge = {
        onLeave,
        reason,
        address,
        spv,
        dayLeave,
        Name: employee.Name,
        Room: employee.Room,
        approval: 'waiting',
        employeeKey,
        date,
        dateEnd,
        dateSubmit,
      };
      // updateEmployeeLeave(9, '2024-10-31', 'Cuti-Tahunan');
      addLeave(dataMerge);
      approveLeaveEmp(employeeKey, onLeave, dayLeave, 'waiting');
      this.props.navigation.replace('TabScreen', {tabScreen: 'TabLeave'});
    } else {
      Alert.alert(
        'Perhatian',
        'Alasan Cuti, Alamat Selamat Cuti, dan Pemberi Cuti tidak boleh kosong',
      );
    }
  };

  onChangeDate = (event, dateLeave) => {
    this.setState({[event]: dateLeave});
    if (this.state.endDate < dateLeave) {
      this.setState({endDate: dateLeave});
    }
  };

  showDatepicker = dateVal => {
    const {dateLeave} = this.state;
    DateTimePickerAndroid.open({
      value: this.state[dateVal],
      onChange: (event, value) => this.onChangeDate(dateVal, value),
      mode: 'date',
      minimumDate: dateVal === 'endDate' ? new Date(dateLeave) : new Date(),
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

  handlePickerOnLeave = () => {
    const {dataLeave, employee} = this.state;
    if (dataLeave) {
      return dataLeave.map(leave => (
        <Picker.Item
          key={leave.LeaveName}
          label={leave.LeaveName}
          value={leave.LeaveName}
          enabled={employee?.Leaves?.[leave.LeaveName] > 0 || false}
        />
      ));
    }
  };

  handleOnLeaveRemain = () => {
    const {employee} = this.state;
    if (employee.Leaves) {
      return (
        <View style={styles.viewTextSmall}>
          {Object.entries(employee.Leaves).map(([key, val]) => (
            <View key={key} style={styles.viewLeaveRemain}>
              <Text style={styles.textSmall}>{key}</Text>
              <Text style={styles.textSmall}>{val}</Text>
            </View>
          ))}
        </View>
      );
    }
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
                  dayLeaveRemain: employee?.Leaves[itemValue],
                })
              }>
              {this.handlePickerOnLeave()}
            </Picker>
          </View>
          <Text style={styles.textSubTitle}>Sisa Cuti</Text>
          {this.handleOnLeaveRemain()}
          <Text style={styles.textSubTitle}>Tanggal Mulai</Text>
          <TouchableOpacity onPress={() => this.showDatepicker('dateLeave')}>
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
          <Text style={styles.textSubTitle}>Tanggal Akhir</Text>
          <TouchableOpacity onPress={() => this.showDatepicker('endDate')}>
            <TextInput
              style={styles.textInput}
              value={this.state.endDate.toLocaleString('id-ID', {
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
            <Text style={styles.textSubTitle}>Lama Cuti</Text>
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
            <Text style={styles.textSubTitle}>Hari</Text>
            <View style={styles.viewEmptyFill} />
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
    fontSize: 20,
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
    padding: 10,
  },
  viewLeaveRemain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  viewDayLeave: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  viewEmptyFill: {
    width: '40%',
  },
  textBlack: {
    color: 'black',
  },
});
