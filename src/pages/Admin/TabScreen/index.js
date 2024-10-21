import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TabHome from './TabHome';
import TabLeave from './TabLeave';
import TabAccount from './TabAccount';
import {COLOR_BLUE} from '../../../component/Constant';

const Tab = createBottomTabNavigator();

export function TabAdmin() {
  return (
    <Tab.Navigator
      initialRouteName="TabHome"
      screenOptions={{
        tabBarActiveTintColor: COLOR_BLUE,
      }}>
      <Tab.Screen
        name="TabHome"
        component={TabHome}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
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
  );
}
