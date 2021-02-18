import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, StyleSheet, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

import RNLocation, {Location} from 'react-native-location';
import {TopFilter} from '../components/TopFilter';

RNLocation.configure({
  distanceFilter: undefined,
});

const Main = () => {
  const [location, setLocation] = useState<Location>({
    // coords: {
    // latitude: 37.78825,
    // longitude: -122.4324,
    latitude: -33.84795,
    longitude: 151.0744,
    altitude: 0,
    accuracy: 0,
    altitudeAccuracy: 0,
    course: 0,
    // heading:null,
    speed: 0,
    // },
    timestamp: 0,
  });

  //   {"accuracy": 5, "altitude": 0, "altitudeAccuracy": -1, "course": -1, "floor": 0, "latitude": 37.785834, "longitude": -122.406417, "speed": -1, "timestamp": 1612052334970.0962}
  const [errorMsg, setErrorMsg] = useState<string>();

  useEffect(() => {
    (async () => {
      let permission = await RNLocation.checkPermission({
        ios: 'whenInUse', // or 'always'
        android: {
          detail: 'coarse', // or 'fine'
          rationale: {
            title: 'We need to access your location',
            message: 'We use your location to show where you are on the map',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      });

      console.log('here2');
      console.log('permission', permission);

      if (!permission) {
        permission = await RNLocation.requestPermission({
          ios: 'whenInUse', // or 'always'
          android: {
            detail: 'coarse', // or 'fine'
            rationale: {
              title: 'We need to access your location',
              message: 'We use your location to show where you are on the map',
              buttonPositive: 'OK',
              buttonNegative: 'Cancel',
            },
          },
        });
      }

      const latestLocation = await RNLocation.getLatestLocation({
        timeout: 60000,
      });
      if (latestLocation) {
        const loc = {
          coords: {
            latitude: latestLocation.latitude,
            longitude: latestLocation.longitude,
            altitude: latestLocation.altitude,
            accuracy: latestLocation.accuracy,
            altitudeAccuracy: latestLocation.altitudeAccuracy,
            heading: null,
            speed: latestLocation.speed,
          },
          timestamp: latestLocation.timestamp,
        };
        // setLocation(loc);
        // setLocation(latestLocation);
        console.log('latestLocation', latestLocation);
      }
      //   let status = await PermissionsAndroid.request(
      //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      //   );
      //   if (status !== 'granted') {
      //     setErrorMsg('Permission to access location was denied');
      //     return;
      //   }

      //   let location = await Location.getCurrentPositionAsync({});
      //   setLocation(location);
    })();
  }, []);

  //  const  findCoordinates = () => {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const location = JSON.stringify(position);

  //         this.setState({location});
  //       },
  //       (error) => Alert.alert(error.message),
  //       {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
  //     );
  //   };

  return (
    <View style={styles.container}>
      {/* <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      region={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}></MapView> */}

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // onPanDrag={closeBottomSheet}
      />
      <TopFilter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Main;
