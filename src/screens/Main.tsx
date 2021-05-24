import MyMap3 from '../components/MyMap3';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {SearchBar} from '../components/SearchBar';

// import MyMapView from '../components/MyMapView';

// const Main = () => <MyMapView />;
// const Main = () => <AnimatedViews />;
// const Main = () => <MyMap2 />;
const Main = () => {
  const onSearchComplete = () => {};
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <SearchBar onComplete={onSearchComplete} />
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
  },
});

export default Main;
