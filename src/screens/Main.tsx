import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, StyleSheet, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

const Main = () => {
  const [location, setLocation] = useState({
    coords: {
      latitude: 37.78825,
      longitude: -122.4324,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: 0,
  });
  const [errorMsg, setErrorMsg] = useState<string>();

  useEffect(() => {
    (async () => {
      let status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

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
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // onPanDrag={closeBottomSheet}
      />
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
