import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Button, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {SearchBar} from '../components/SearchBar';

const Home = () => {
  const onSearchComplete = (address: string) => {};
  const navigate = useNavigation();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.body}>
          <SearchBar onComplete={onSearchComplete} />
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
export default Home;
