import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export const GooglePlacesInput = () => {
  const navigate = useNavigation();

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          navigate.navigate('Main', {searchTerm: data.description});
          // console.log(JSON.stringify({data, details}));
        }}
        onFail={(error) => console.error(error)}
        query={{
          key: 'AIzaSyCwTHpLD23nVmwcVdIFqCj40EiTus7zh8M',
          language: 'en',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
  },
});
