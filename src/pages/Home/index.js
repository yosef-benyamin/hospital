import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {Header} from '../../component/Header';
import SmallCard from '../../component/SmallCard';
import {ButtonLarge} from '../../component/ButtonLarge';
import {getSchedules} from '../../firestore/Spv/TabHome';
import {ButtonSmall} from '../../component/ButtonSmall';
import {getRoom} from '../../firestore/Home';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      schedules: {},
      shift: 'Malam',
      filter: '',
      rooms: [],
    };
  }

  componentDidMount = async () => {
    // Pagi: 00.00 - 08.00
    // Siang: 08.00 - 16.00
    // Malam: 16.00 - 00.00

    const rooms = await getRoom();
    this.initApi(rooms[0]);
    this.handleCurrentDateTime();

    this.setState({rooms, filter: rooms[0]});
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

  initApi = async filter => {
    const currentDate = new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
    });
    const schedules = await getSchedules(filter, currentDate);

    this.setState({schedules});
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

  handleRenderNoData = () => {
    return (
      <View style={styles.viewMiddle}>
        <Image
          source={require('../../../assets/noData.png')}
          style={styles.image}
        />
        <Text style={styles.textHugeCenter}>Belum ada jadwal</Text>
      </View>
    );
  };

  handleContent = () => {
    const {tab, schedules, shift} = this.state;

    if (schedules) {
      return Object.values(schedules)
        .filter(val => val.day === new Date().getDate())
        .map(val => {
          return Object.entries(val.shift)
            .filter(([key]) => key === shift.toLowerCase() || tab === 2)
            .map(([key, employee]) => {
              return (
                <View key={`${val.day}-${key}`} style={styles.btnContent}>
                  <View>
                    {Object.entries(employee).map(([id, emp]) => {
                      return (
                        <Text style={styles.textVal} key={id}>
                          {emp}
                        </Text>
                      );
                    })}
                  </View>
                  {tab === 2 && <SmallCard text={key} color="green" />}
                </View>
              );
            });
        });
    } else {
      return this.handleRenderNoData();
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
          <Text style={this.handleStyleActive(1)}>
            Jadwal {this.state.shift}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnTab}
          onPress={() => this.setState({tab: 2})}>
          <Text style={this.handleStyleActive(2)}>Jadwal Hari ini</Text>
        </TouchableOpacity>
      </View>
    );
  };

  handleLogin = () => {
    this.props.navigation.navigate('Login');
  };

  handleButtonFilter = filter => {
    this.initApi(filter);
    this.setState({filter});
  };

  handleFilterData = () => {
    const {filter, rooms} = this.state;
    return rooms.map((room, index) => (
      <ButtonSmall
        key={index}
        text={room}
        active={filter === room}
        onPress={() => this.handleButtonFilter(room)}
      />
    ));
  };

  handleRoom = () => {
    return (
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {this.handleFilterData()}
        </ScrollView>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <Header />
        <View style={styles.viewTopCard}>
          <View>
            <Text style={styles.textCardBold}>{this.state.currentDate}</Text>
            <Text style={styles.textDate}>{this.state.currentTime}</Text>
          </View>
          <SmallCard text={this.state.shift} color={'black'} />
        </View>
        <View style={styles.viewWrapper}>
          {this.handleRenderContent()}
          {this.handleRoom()}
          <ScrollView
            style={styles.viewWrapperContent}
            showsVerticalScrollIndicator={false}>
            {this.handleContent()}
          </ScrollView>
        </View>
        <View style={styles.viewButton}>
          <ButtonLarge onPress={this.handleLogin} text={'Masuk'} />
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
  viewWrapperContent: {
    paddingHorizontal: 20,
  },
  btnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  viewButton: {
    width: '90%',
    marginVertical: 16,
  },
  textDate: {
    color: 'grey',
  },
  textVal: {
    color: 'grey',
  },
  viewMiddle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
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
});
