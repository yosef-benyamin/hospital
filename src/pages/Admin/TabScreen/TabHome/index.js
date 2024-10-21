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
import {
  child,
  get,
  getDatabase,
  limitToFirst,
  orderByKey,
  query,
  ref,
  startAt,
} from 'firebase/database';
import {firebaseInit} from '../../../../config/firebaseInit';
import ButtonLarge from '../../../../component/ButtonLarge';
import {
  generateAndUpdateSchedule,
  saveScheduleToFirebase,
} from '../../../../utils';
import {FlashList} from '@shopify/flash-list';
import {MMKV} from 'react-native-mmkv';

export default class TabHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      filter: 'Pagi',
      schedules: {},
      data: {},
      shift: 'Malam',
      showButton: false,
      startAfter: '2024-10-01',
    };
  }

  componentDidMount = async () => {
    const storage = new MMKV();
    const jsonUser = storage.getString('employee');
    const employee = Object.values(JSON.parse(jsonUser))[0];

    this.setState({data: employee});

    this.initApi();

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

  initApi = async () => {
    const db = getDatabase();
    const schedulesRef = query(
      ref(db, 'schedules'),
      orderByKey(),
      startAt(this.state.startAfter),
      limitToFirst(5),
    );

    try {
      const snapshot = await get(schedulesRef);
      if (snapshot.exists()) {
        const length = Object.keys(snapshot.val()).length;
        const startAfter = Object.keys(snapshot.val())[length - 1];
        this.setState(prevState => ({
          schedules: {...prevState.schedules, ...snapshot.val()},
          startAfter,
        }));
      } else {
        console.log('No Data Available');
      }
    } catch (error) {
      console.error('Error mengambil karyawan:', error);
      throw error;
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

  generateSchedule = () => {
    this.setState({showButton: true});
    const db = ref(getDatabase(firebaseInit));
    get(child(db, 'employees')).then(async snapshot => {
      if (snapshot.exists()) {
        const schedules = await generateAndUpdateSchedule(
          2024,
          10,
          snapshot.val(),
        );
        this.setState({schedules});
        // await resetLeave(snapshot.val())
        //   .then(() => console.log('Proses selesai'))
        //   .catch(error => console.error('Terjadi kesalahan:', error));
      } else {
        console.log('No Data Available');
      }
    });
  };

  saveScheduleToDB = async () => {
    try {
      await saveScheduleToFirebase(this.state.schedules);
      console.log('Jadwal berhasil disimpan ke Firebase');
      this.setState({showButton: false});
    } catch (error) {
      console.log('Terjadi kesalahan:', error);
      throw error;
    }
  };

  handleAllSchedules = ({item}) => {
    const {filter} = this.state;
    const [date, schedules] = item;

    return Object.entries(schedules).flatMap(([room, shifts]) =>
      Object.entries(shifts)
        .filter(
          ([shift]) =>
            shift.toLowerCase() === filter.toLowerCase() || filter === 'Semua',
        )
        .map(([shift, val]) => (
          <View key={`${date}-${room}-${shift}`} style={styles.btnContent}>
            <View>
              <Text style={styles.textBold}>{room}</Text>
              {Object.values(val).map((value, index) => (
                <Text style={styles.textName} key={index}>
                  {value}
                </Text>
              ))}
            </View>
            <View>
              <Text style={styles.textDate}>{this.handleDate(date)}</Text>
              <Text style={styles.textDate}>{shift}</Text>
            </View>
          </View>
        )),
    );
  };

  handleMySchedule = ({item}) => {
    const {filter, data} = this.state;
    const [date, schedules] = item;

    let show = false;

    return Object.entries(schedules).flatMap(([room, shifts]) =>
      Object.entries(shifts)
        .filter(
          ([shift]) =>
            shift.toLowerCase() === filter.toLowerCase() || filter === 'Semua',
        )
        .map(([shift, val]) => {
          show = Object.values(val).toString().includes(data.name);
          return (
            <View
              key={`${date}-${room}-${shift}`}
              style={show ? styles.btnContent : styles.noContent}>
              <View>
                <Text style={styles.textBold}>{room}</Text>
                {Object.values(val).map((value, index) => (
                  <Text style={styles.textName} key={index}>
                    {value}
                  </Text>
                ))}
              </View>
              <View>
                <Text style={styles.textDate}>{this.handleDate(date)}</Text>
                <Text style={styles.textDate}>{shift}</Text>
              </View>
            </View>
          );
        }),
    );
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
    switch (this.state.tab) {
      case 1:
        if (Object.keys(this.state.schedules).length !== 0) {
          return (
            <View style={styles.viewFlashList}>
              <FlashList
                data={Object.entries(this.state.schedules)}
                renderItem={this.handleMySchedule}
                estimatedItemSize={120}
                onEndReached={() => this.initApi()}
                onEndReachedThreshold={1}
              />
            </View>
          );
        }
        return this.handleRenderNoData();
      case 2:
        if (Object.keys(this.state.schedules).length !== 0) {
          return (
            <View style={styles.viewFlashList}>
              <FlashList
                data={Object.entries(this.state.schedules)}
                renderItem={this.handleAllSchedules}
                estimatedItemSize={120}
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
      </View>
    );
  };

  handleButtonFilter = filter => {
    this.setState({filter});
  };

  handleBottom = () => {
    if (this.state.showButton) {
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
    return (
      <View style={styles.viewContainer}>
        <Header />
        <View style={styles.viewGreeting}>
          <Text style={styles.textGreeting}>Hi, {this.state.data.name}</Text>
          <Text style={styles.textGreeting}>{this.state.data.department}</Text>
        </View>
        <View style={styles.viewTopCard}>
          <View>
            <Text style={styles.textCardBold}>{this.state.currentDate}</Text>
            <Text style={styles.textCurrentDate}>{this.state.currentTime}</Text>
          </View>
          <SmallCard text={this.state.shift} color={'black'} />
        </View>
        <View style={styles.viewWrapper}>
          {this.handleRenderContent()}
          <View style={styles.viewFilter}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {/* <ButtonSmall
                text={'Semua'}
                active={this.state.filter === 'Semua'}
                onPress={() => this.handleButtonFilter('Semua')}
              /> */}
              <ButtonSmall
                text={'Pagi'}
                active={this.state.filter === 'Pagi'}
                onPress={() => this.handleButtonFilter('Pagi')}
              />
              <ButtonSmall
                text={'Siang'}
                active={this.state.filter === 'Siang'}
                onPress={() => this.handleButtonFilter('Siang')}
              />
              <ButtonSmall
                text={'Malam'}
                active={this.state.filter === 'Malam'}
                onPress={() => this.handleButtonFilter('Malam')}
              />
            </ScrollView>
          </View>
          <View style={styles.viewWrapperContent}>{this.handleContent()}</View>
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
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    color: '#1F2024',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  tabNonActive: {
    borderRadius: 16,
    padding: 10,
    color: '#71727A',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  btnTab: {
    width: '50%',
  },
  viewWrapper: {
    flex: 8,
    width: '90%',
    backgroundColor: '#F8F9FE',
    margin: 16,
    borderRadius: 16,
  },
  textBold: {
    color: '#1F2024',
    fontWeight: 'bold',
  },
  viewWrapperContent: {
    paddingHorizontal: 20,
    height: '70%',
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
  noContent: {
    height: 0,
  },
  viewFlashList: {
    height: '90%',
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
});
