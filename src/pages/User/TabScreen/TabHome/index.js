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
  get,
  getDatabase,
  limitToFirst,
  orderByKey,
  query,
  ref,
  startAt,
} from 'firebase/database';
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
          <Text style={styles.textHugeCenter}>Belum ada jadwal</Text>
        </View>
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
                onEndReached={() => this.initApi()}
                onEndReachedThreshold={1}
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
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
  },
  image: {
    width: 100,
    height: 100,
  },
  textHugeCenter: {
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
    padding: 20,
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
  textCurrentDate: {
    color: 'grey',
  },
});
