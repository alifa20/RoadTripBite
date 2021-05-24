/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {AppStack} from './src/Stack';

declare const global: {HermesInternal: null | {}};

// const App = () => <Main />;

const App = () => (
  <NavigationContainer>
    <AppStack />
  </NavigationContainer>
);

export default App;
