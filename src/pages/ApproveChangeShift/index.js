import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import SmallCard from '../../component/SmallCard';
import {MMKV} from 'react-native-mmkv';
import {
  changeShiftByID,
  getChangeShift,
  updateChangeShift,
} from '../../firestore/ChangeShift';

export default class ApproveChangeShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shift: [],
    };
  }

  componentDidMount = async () => {
    const storage = new MMKV();
    const jsonUser = storage.getString('employee');
    const employee = JSON.parse(jsonUser);

    this.setState({employee});
    this.initApi(employee);
  };

  initApi = async employee => {
    const shift = [];
    const querySnapshot = await getChangeShift(employee.department);
    querySnapshot.forEach(doc => {
      shift.push({...doc.data(), key: doc.id});
    });
    this.setState({shift});
  };

  handleRenderNoData = () => {
    return (
      <View style={styles.viewMiddle}>
        <Image
          source={require('../../../assets/noData.png')}
          style={styles.image}
        />
        <View style={styles.wrapperText}>
          <Text style={styles.textHugeCenter}>Belum ada yang</Text>
          <Text style={styles.textHugeCenter}>mengajukan ubah jadwal</Text>
        </View>
      </View>
    );
  };

  handleDate = date => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  handleApprove = item => {
    const {
      employee,
      department,
      currentMonth,
      scheduleValue,
      shift,
      personValue,
    } = item;
    const dataMerge = {
      employee,
      department,
      currentMonth,
      scheduleValue,
      shift,
      personValue,
      approve: true,
    };
    Alert.alert('Perhatian', 'Yakin ingin mengubah jadwal?', [
      {text: 'Cancel', onPress: () => console.log('cancel')},
      {
        text: 'OK',
        onPress: () => {
          updateChangeShift(item.key, dataMerge);
          changeShiftByID(
            employee,
            department,
            scheduleValue,
            currentMonth,
            shift,
          );
          this.props.navigation.goBack();
        },
      },
    ]);
  };

  handleRenderData = () => {
    return this.state.shift.map((item, index) => {
      return (
        <TouchableOpacity
          disabled={item.approve}
          key={index}
          style={styles.viewCard}
          onPress={() => this.handleApprove(item)}>
          <View>
            <Text style={styles.textTitle}>
              {this.handleDate(
                `${item.currentMonth}-${item.scheduleValue.day}`,
              )}
            </Text>
            <Text
              style={
                styles.textGrey
              }>{`${item.employee.name} > ${item.shift}`}</Text>
            <Text
              style={
                styles.textGrey
              }>{`${item.personValue.name} > ${item.scheduleValue.shift}`}</Text>
          </View>
          <SmallCard
            text={item.approve ? 'Disetujui ' : 'Setuju'}
            color={!item.approve && 'blue'}
          />
        </TouchableOpacity>
      );
    });
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.textTitleBold}>Ubah Jadwal</Text>
        {this.handleRenderData()}
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
  viewMiddle: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperText: {
    padding: 14,
  },
  textTitleBold: {
    fontWeight: 'bold',
    color: '#000000',
    padding: 30,
  },
  textHugeCenter: {
    fontWeight: '900',
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  viewCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    backgroundColor: '#F8F9FE',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginVertical: 10,
  },
  textTitle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  textGrey: {
    color: 'grey',
  },
});
