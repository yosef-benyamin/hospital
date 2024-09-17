import React from 'react';
import Home from '../pages/Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Add from '../pages/Add';
import Login from '../pages/Login';

const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Add" component={Add} />
    </Stack.Navigator>
  );
};

export default Router;
