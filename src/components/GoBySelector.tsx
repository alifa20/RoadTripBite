import React, {forwardRef} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import Chip from './TopFilter/Chip';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TravelTool} from './TopFilter/types';

const windowHeight = Dimensions.get('window').height;

interface Props {
  onTravelToolPress: (value: TravelTool) => void;
}
const GoBySelector = forwardRef<ScrollBottomSheet<ScrollView>, Props>(
  ({onTravelToolPress}, ref) => {
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
          <Chip
            icon={
              <MaterialCommunityIcons
                // name="walk"
                // name="bike"
                name="bus-school"
                size={16}
                color="green"
                style={{marginRight: 5}}
              />
            }
            selected={true}
            onPress={() =>
              onTravelToolPress({
                icon: 'bus-school',
                value: 'Go by car',
                speed: 30,
              })
            }>
            <Text>Go by car/bus</Text>
          </Chip>
          <Chip
            icon={
              <MaterialCommunityIcons
                // name="walk"
                // name="bike"
                name="car-sports"
                size={16}
                color="green"
                style={{marginRight: 5}}
              />
            }
            style={styles.chip}
            onPress={() =>
              onTravelToolPress({
                icon: 'car-sports',
                value: 'On a highway',
                speed: 80,
              })
            }>
            <Text>Drive on a high way</Text>
          </Chip>
          <Chip
            style={styles.chip}
            icon={
              <MaterialCommunityIcons
                // name="walk"
                // name="bike"
                name="train"
                size={16}
                color="green"
                style={{marginRight: 5}}
              />
            }
            onPress={() =>
              onTravelToolPress({
                icon: 'train',
                value: 'Go by train',
                speed: 60,
              })
            }>
            <Text>Go by train</Text>
          </Chip>
          <Chip
            style={styles.chip}
            icon={
              <MaterialCommunityIcons
                // name="walk"
                // name="bike"
                name="bike"
                size={16}
                color="green"
                style={{marginRight: 5}}
              />
            }
            onPress={() =>
              onTravelToolPress({
                icon: 'bike',
                value: 'Go by bicycle',
                speed: 10,
              })
            }>
            <Text>Go by bicycle</Text>
          </Chip>
          <Chip
            style={styles.chip}
            icon={
              <MaterialCommunityIcons
                // name="walk"
                // name="bike"
                name="walk"
                size={16}
                color="green"
                style={{marginRight: 5}}
              />
            }
            onPress={() =>
              onTravelToolPress({icon: 'walk', value: 'Walking', speed: 2})
            }>
            <Text>Walk</Text>
          </Chip>
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
    alignItems: 'center',
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
  chip: {
    marginTop: 20,
  },
});

export default GoBySelector;
