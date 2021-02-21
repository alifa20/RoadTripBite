import React, {createRef, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import RNLocation, {Location} from 'react-native-location';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {Place} from '../api/types';
import {TopFilter} from '../components/TopFilter';

RNLocation.configure({
  distanceFilter: undefined,
});

const tempPlaces: Place[] = [
  {
    business_status: 'OPERATIONAL',
    geometry: {
      location: {
        // lat: -33.8611745,
        // lng: 151.2065374,
        lat: -33.846834,
        lng: 151.071645,
      },
      viewport: {
        northeast: {
          lat: -33.85977857010727,
          lng: 151.2077378798927,
        },
        southwest: {
          lat: -33.86247822989272,
          lng: 151.2050382201073,
        },
      },
    },
    icon:
      'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
    name: 'Altitude',
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 3024,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/107534161672426292836">Beau Yoo</a>',
        ],
        photo_reference:
          'ATtYBwKXw-CL3t7gOnD_5UNQrVwKXBH6baz9bwXBSnMfiIMzJnoYkl7QlP3Umy2q8T-Rth0eJHScUTRfKIC8SV1QTYBK9KTt1ZRrWiOlFMBTqizhjPwjXbdJrXHqWLfAuqIKwXDvT34jnmU0KxNXfF-VPfMzSYGKuajFvSbwWm6jT-hPfcWs',
        width: 4032,
      },
    ],
    place_id: 'ChIJsyWauUOuEmsR-_JBt78Eo-Q',
    plus_code: {
      compound_code: '46Q4+GJ Sydney, New South Wales',
      global_code: '4RRH46Q4+GJ',
    },
    price_level: 4,
    rating: 3.6,
    reference: 'ChIJsyWauUOuEmsR-_JBt78Eo-Q',
    scope: 'GOOGLE',
    types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
    user_ratings_total: 458,
    vicinity: '176 Cumberland St, Sydney',
  },
];
const Main = () => {
  // const mapRef = useRef();
  const mapView = createRef<MapView>();

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

  const [markers, setMarkers] = useState<Place[]>(tempPlaces);
  //   {"accuracy": 5, "altitude": 0, "altitudeAccuracy": -1, "course": -1, "floor": 0, "latitude": 37.785834, "longitude": -122.406417, "speed": -1, "timestamp": 1612052334970.0962}
  const [errorMsg, setErrorMsg] = useState<string>();

  const searchFinished = (places: Place[]) => {
    setMarkers([places[0]]);
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
    // if (mapView.current) {
    //   // list of _id's must same that has been provided to the identifier props of the Marker
    //   mapView.current.fitToSuppliedMarkers(
    //     markers.map(({place_id}) => place_id),
    //   );
    // }
  }, [markers]);

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
          longitudeDelta: 0.0421,
        }}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.geometry.location.lat * 100000,
              longitude: marker.geometry.location.lng * 100000,
            }}
            title={marker.name}
            description={String(marker.rating)}
          />
        ))}
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

export default Main;
