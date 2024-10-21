import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Header} from '../../component/Header';
import SmallCard from '../../component/SmallCard';
import {ButtonLarge} from '../../component/ButtonLarge';
import {child, get, getDatabase, ref} from 'firebase/database';
import {firebaseInit} from '../../config/firebaseInit';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      schedules: {},
      shift: 'Malam',
    };
  }

  componentDidMount = () => {
    // Pagi: 00.00 - 08.00
    // Siang: 08.00 - 16.00
    // Malam: 16.00 - 00.00

    const currentDate = new Date().toLocaleDateString('en-CA');

    const db = ref(getDatabase(firebaseInit));
    get(child(db, `schedules/${currentDate}`)).then(snapshot => {
      if (snapshot.exists()) {
        this.setState({schedules: snapshot.val()});
      } else {
        console.log('No Data Available');
      }
    });

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

  handleContent = () => {
    const {tab, schedules, shift} = this.state;

    const renderEmployees = employees =>
      Object.values(employees).map((val, index) => (
        <Text style={styles.textVal} key={index}>
          {val}
        </Text>
      ));

    const renderRoom = (rooms, shifts) =>
      Object.entries(shifts).map(([shiftName, employees]) => {
        const key = `${rooms}-${shiftName}`;
        const isExpanded = this.state[key];

        if (tab === 1 && shiftName.toLowerCase() !== shift.toLowerCase()) {
          return null;
        }

        return (
          <TouchableOpacity
            key={key}
            style={styles.btnContent}
            onPress={() => this.toggleExpand(key)}>
            <View>
              <Text style={styles.textBold}>{rooms}</Text>
              {(tab === 1 || isExpanded) && renderEmployees(employees)}
            </View>
            {tab === 2 && <SmallCard text={shiftName} color="blue" />}
          </TouchableOpacity>
        );
      });

    return Object.entries(schedules).flatMap(([rooms, shifts]) =>
      renderRoom(rooms, shifts),
    );
  };

  toggleExpand = key => {
    this.setState(prevState => ({[key]: !prevState[key]}));
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
  viewButton: {
    width: '90%',
    marginVertical: 16,
  },
  viewText: {
    paddingVertical: 10,
  },
  textDate: {
    color: 'grey',
  },
  textVal: {
    color: 'grey',
  },
});
