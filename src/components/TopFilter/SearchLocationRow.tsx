import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppStackParamList} from '../../types';
import {PlaceHolder} from '../SearchBar';

export const SearchLocationRow = () => {
  const navigation = useNavigation();
  const route: RouteProp<AppStackParamList, 'Main'> = useRoute();

  const {searchTerm} = route.params;

  return (
    <View style={styles.body}>
      <MaterialCommunityIcons
        name="chevron-left"
        size={28}
        color="white"
        style={styles.icon}
        onPress={() => navigation.navigate('Home', {})}
      />
      <View style={{flex: 1}}>
        <PlaceHolder
          text={searchTerm}
          onPress={() =>
            navigation.navigate('Search', {onKeyboard: true, searchTerm})
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 50,
  },
  icon: {
    marginRight: 5,
    padding: 5,
    borderRadius: 20,
    // borderWidth: 5,
    overflow: 'hidden',
    backgroundColor: 'green',
    borderColor: 'white',
  },
  body: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
