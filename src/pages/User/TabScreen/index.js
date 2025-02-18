import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TabHome from './TabHome';
import TabLeave from './TabLeave';
import TabAccount from './TabAccount';
import {COLOR_GREEN_PRIMARY} from '../../../component/Constant';
import {StyleSheet, Text, View} from 'react-native';
import {Header} from '../../../component/Header';
import SmallCard from '../../../component/SmallCard';
import {MMKV} from 'react-native-mmkv';
import {getShift} from '../../../utils';

const Tab = createBottomTabNavigator();

export function TabScreen(props) {
  const [employee, setEmployee] = useState({});
  const [shift, setShift] = useState('Malam');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const handleCurrentDateTime = () => {
    setCurrentDate(
      new Date().toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    );
    setCurrentTime(new Date().toLocaleTimeString('en-US', {hour12: false}));
  };

  useEffect(() => {
    const storage = new MMKV();

    const jsonUser = storage.getString('employee');
    setEmployee(JSON.parse(jsonUser));

    setInterval(() => {
      handleCurrentDateTime();
      setShift(getShift());
    }, 1000);
  }, []);

  const tabScreen = props.route.params?.tabScreen ?? 'TabHome';
  return (
    <>
      <View style={styles.viewContainer}>
        <Header />
        <View style={styles.viewGreeting}>
          <Text style={styles.textGreeting}>Hi, {employee.Name}</Text>
          <Text style={styles.textGreeting}>{employee.Room}</Text>
        </View>
        <View style={styles.viewTopCard}>
          <View>
            <Text style={styles.textCardBold}>{currentDate}</Text>
            <Text style={styles.textCurrentDate}>{currentTime}</Text>
          </View>
          <SmallCard text={shift} color={'black'} />
        </View>
      </View>

      <Tab.Navigator
        initialRouteName={tabScreen}
        screenOptions={{
          tabBarActiveTintColor: COLOR_GREEN_PRIMARY,
        }}>
        <Tab.Screen
          name="TabHome"
          component={TabHome}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="TabLeave"
          component={TabLeave}
          options={{
            headerShown: false,
            tabBarLabel: 'Cuti',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="pencil" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="TabAccount"
          component={TabAccount}
          options={{
            headerShown: false,
            tabBarLabel: 'Akun',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
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
  textCurrentDate: {
    color: 'grey',
  },
});
