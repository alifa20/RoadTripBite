import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import MapView, {
  EventUserLocation,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import {Place, PlaceDetail} from '../../api/types';
import {getDistanceFromLatLonInKm} from '../../utils/getDistanceFromLatLonInKm';
import {getNewTimeFormatted} from '../../utils/timeUtil';
import BottomSheetContent from '../BottomSheetContent';
import CurrentLocationBeacon from '../CurrentLocationBeacon';
import EstimatedArrival from '../EstimatedArrival';
import GoBySelector from '../GoBySelector';
import {TopFilter} from '../TopFilter';
import {TravelTool} from '../TopFilter/types';
import DetailCard from './DetailCard';
import {mapStandardStyle, markers} from './mapData';
import {useTickTime} from './useTickTime';

// import {useTheme} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const MyMap2 = () => {
  //   const theme = useTheme();
  const [direction, setDirection] = useState(12);
  const [km, setKm] = useState(0);
  const initialMapState = {
    markers,
    // categories: [
    //   {
    //     name: 'Fastfood Center',
    //     icon: (
    //       <MaterialCommunityIcons
    //         style={styles.chipsIcon}
    //         name="food-fork-drink"
    //         size={18}
    //       />
    //     ),
    //   },
    //   {
    //     name: 'Restaurant',
    //     icon: (
    //       <Ionicons name="ios-restaurant" style={styles.chipsIcon} size={18} />
    //     ),
    //   },
    //   {
    //     name: 'Dineouts',
    //     icon: (
    //       <Ionicons name="md-restaurant" style={styles.chipsIcon} size={18} />
    //     ),
    //   },
    //   {
    //     name: 'Snacks Corner',
    //     icon: (
    //       <MaterialCommunityIcons
    //         name="food"
    //         style={styles.chipsIcon}
    //         size={18}
    //       />
    //     ),
    //   },
    //   {
    //     name: 'Hotel',
    //     icon: <Fontisto name="hotel" style={styles.chipsIcon} size={15} />,
    //   },
    // ],
    region: {
      // latitude: 22.62938671242907,
      // longitude: 88.4354486029795,
      // latitude: -33.84795,
      latitude: -33.84796,
      longitude: 151.07443,
      // latitude: -33.86795,
      // longitude: 151.2744,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
  };

  const [mapState, setMapState] = useState(initialMapState);
  // const [details, setDetails] = useState<PlaceDetail>(null);
  const [selectedMarker, setSelectedMarker] = useState<Place | null>(null);
  const [travelTool, setTravelTool] = useState<TravelTool>();
  const [showSearch, setShowSearch] = useState(false);
  const [radius, setRadius] = useState(1000);
  const {date} = useTickTime();

  const estimatedTime = getNewTimeFormatted(date, km, travelTool?.speed);

  const [current, setCurrent] = useState<
    EventUserLocation['nativeEvent']['coordinate']
  >({
    latitude: initialMapState.region.latitude,
    longitude: initialMapState.region.longitude,
    altitude: 0,
    timestamp: 0,
    accuracy: 0,
    speed: 0,
    heading: 0,
    isFromMockProvider: true,
  });
  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);
  const bottomSheetRef = React.createRef<
    ScrollBottomSheet<PlaceDetail['photos'][0]>
  >();
  const goBySheetRef = React.createRef<ScrollBottomSheet<ScrollView>>();

  const onUserLocationChange = (event: EventUserLocation) => {
    console.log('event', event.nativeEvent.coordinate.heading);
    setDirection(event.nativeEvent.coordinate.heading);
    // latitudeDelta * 69

    // setCurrent(event.nativeEvent.coordinate);
    // setCurrent({
    //   latitude: initialMapState.region.latitude,
    //   longitude: initialMapState.region.longitude,
    //   altitude: 0,
    //   timestamp: 0,
    //   accuracy: 0,
    //   speed: 0,
    //   heading: 0,
    //   isFromMockProvider: true,
    // });
  };

  useEffect(() => {
    mapAnimation.addListener(({value}) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= mapState.markers.length) {
        index = mapState.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const {geometry} = mapState.markers[index];
          _map?.current?.animateToRegion(
            {
              latitude: geometry.location.lat,
              longitude: geometry.location.lng,
              latitudeDelta: mapState.region.latitudeDelta,
              longitudeDelta: mapState.region.longitudeDelta,
            },
            350,
          );
        }
      }, 10);
      clearTimeout(regionTimeout);
    });
  });

  const interpolations = mapState.markers.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: 'clamp',
    });

    return {scale};
  });

  const onMarkerPress = (mapEventData: any) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView?.current?.scrollTo({x: x, y: 0, animated: true});
  };

  const _map = React.useRef<MapView>(null);
  const _scrollView = React.useRef<ScrollView>(null);

  // const onSearch = async () => {
  //   const places = await getPlaces();
  //   setState({...state, markers: places});

  //   _map.current.animateToRegion({
  //     latitude: places[0].geometry.location.lat,
  //     longitude: places[0].geometry.location.lng,
  //     latitudeDelta: state.region.latitudeDelta,
  //     longitudeDelta: state.region.longitudeDelta,
  //   });
  // };

  const searchFinished = (places: Place[]) => {
    setShowSearch(false);
    if (places.length > 0) {
      setMapState({...mapState, markers: places});
      _map.current?.fitToSuppliedMarkers(
        places.map((marker) => marker.place_id),
        {edgePadding: {top: 50, right: 50, bottom: 50, left: 50}},
      );
    }

    // _map.current?.fitToCoordinates(
    //   [
    //     {
    //       latitude: places[20].geometry.location.lat,
    //       longitude: places[20].geometry.location.lng,
    //     },
    //   ],
    //   {
    //     // markers.map((marker) => ({
    //     //   latitude: marker.geometry.location.lat,
    //     //   longitude: marker.geometry.location.lng,
    //     // })
    //     // ),
    //   },
    // );
    // _map.current.animateToRegion({
    //   latitude: places[0].geometry.location.lat,
    //   longitude: places[0].geometry.location.lng,
    //   latitudeDelta: state.region.latitudeDelta,
    //   longitudeDelta: state.region.longitudeDelta,
    // });
  };

  const detailPressed = async (marker: Place) => {
    setSelectedMarker(marker);
    bottomSheetRef.current?.snapTo(0);
  };

  const [mapWidth, setMapWidth] = useState('99%');

  // Update map style to force a re-render to make sure the geolocation button appears
  const updateMapStyle = () => {
    setMapWidth('100%');
  };

  // Request geolocation in Android since it's not done automatically
  const requestGeoLocationPermission = () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  };

  const onRegionChangeComplete = (region: Region) => {
    // const st = `${region.latitude}, ${region.longitude}`;
    // const st = Math.round(
    //   getDistanceFromLatLonInKm(
    //     current.latitude,
    //     current.longitude,
    //     region.latitude,
    //     region.longitude,
    //   ) * 1000,
    // );

    const rad = (region.latitudeDelta * 69000) / 2; // 69 is for km
    console.log('radius', radius);

    const st = getDistanceFromLatLonInKm(
      // current.latitude,
      // current.longitude,
      mapState.region.latitude,
      mapState.region.longitude,
      region.latitude,
      region.longitude,
    );
    setKm(st);
    setRadius(rad);
    if (st > 0.5) setShowSearch(true);
    setMapState({...mapState, region});
  };
  const goByPressed = () => {
    goBySheetRef.current?.snapTo(0);
  };

  const onTravelToolPress = (value: TravelTool) => {
    goBySheetRef.current?.snapTo(1);
    setTravelTool(value);
  };

  const onMapPress = () => {
    goBySheetRef.current?.snapTo(1);
    bottomSheetRef.current?.snapTo(2);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
        initialRegion={mapState.region}
        style={[styles.container, {width: mapWidth}]}
        provider={PROVIDER_GOOGLE}
        // customMapStyle={theme.dark ? mapDarkStyle : mapStandardStyle}
        customMapStyle={mapStandardStyle}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        followsUserLocation={true}
        loadingEnabled={true}
        toolbarEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        onUserLocationChange={onUserLocationChange}
        onPress={onMapPress}
        onMapReady={() => {
          requestGeoLocationPermission();
          updateMapStyle();
        }}
        onRegionChangeComplete={onRegionChangeComplete}>
        <CurrentLocationBeacon coordinate={mapState.region} km={km} />
        {mapState.markers.map((marker, index) => {
          const scaleStyle = {
            transform: [{scale: interpolations[index].scale}],
          };
          return (
            <Marker
              key={index}
              //   coordinate={marker.coordinate}
              coordinate={{
                latitude: marker.geometry.location.lat,
                longitude: marker.geometry.location.lng,
              }}
              onPress={(e) => onMarkerPress(e)}
              title={marker.name}
              identifier={marker.place_id}>
              <Animated.View style={[styles.markerWrap]}>
                <Animated.Image
                  source={require('./assets/map_marker.png')}
                  style={[styles.marker, scaleStyle]}
                  resizeMode="cover"
                />
              </Animated.View>
            </Marker>
          );
        })}
      </MapView>
      {/* <View style={styles.searchBox}>
        <TextInput
          placeholder="Search here"
          placeholderTextColor="#000"
          autoCapitalize="none"
          style={{flex: 1, padding: 0}}
        />
        <Ionicons name="ios-search" size={20} onPress={onSearch} />
      </View>
      <ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScrollView}
        contentInset={{
          // iOS only
          top: 0,
          left: 0,
          bottom: 0,
          right: 20,
        }}
        contentContainerStyle={{
          paddingRight: Platform.OS === 'android' ? 20 : 0,
        }}>
        {state.categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.chipsItem}>
            {category.icon}
            <Text>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}
      <EstimatedArrival coordinate={mapState.region} km={km} />
      <TopFilter
        searchFinished={searchFinished}
        lat={mapState.region.latitude}
        lng={mapState.region.longitude}
        direction={direction}
        km={km}
        goByPressed={goByPressed}
        travelTool={travelTool}
        showSearch={showSearch}
        radius={radius}
      />

      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET,
        }}
        contentContainerStyle={{
          paddingHorizontal:
            Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                },
              },
            },
          ],
          {useNativeDriver: true},
        )}>
        {mapState.markers
          // .filter((m) => m.place_id === 'ChIJU_6wmx2nEmsRNBvwlTI4Ebk')
          // .filter((m) => m.place_id === 'ChIJKdwmeBOuEmsR0a8Bg2SiHzU')
          // .filter((m) => m.place_id === 'ChIJ2XHdn9CkEmsRCGTtHaIao70')
          .map((marker, index) => (
            <DetailCard
              key={marker.place_id}
              index={index}
              marker={marker}
              detailPressed={detailPressed}
            />
          ))}
      </Animated.ScrollView>
      <BottomSheetContent ref={bottomSheetRef} marker={selectedMarker} />
      <GoBySelector
        ref={goBySheetRef}
        onTravelToolPress={onTravelToolPress}
        selected={travelTool?.value}
      />
    </View>
  );
};

export default MyMap2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1,
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 80,
    paddingHorizontal: 10,
    height: 50,
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  markerTooltip: {
    width: 150,
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
    top: 10,
  },
  button: {
    alignItems: 'center',
    marginTop: 5,
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
