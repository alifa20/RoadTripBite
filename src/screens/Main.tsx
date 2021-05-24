import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyMap3 from '../components/MyMap3';
import {PlaceHolder, SearchBar} from '../components/SearchBar';
import {AppStackParamList} from '../types';

// import MyMapView from '../components/MyMapView';

// const Main = () => <MyMapView />;
// const Main = () => <AnimatedViews />;
// const Main = () => <MyMap2 />;

interface Props {
  navigation: StackNavigationProp<AppStackParamList, 'Main'>;
  route: RouteProp<AppStackParamList, 'Main'>;
}

const Main = ({route, navigation}: Props) => {
  const onSearchComplete = () => {};
  const {searchTerm} = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={32}
          color="green"
          style={{marginRight: 5}}
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
      <MyMap3 />
    </SafeAreaView>
  );
};

// const Main = () => <MyMap4 />;

// const Main = () => <BottomSheetTest />;

// const Main = () => <TestDetails />;

// const Main = () => <TestImage />;

// const {width} = Dimensions.get('window');
// const CARD_HEIGHT = 220 / 2;
// const CARD_WIDTH = width * 0.8;

// const temp =
//   'https://lh3.googleusercontent.com/p/AF1QipNdcOCXMZw68I_bc3YRPdc38RAihN5rKGOhX0lj=s1600-w331-h110';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 50,
  },
  body: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Main;
