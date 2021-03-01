import React, {forwardRef, useEffect, useState} from 'react';
import {Text, Dimensions, FlatList, StyleSheet, View} from 'react-native';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import {getDetails} from '../api/details';
import {Place, PlaceDetail} from '../api/types';

const windowHeight = Dimensions.get('window').height;

interface Props {
  marker: Place | null;
}
// <any, RefObject<FlatList>>
const BottomSheetContent = forwardRef<
  // React.RefObject<ScrollBottomSheet<FlatList<string>>>,
  ScrollBottomSheet<FlatList>,
  Props
>(({marker}, ref) => {
  const [details, setDetails] = useState<PlaceDetail | null>(null);
  useEffect(() => {
    if (!marker) return;
    (async () => {
      const d: PlaceDetail = await getDetails(marker.place_id);
      setDetails(d);
    })();
  }, [marker]);

  // console.log('dddddd', JSON.stringify(details?.photos));

  // if (ref === null) return null;
  // const ref = useRef();
  // const ref = React.useRef(null);

  // const onPress = () => {
  //   ref?.current?.snapTo(0);
  // };

  return (
    // <View style={styles.container}>
    //   <Button title="hey" onPress={onPress} />
    <ScrollBottomSheet<PlaceDetail['photos'][0]> // If you are using TS, that'll infer the renderItem `item` type
      // innerRef={ref2}
      ref={ref}
      componentType="FlatList"
      snapPoints={[128, '50%', '100%']}
      initialSnapIndex={2}
      renderHandle={() => (
        <View style={styles.header}>
          <View style={styles.panelHandle} />
        </View>
      )}
      data={details?.photos || []}
      keyExtractor={({photo_reference}) => photo_reference}
      renderItem={({item}: {item: PlaceDetail['photos'][0]}) => (
        <View style={styles.item}>
          <Text>{item.photo_reference}</Text>
        </View>
      )}
      contentContainerStyle={styles.contentContainerStyle}
    />
    // </View>
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
