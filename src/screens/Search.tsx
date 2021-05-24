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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  navigation: StackNavigationProp<AppStackParamList, 'Search'>;
  route: RouteProp<AppStackParamList, 'Search'>;
}

const Search = ({navigation, route}: Props) => {
  const onSearchComplete = (address: string) => {};
  const navigate = useNavigation();

  const {onKeyboard, searchTerm} = route.params;

  useEffect(() => {
    if (onKeyboard) {
      ref.current?.focus();
    }
  }, [route.params]);

  const ref = createRef<TextInput>();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.body}>
          <View style={styles.arrow}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color="green"
              style={{marginRight: 5}}
              onPress={() => navigation.navigate('Main', {searchTerm})}
            />
          </View>
          <View style={{flex: 1}}>
            <SearchBar
              onComplete={onSearchComplete}
              searchTerm={searchTerm}
              ref={ref}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 50,
  },
  arrow: {
    paddingTop: 10,
  },
  body: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
export default Search;
