import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LatLng, Marker} from 'react-native-maps';
import {getNewTimeFormatted} from '../utils/timeUtil';
import {Beacon} from './Beacon';
import {useTickTime} from './MyMap2/useTickTime';

interface Props {
  coordinate: LatLng;
  km: number;
  travelTool?: {icon: string; value: string; speed: number};
}
const CurrentLocationBeacon = ({
  coordinate,
  km,
  travelTool = {icon: 'car-hatchback', value: 'Going by Car', speed: 30},
}: Props) => {
  // const {date} = useTickTime();
  // const estimatedTime = getNewTimeFormatted(date, km, travelTool.speed);
  return (
    <Marker
      coordinate={{
        ...coordinate,
        latitude: coordinate.latitude - 0.011,
      }}>
      <View style={styles.container}>
        <Beacon
          play={true}
          onPress={() => {}}
          width={5}
          height={5}
          color1="#c6abd4"
          color2="purple"
        />
        {/*  <View style={styles.markerTooltip}>
         <Text style={styles.textStyle}>
            Estimated arrival {estimatedTime}
          </Text>
        </View> */}
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: 150,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  markerTooltip: {
    width: 150,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
    top: -100,
    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 5,
  },
  textStyle: {textAlign: 'center'},
});

export default CurrentLocationBeacon;
