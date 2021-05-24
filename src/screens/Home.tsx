import {RouteProp, useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {createRef, useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {SearchBar} from '../components/SearchBar';
import {AppStackParamList} from '../types';

const Search = () => {
  const onSearchComplete = (address: string) => {};
  const navigate = useNavigation();

  const ref = createRef<TextInput>();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.body}>
          <SearchBar onComplete={onSearchComplete} ref={ref} />
        </View>
        <Button
          title="test"
          onPress={() => {
            navigate.navigate('Main', {searchTerm: 'Olympic'});
          }}
        />

        <Button
          title="test"
          onPress={() => {
            navigate.navigate('Main', {searchTerm: 'Melbourne'});
          }}
        />

        <Button
          title="focus"
          onPress={() => {
            ref.current?.focus();
          }}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 50,
  },
  body: {
    paddingHorizontal: 20,
  },
});
export default Search;
