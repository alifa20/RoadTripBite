import React, {forwardRef} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import Chip from './TopFilter/Chip';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TravelTool} from './TopFilter/types';

const windowHeight = Dimensions.get('window').height;
interface Props {
  selected?: string;
  onTravelToolPress: (value: TravelTool) => void;
}

const items = [
  {
    icon: 'bus-school',
    value: 'In/on a car/bus',
    text: 'Am in/on a car/bus',
    speed: 30,
  },

  {
    icon: 'car-sports',
    value: 'On a highway',
    text: 'Driving on a high way',
    speed: 80,
  },
  {
    icon: 'train',
    value: 'Am on a train',
    text: 'Am on a train',
    speed: 60,
  },
  {
    icon: 'bike',
    value: 'Going by bicycle',
    text: 'Am cycling',
    speed: 15,
  },
  {
    icon: 'walk',
    value: 'Walking',
    text: 'I am walking',
    speed: 15,
  },
];
const GoBySelector = forwardRef<ScrollBottomSheet<ScrollView>, Props>(
  ({onTravelToolPress, selected = ''}, ref) => {
    return (
      <ScrollBottomSheet
        ref={ref}
        componentType="ScrollView"
        snapPoints={['60%', windowHeight]}
        initialSnapIndex={1}
        renderHandle={() => (
          <View style={styles.header}>
            <View style={styles.panelHandle} />
          </View>
        )}
        data={Array.from({length: 200}).map((_, i) => String(i))}
        contentContainerStyle={styles.contentContainerStyle}>
        <View>
          {items.map((item, i) => (
            <Chip
              key={item.icon}
              icon={
                <MaterialCommunityIcons
                  name={item.icon}
                  size={16}
                  color="green"
                  style={{marginRight: 5}}
                />
              }
              selected={selected === item.value}
              onPress={() =>
                onTravelToolPress({
                  icon: item.icon,
                  value: item.value,
                  speed: item.speed,
                })
              }
              {...(i > 0 && {...{style: styles.chip}})}>
              <Text>{item.text}</Text>
            </Chip>
          ))}
        </View>
      </ScrollBottomSheet>
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
