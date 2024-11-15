import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import SmallCard from '../../../../component/SmallCard';
import {ButtonSmall} from '../../../../component/ButtonSmall';
import {COLOR_BLUE} from '../../../../component/Constant';
import {Header} from '../../../../component/Header';
import ButtonLarge from '../../../../component/ButtonLarge';
import {FlashList} from '@shopify/flash-list';
import {MMKV} from 'react-native-mmkv';
import {
  generateMonthlySchedule,
  getSchedules,
  saveScheduleToDB,
} from '../../../../firestore/Spv/TabHome';

export default class TabHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      filter: 'Semua',
      schedules: {},
      employee: {},
      shift: 'Malam',
      showButton: false,
      currentDate: '',
      currentTime: '',
      schedulesNext: {},
      currentMonth: '',
      nextMonth: '',
    };
  }

  componentDidMount = async () => {
    const storage = new MMKV();
    const jsonUser = storage.getString('employee');
    const employee = JSON.parse(jsonUser);

    const currentMonth = new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
    });

    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const nextMonth = date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
    });

    this.setState({employee, currentMonth, nextMonth});

    this.initApi(employee, currentMonth, nextMonth);

    this.handleCurrentDateTime();

    setInterval(() => {
      this.handleCurrentDateTime();
      const now = new Date();

      const currentHour = now.getHours();
      let shift;

      if (currentHour >= 0 && currentHour < 8) {
        shift = 'Pagi';
      } else if (currentHour >= 8 && currentHour < 16) {
        shift = 'Siang';
      } else {
        shift = 'Malam';
      }
      this.setState({shift});
    }, 1000);
  };

  initApi = async (employee, currentMonth, nextMonth) => {
    const schedules = await getSchedules(employee.department, currentMonth);
    const schedulesNext = await getSchedules(employee.department, nextMonth);
    console.log('schedules', schedules);
    console.log('schedulesNext', schedulesNext);
    if (schedules) {
      this.setState({schedules});
    }
    if (schedulesNext) {
      this.setState({schedulesNext});
    }
  };

  handleDate = date => {
    return new Date(date).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  handleCurrentDateTime = () => {
    const currentDate = new Date().toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const currentTime = new Date().toLocaleTimeString('id-ID');
    this.setState({currentDate, currentTime});
  };

  generateSchedule = async () => {
    const {employee, nextMonth, currentMonth, tab} = this.state;
    if (tab === 3) {
      const schedulesNext = await generateMonthlySchedule(
        employee.department,
        nextMonth.split('-')[1],
        nextMonth.split('-')[0],
      );
      this.setState({schedulesNext});
    } else {
      const schedules = await generateMonthlySchedule(
        employee.department,
        currentMonth.split('-')[1],
        currentMonth.split('-')[0],
      );
      this.setState({schedules, showButton: true});
    }
  };

  saveScheduleToDB = async () => {
    const {employee, schedules, schedulesNext, tab, currentMonth, nextMonth} =
      this.state;
    if (tab === 3) {
      try {
        await saveScheduleToDB(
          schedulesNext,
          employee.department,
          nextMonth.split('-')[1],
          nextMonth.split('-')[0],
        );
        console.log('Jadwal berhasil disimpan ke Firebase');
      } catch (error) {
        console.log('Terjadi kesalahan:', error);
        throw error;
      }
    } else {
      try {
        await saveScheduleToDB(
          schedules,
          employee.department,
          currentMonth.split('-')[1],
          currentMonth.split('-')[0],
        );
        console.log('Jadwal berhasil disimpan ke Firebase');
        this.setState({showButton: false});
      } catch (error) {
        console.log('Terjadi kesalahan:', error);
        throw error;
      }
    }
  };

  handleAllSchedules = ({item}) => {
    const {filter, tab, currentMonth, nextMonth} = this.state;
    const [key, val] = item;
    const date = tab === 3 ? nextMonth : currentMonth;
    return Object.entries(val.shift)
      .filter(([shift]) => shift === filter.toLowerCase() || filter === 'Semua')
      .map(([shift, value]) => {
        return (
          <View style={styles.btnContent} key={`${val.day}${shift}`}>
            <View>
              {Object.entries(value).map(([id, name]) => {
                return (
                  <Text style={styles.textName} key={id}>
                    {name}
                  </Text>
                );
              })}
            </View>
            <View>
              <Text style={styles.textDate}>
                {this.handleDate(`${date}-${String(val.day).padStart(2, '0')}`)}
              </Text>
              <Text style={styles.textDate}>{shift}</Text>
            </View>
          </View>
        );
      });
  };

  handleMySchedule = ({item}) => {
    const {filter, employee, currentMonth} = this.state;
    const [key, val] = item;
    return Object.entries(val.shift)
      .filter(([shift]) => shift === filter.toLowerCase() || filter === 'Semua')
      .map(([shift, value]) => {
        if (Object.keys(value).some(id => id === employee.id)) {
          return (
            <View style={styles.btnContent} key={`${val.day}${shift}`}>
              <View>
                {Object.entries(value).map(([id, name]) => {
                  return (
                    <Text style={styles.textName} key={id}>
                      {name}
                    </Text>
                  );
                })}
              </View>
              <View>
                <Text style={styles.textDate}>
                  {this.handleDate(
                    `${currentMonth}-${String(val.day).padStart(2, '0')}`,
                  )}
                </Text>
                <Text style={styles.textDate}>{shift}</Text>
              </View>
            </View>
          );
        }
      });
  };

  handleRenderNoData = () => {
    return (
      <View style={styles.viewMiddle}>
        <Image
          source={require('../../../../../assets/noData.png')}
          style={styles.image}
        />
        <View style={styles.wrapperText}>
          <Text style={styles.textHugeCenter}>Jadwal Belum dibuat</Text>
        </View>
        <TouchableOpacity onPress={this.generateSchedule}>
          <Text style={styles.textBlue}>Buat otomatis</Text>
        </TouchableOpacity>
      </View>
    );
  };

  handleContent = () => {
    const {tab, schedules, schedulesNext, employee, currentMonth, nextMonth} =
      this.state;
    switch (tab) {
      case 1:
        if (Object.keys(schedules).length !== 0) {
          return (
            <View style={styles.viewFlashList}>
              <FlashList
                data={Object.entries(schedules)}
                renderItem={this.handleMySchedule}
                estimatedItemSize={120}
                onRefresh={() =>
                  this.initApi(employee, currentMonth, nextMonth)
                }
                refreshing={false}
              />
            </View>
          );
        }
        return this.handleRenderNoData();
      case 2:
        if (Object.keys(schedules).length !== 0) {
          return (
            <View style={styles.viewFlashList}>
              <FlashList
                data={Object.entries(schedules)}
                renderItem={this.handleAllSchedules}
                estimatedItemSize={120}
                onRefresh={() =>
                  this.initApi(employee, currentMonth, nextMonth)
                }
                refreshing={false}
              />
            </View>
          );
        }
        return this.handleRenderNoData();
      case 3:
        if (Object.keys(schedulesNext).length !== 0) {
          return (
            <View style={styles.viewFlashList}>
              <FlashList
                data={Object.entries(schedulesNext)}
                renderItem={this.handleAllSchedules}
                estimatedItemSize={120}
                onRefresh={() =>
                  this.initApi(employee, currentMonth, nextMonth)
                }
                refreshing={false}
              />
            </View>
          );
        }
        return this.handleRenderNoData();
      default:
        break;
    }
  };

  handleStyleActive = item => {
    switch (this.state.tab === item) {
      case true:
        return styles.tabActive;
      case false:
        return styles.tabNonActive;
    }
  };

  handleRenderContent = () => {
    return (
      <View style={styles.viewContent}>
        <TouchableOpacity
          style={styles.btnTab}
          onPress={() => this.setState({tab: 1})}>
          <Text style={this.handleStyleActive(1)}>Jadwal Anda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnTab}
          onPress={() => this.setState({tab: 2})}>
          <Text style={this.handleStyleActive(2)}>Jadwal Bulan Ini</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnTab}
          onPress={() => this.setState({tab: 3})}>
          <Text style={this.handleStyleActive(3)}>Jadwal Bulan Depan</Text>
        </TouchableOpacity>
      </View>
    );
  };

  handleButtonFilter = filter => {
    this.setState({filter});
  };

  handleBottom = () => {
    const {showButton, tab} = this.state;
    if (showButton || tab === 3) {
      return (
        <View style={styles.viewButtonWrapper}>
          <View style={styles.viewButton}>
            <ButtonLarge text={'Buat Ulang'} onPress={this.generateSchedule} />
          </View>
          <View style={styles.viewButton}>
            <ButtonLarge text={'Simpan'} onPress={this.saveScheduleToDB} />
          </View>
        </View>
      );
    }
  };

  render() {
    const {employee, currentDate, currentTime, shift, filter, showButton, tab} =
      this.state;
    return (
      <View style={styles.viewContainer}>
        <Header />
        <View style={styles.viewGreeting}>
          <Text style={styles.textGreeting}>Hi, {employee.name}</Text>
          <Text style={styles.textGreeting}>{employee.department}</Text>
        </View>
        <View style={styles.viewTopCard}>
          <View>
            <Text style={styles.textCardBold}>{currentDate}</Text>
            <Text style={styles.textCurrentDate}>{currentTime}</Text>
          </View>
          <SmallCard text={shift} color={'black'} />
        </View>
        <View style={styles.viewWrapper}>
          {this.handleRenderContent()}
          <View style={styles.viewFilter}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ButtonSmall
                text={'Semua'}
                active={filter === 'Semua'}
                onPress={() => this.handleButtonFilter('Semua')}
              />
              <ButtonSmall
                text={'Pagi'}
                active={filter === 'Pagi'}
                onPress={() => this.handleButtonFilter('Pagi')}
              />
              <ButtonSmall
                text={'Siang'}
                active={filter === 'Siang'}
                onPress={() => this.handleButtonFilter('Siang')}
              />
              <ButtonSmall
                text={'Malam'}
                active={filter === 'Malam'}
                onPress={() => this.handleButtonFilter('Malam')}
              />
            </ScrollView>
          </View>
          <View
            style={[
              styles.viewWrapperContent,
              (showButton || tab === 3) && styles.heightButton,
            ]}>
            {this.handleContent()}
          </View>
          {this.handleBottom()}
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
  viewGreeting: {
    width: '90%',
    marginVertical: 10,
  },
  textGreeting: {
    fontWeight: '500',
    color: '#000000',
    fontSize: 16,
  },
  viewTopCard: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FE',
    borderRadius: 16,
    padding: 16,
  },
  textCardBold: {
    fontWeight: 'bold',
    color: '#000000',
  },
  viewContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    marginBottom: 16,
    padding: 4,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    color: '#1F2024',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    fontSize: 10,
  },
  tabNonActive: {
    borderRadius: 16,
    padding: 10,
    color: '#71727A',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    fontSize: 10,
  },
  btnTab: {
    width: '33%',
  },
  viewWrapper: {
    flex: 8,
    width: '90%',
    backgroundColor: '#F8F9FE',
    margin: 16,
    borderRadius: 16,
  },
  viewWrapperContent: {
    paddingHorizontal: 20,
    height: '83%',
  },
  btnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  viewFilter: {
    flexDirection: 'row',
  },
  textDate: {
    color: COLOR_BLUE,
    fontWeight: 'bold',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  viewMiddle: {
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  textBlue: {
    color: COLOR_BLUE,
    textAlign: 'center',
  },
  textHugeCenter: {
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
  },
  textName: {
    color: 'grey',
  },
  viewFlashList: {
    height: '100%',
    width: '100%',
  },
  viewButtonWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  viewButton: {
    width: '48%',
  },
  textCurrentDate: {
    color: 'grey',
  },
  heightButton: {
    height: '70%',
  },
});
