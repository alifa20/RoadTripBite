import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import Home from './screens/Home';
import Main from './screens/Main';

const Stack = createStackNavigator();

export const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Main" component={Main} />
  </Stack.Navigator>
);
