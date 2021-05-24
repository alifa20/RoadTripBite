import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import Search from './screens/Search';
import Home from './screens/Home';
import Main from './screens/Main';
import {AppStackParamList} from './types';

const Stack = createStackNavigator<AppStackParamList>();

export const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Main" component={Main} />
    <Stack.Screen name="Search" component={Search} />
  </Stack.Navigator>
);
