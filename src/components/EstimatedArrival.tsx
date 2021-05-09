import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LatLng, Marker} from 'react-native-maps';
import {getNewTimeFormatted} from '../utils/timeUtil';
import {Beacon} from './Beacon';
import {useTickTime} from './MyMap2/useTickTime';

interface Props {
  coordinate: LatLng;
  km: number;
  footerHeight: number;
  travelTool?: {icon: string; value: string; speed: number};
}
const EstimatedArrival = ({
  coordinate,
  km,
  footerHeight,
  travelTool = {icon: 'car-hatchback', value: 'Going by Car', speed: 30},
}: Props) => {
  const {date} = useTickTime();
  const estimatedTime = getNewTimeFormatted(date, km, travelTool.speed);
  return (
    <View style={[styles.container, {bottom: footerHeight + 70}]}>
      <View
        style={[
          styles.markerTooltip,
          // {width: 250}
        ]}>
        <Text style={styles.textStyle}>Estimated arrival {estimatedTime}</Text>
        {/* <Text style={styles.textStyle}>{estimatedTime} </Text> */}
      </View>
      {/* <View style={styles.timeContainer}>
        <View style={styles.time}>
          <Text style={styles.textStyle}>{estimatedTime} </Text>
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // position: 'relative',
    // top: '45%',
    left: '30%',
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // paddingBottom: 20,
    // bottom: 20,
    // right: '20%',
    // alignSelf: 'flex-end',
  },
  markerTooltip: {
    paddingHorizontal: 10,
    alignItems: 'center',
    // marginBottom: 10,
    // position: 'relative',
    // top: -100,
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
    // marginBottom: 10,
    // position: 'relative',
    // top: -100,
    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  textStyle: {textAlign: 'center'},
});

export default EstimatedArrival;
