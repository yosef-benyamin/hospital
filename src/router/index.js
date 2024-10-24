import React from 'react';
import Home from '../pages/Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Add from '../pages/Add';
import Login from '../pages/Login';
import LandingPage from '../pages/LandingPage';
import {TabScreen} from '../pages/User/TabScreen';
import FormLeave from '../pages/FormLeave';
import {TabAdmin} from '../pages/Admin/TabScreen';
import FormApproval from '../pages/FormApproval';
import ChangePassword from '../pages/ChangePassword';

const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LandingPage"
        component={LandingPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Add" component={Add} />
      <Stack.Screen
        name="TabScreen"
        component={TabScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TabAdmin"
        component={TabAdmin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FormLeave"
        component={FormLeave}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FormApproval"
        component={FormApproval}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Router;
