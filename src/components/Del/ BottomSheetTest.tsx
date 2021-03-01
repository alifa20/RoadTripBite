import React, {useRef} from 'react';
import {Button, SafeAreaView, StyleSheet, Text} from 'react-native';
import BottomSheetContent from '../BottomSheetContent';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import {FlatList} from 'react-native-gesture-handler';

const BottomSheetTest = () => {
  //   const bottomSheetRef = useRef<ScrollBottomSheet<string>>(null);
  // bottomSheetRef.current.snapTo(0)
  //   const bottomSheetRef = React.createRef<ScrollBottomSheet<string>>();
  // const bottomSheetRef = React.useRef<ScrollBottomSheet<string>>();
  // const ref2 = useRef<ScrollBottomSheet<FlatList>>(null);

  // const bottomSheetRef = React.useRef(null);
  const bottomSheetRef = React.createRef<ScrollBottomSheet<FlatList<string>>>();
  const onPress = () => {
    bottomSheetRef.current?.snapTo(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Button title="hey" onPress={onPress} /> */}
      <BottomSheetContent ref={bottomSheetRef} />
    </SafeAreaView>
    // <SafeAreaView>
    //   <Button title="hey" onPress={() => {}} />
    //   <Text>hi</Text>

    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default BottomSheetTest;
