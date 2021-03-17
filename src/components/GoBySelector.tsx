import React, {forwardRef} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';

const windowHeight = Dimensions.get('window').height;

interface Props {
  ref: React.RefObject<ScrollBottomSheet<ScrollView>>;
}
const GoBySelector = forwardRef<ScrollBottomSheet<ScrollView>, Props>(
  (_, ref) => {
    return (
      //   <View style={styles.container}>
      <ScrollBottomSheet
        ref={ref}
        componentType="ScrollView"
        snapPoints={['60%', windowHeight]}
        initialSnapIndex={0}
        renderHandle={() => (
          <View style={styles.header}>
            <View style={styles.panelHandle} />
          </View>
        )}
        data={Array.from({length: 200}).map((_, i) => String(i))}
        contentContainerStyle={styles.contentContainerStyle}>
        <View>
          <Text>hi</Text>
        </View>
      </ScrollBottomSheet>
      //   </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: 16,
    backgroundColor: '#F3F4F9',
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

export default GoBySelector;
