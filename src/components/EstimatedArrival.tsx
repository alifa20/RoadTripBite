import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LatLng} from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getNewTimeFormatted} from '../utils/timeUtil';
import {useTickTime} from './MyMap2/useTickTime';

interface Props {
  coordinate: LatLng;
  km: number;
  footerHeight: number;
  startSource: LatLng;
  endDestination: LatLng;
  duration: number;
  distance: number;
  travelTool?: {icon: string; value: string; speed: number};
}
const EstimatedArrival = ({
  coordinate,
  km,
  endDestination,
  duration,
  distance,
  travelTool = {icon: 'car-hatchback', value: 'Going by Car', speed: 30},
}: Props) => {
  const {date} = useTickTime();
  const estimatedTime = getNewTimeFormatted(date, km, travelTool.speed);
  return (
    <View style={[styles.container]}>
      <View style={[styles.markerTooltip]}>
        <Text style={styles.textStyle}>Estimated arrival {estimatedTime}</Text>
        <View style={StyleSheet.flatten([styles.triangle, styles.down])} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    left: '30%',
    top: '50%',

    backgroundColor: 'grey',
    borderRadius: 15,
    padding: 1,
  },
  markerTooltip: {
    paddingHorizontal: 10,
    alignItems: 'center',

    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    paddingTop: 2,
  },
  time: {
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  textStyle: {textAlign: 'center'},
  icon: {
    position: 'absolute',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'grey',
    position: 'absolute',
    bottom: -15,
  },
  down: {transform: [{rotate: '180deg'}]},
});

export default EstimatedArrival;
