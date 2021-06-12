import {useNavigation} from '@react-navigation/core';
import React, {createRef} from 'react';
import {
  Button,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import BigAddCard from '../components/MyMap3/Ads/BigAddCard';
import {GooglePlacesInput} from '../components/MyMap3/GooglePlacesInput';
import {SearchBar} from '../components/SearchBar';

const {width} = Dimensions.get('window');

const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;

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
          <GooglePlacesInput />
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
        </View>

        <BigAddCard
          size={`${Math.floor(CARD_WIDTH)}x${Math.floor(CARD_HEIGHT)}`}
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
    flex: 1,
  },
});

export default Search;
