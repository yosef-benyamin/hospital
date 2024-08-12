import React from 'react';
import Home from '../pages/Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Add from '../pages/Add';

const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Add" component={Add} />
    </Stack.Navigator>
  );
};

export default Router;
