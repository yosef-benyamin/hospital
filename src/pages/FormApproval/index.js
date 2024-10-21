import React, {Component} from 'react';
import {Text, StyleSheet, View, Modal, TextInput, Alert} from 'react-native';
import {ButtonLarge} from '../../component/ButtonLarge';
import {COLOR_RED} from '../../component/Constant';
import {ModalConfirm} from '../../component/ModalConfirm';
import {approveLeaveEmp, updateLeaveDB} from '../../utils';

export default class FormApproval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateLeave: new Date(),
      reason: '',
      address: '',
      leader: 'dokter a',
      head: 'kepala radiologi',
      dayLeave: 1,
      employee: {},
      showModal: false,
      modalReject: false,
      reasonReject: '',
    };
  }

  componentDidMount = () => {
    this.setState({employee: this.props.route.params});
  };

  handleSubmit = showModal => {
    this.setState({[showModal]: true});
  };

  onChangeText = (stateName, value) => {
    this.setState({[stateName]: value});
  };

  handleDate = date => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  handleTextLeave = onLeave => {
    switch (onLeave) {
      case 'annual':
        return 'Tahunan';
      case 'sick':
        return 'Cuti Sakit';
      case 'urgent':
        return 'Cuti Alasan Penting';
      case 'holiday':
        return 'Cuti Besar';
      case 'maternity':
        return 'Cuti Melahirkan';
      case 'unpaid':
        return 'Cuti di Luar Tanggungan';
      default:
        break;
    }
  };

  handleModalPositive = approve => {
    const {
      address,
      date,
      dayLeave,
      head,
      leader,
      name,
      onLeave,
      reason,
      id,
      dayLeaveRemain,
      approval,
      department,
    } = this.state.employee;

    const {reasonReject} = this.state;

    if (approve === 'approved' && approval === 'approved') {
      return this.props.navigation.goBack();
    }

    if (approve === 'rejected' && reasonReject === '') {
      return Alert.alert('Perhatian', 'Alasan penolakan tidak boleh kosong');
    }

    const dataMerge = {
      onLeave,
      reason,
      address,
      leader,
      head,
      dayLeave,
      dayLeaveRemain,
      name,
      approval: approve,
      reasonReject,
      department,
    };
    try {
      updateLeaveDB(id, date, dataMerge);
      approveLeaveEmp(id, onLeave, dayLeave, dayLeaveRemain, approve);
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
    this.props.navigation.goBack();
  };

  handleModalReject = () => {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.state.modalReject}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <TextInput
                style={styles.textInput}
                value={this.state.reasonReject}
                onChangeText={reasonReject => this.setState({reasonReject})}
                placeholder="Alasan Penolakan Cuti..."
                placeholderTextColor={'grey'}
              />
            </View>
            <View style={styles.viewButton}>
              <ButtonLarge
                styleButton={styles.button}
                text={'Batal'}
                onPress={() => this.setState({modalReject: false})}
              />
              <ButtonLarge
                styleButton={styles.button}
                text={'Oke'}
                onPress={() => this.handleModalPositive('rejected')}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    const {employee} = this.state;
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.textTitleBold}>Pengajuan Cuti</Text>
        <View style={styles.viewContent}>
          <ModalConfirm
            visible={this.state.showModal}
            title={'Setujui'}
            subtitle={'Anda ingin menyetujui cuti?'}
            negativeButton={() => this.setState({showModal: false})}
            positiveButton={() => this.handleModalPositive('approved')}
          />
          <Text style={styles.textSubTitle}>Jenis Cuti yang diambil</Text>
          <Text style={styles.textNormal}>
            {this.handleTextLeave(employee.onLeave)}
          </Text>
          <Text style={styles.textSubTitle}>Tanggal Cuti</Text>
          <Text style={styles.textNormal}>
            {this.handleDate(employee.date)}
          </Text>
          <Text style={styles.textSubTitle}>Alasan Cuti</Text>
          <Text style={styles.textNormal}>{employee.reason}</Text>
          <Text style={styles.textSubTitle}>Lama Cuti</Text>
          <Text style={styles.textNormal}>{employee.dayLeave} Hari</Text>
          <Text style={styles.textSubTitle}>Alamat Selama Cuti</Text>
          <Text style={styles.textNormal}>{employee.address}</Text>
          <Text style={styles.textSubTitle}>Pertimbangan atasan langsung</Text>
          <Text style={styles.textNormal}>{employee.leader}</Text>
          <Text style={styles.textSubTitle}>
            Pejabat pemberi cuti (Kepala Ruangan)
          </Text>
          <Text style={styles.textNormal}>{employee.head}</Text>
        </View>
        <View style={styles.viewWrapperButton}>
          <View style={styles.viewContentButton}>
            <ButtonLarge
              text={'Tolak'}
              styleButton={{backgroundColor: COLOR_RED}}
              onPress={() => this.handleSubmit('modalReject')}
            />
          </View>
          <View style={styles.viewContentButton}>
            <ButtonLarge
              text={'Setujui'}
              onPress={() => this.handleSubmit('showModal')}
            />
          </View>
          {this.handleModalReject()}
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
    height: '80%',
  },
  textSubTitle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  textNormal: {
    color: '#000000',
    paddingTop: 10,
    paddingBottom: 20,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  modalText: {
    textAlign: 'center',
    fontWeight: '900',
    color: 'black',
  },
  modalDesc: {
    margin: 10,
    color: 'grey',
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
  },
  button: {
    width: '50%',
    margin: 12,
  },
  viewWrapperButton: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
  },
  viewContentButton: {
    width: '48%',
  },
});
