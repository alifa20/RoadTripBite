import React, {forwardRef, useRef} from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';

const windowHeight = Dimensions.get('window').height;

// <any, RefObject<FlatList>>
const BottomSheetContent = forwardRef<
  // React.RefObject<ScrollBottomSheet<FlatList<string>>>,
  ScrollBottomSheet<FlatList>,
  any
>((_, ref) => {
  // if (ref === null) return null;
  // const ref = useRef();
  // const ref = React.useRef(null);

  const onPress = () => {
    ref?.current?.snapTo(0);
  };

  return (
    <View style={styles.container}>
      <Button title="hey" onPress={onPress} />
      <ScrollBottomSheet<string> // If you are using TS, that'll infer the renderItem `item` type
        // innerRef={ref2}
        ref={ref}
        componentType="FlatList"
        snapPoints={[128, '50%', windowHeight]}
        initialSnapIndex={2}
        renderHandle={() => (
          <View style={styles.header}>
            <View style={styles.panelHandle} />
          </View>
        )}
        data={Array.from({length: 200}).map((_, i) => String(i))}
        keyExtractor={(i) => i}
        renderItem={({item}: {item: string}) => (
          <View style={styles.item}>
            <Text>{`Item ${item}`}</Text>
          </View>
        )}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </View>
  );
});

export default BottomSheetContent;
// forwardRef<
//   React.RefObject<ScrollBottomSheet<FlatList<string>>>,
//   any
// >(BottomSheetContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: 16,
    backgroundColor: '#F3F4F9',
    // backgroundColor: 'black',
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHandle: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
  },
  item: {
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    marginVertical: 10,
  },
});
