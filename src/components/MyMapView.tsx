import React, {createRef, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import RNLocation, {Location} from 'react-native-location';
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {Place} from '../api/types';
import {TopFilter} from '../components/TopFilter';
// import {tempPlaces} from './tempPlaces';

RNLocation.configure({
  distanceFilter: undefined,
});

const MyMapView = () => {
  // const mapRef = useRef();
  const mapView = createRef<MapView>();

  const circleRadius = 10000;
  const [location, setLocation] = useState<Location>({
    // coords: {
    // latitude: 37.78825,
    // longitude: -122.4324,
    latitude: -33.84795,
    longitude: 151.0744,
    // latitude: -33.86706373913634,
    // longitude: 151.2025172263384,
    altitude: 0,
    accuracy: 0,
    altitudeAccuracy: 0,
    course: 0,
    // heading:null,
    speed: 0,
    // },
    timestamp: 0,
  });

  const [markers, setMarkers] = useState<Place[]>([]);
  //   {"accuracy": 5, "altitude": 0, "altitudeAccuracy": -1, "course": -1, "floor": 0, "latitude": 37.785834, "longitude": -122.406417, "speed": -1, "timestamp": 1612052334970.0962}
  const [errorMsg, setErrorMsg] = useState<string>();

  const searchFinished = (places: Place[]) => {
    setMarkers(places);
  };

  const onRegionChange = (region: Region) => {
    console.log('region', region);
  };
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
  // Call fitToSuppliedMarkers() method on the MapView after markers get updated
  useEffect(() => {
    if (mapView.current) {
      // list of _id's must same that has been provided to the identifier props of the Marker
      mapView.current.fitToSuppliedMarkers(
        markers.map(({place_id}) => place_id),
      );
    }
  }, [markers]);

  return (
    <View style={styles.container}>
      <MapView
        // ref={mapRef}
        ref={mapView}
        // ref={() => mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        onRegionChange={onRegionChange}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          // latitudeDelta: 1,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={location}
          title="Me"
          pinColor="lime"
          // description={String(marker.rating)}
        />
        {markers.map((marker) => (
          <Marker
            key={marker.place_id}
            identifier={marker.place_id}
            coordinate={{
              latitude: marker.geometry.location.lat,
              longitude: marker.geometry.location.lng,
            }}
            title={marker.name}
            description={String(marker.rating)}
          />
        ))}
        <Circle
          center={location}
          radius={circleRadius}
          strokeColor="#ffb996"
          fillColor="rgba(246, 126, 125, 0.5)"
        />
      </MapView>
      <TopFilter searchFinished={searchFinished} />
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

export default MyMapView;
