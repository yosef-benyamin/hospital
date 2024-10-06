import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {ButtonLarge} from '../../component/ButtonLarge';
import {Picker} from '@react-native-picker/picker';

export default class FormLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.textTitleBold}>Pengajuan Cuti</Text>
        <ScrollView
          style={styles.viewContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.textSubTitle}>Jenis Cuti yang diambil</Text>
          <View style={styles.viewPicker}>
            <Picker
              selectedValue={this.state.language}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({language: itemValue})
              }>
              <Picker.Item label="Tahunan" value="tahunan" />
              <Picker.Item label="Cuti Sakit" value="sakit" />
              <Picker.Item label="Cuti Alasan Penting" value="penting" />
              <Picker.Item label="Cuti Besar" value="besar" />
              <Picker.Item label="Cuti Melahirkan" value="melahirkan" />
              <Picker.Item label="Cuti di Luar Tanggungan" value="luar" />
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
              <Text style={styles.textSmall}>12</Text>
              <Text style={styles.textSmall}>30</Text>
              <Text style={styles.textSmall}>1</Text>
              <Text style={styles.textSmall}>3</Text>
              <Text style={styles.textSmall}>2</Text>
              <Text style={styles.textSmall}>1</Text>
            </View>
          </View>
          <Text style={styles.textSubTitle}>Tanggal Cuti</Text>
          <TextInput style={styles.textInput} value="16 September 2024" />
          <Text style={styles.textSubTitle}>Alasan Cuti</Text>
          <TextInput
            style={styles.textInput}
            value="Liburan bersama keluarga"
          />
          <View style={styles.viewDayLeave}>
            <Text style={styles.textSubTitle}>Lama Cuti (Hari)</Text>
            <TouchableOpacity style={styles.smallBtn}>
              <Text>-</Text>
            </TouchableOpacity>
            <Text>1</Text>
            <TouchableOpacity style={styles.smallBtn}>
              <Text>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.textSubTitle}>Alamat Selama Cuti</Text>
          <TextInput style={styles.textInput} value="Dago - Bandung" />
          <Text style={styles.textSubTitle}>Pertimbangan atasan langsung</Text>
          <View style={styles.viewPicker}>
            <Picker
              selectedValue={this.state.language}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({language: itemValue})
              }>
              <Picker.Item label="Dokter A" value="dokter a" />
            </Picker>
          </View>
          <Text style={styles.textSubTitle}>
            Pejabat pemberi cuti (Kepala Ruangan)
          </Text>
          <View style={styles.viewPicker}>
            <Picker
              selectedValue={this.state.language}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({language: itemValue})
              }>
              <Picker.Item label="Kepala Radiologi" value="kepala radiologi" />
            </Picker>
          </View>
          <ButtonLarge text={'Ajukan'} />
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
});
