import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import MapView, {
  EventUserLocation,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import {Place, PlaceDetail, PlaceWithArrival} from '../../api/types';
import {AppStackParamList} from '../../types';
import {getDistanceFromLatLonInKm} from '../../utils/getDistanceFromLatLonInKm';
import CurrentLocationBeacon from '../CurrentLocationBeacon';
import EstimatedArrival from '../EstimatedArrival';
import DetailCard from '../MyMap2/DetailCard';
import {DirectionReady} from '../SearchBar/types';
import {TopFilter} from '../TopFilter';
import {TravelTool} from '../TopFilter/types';
import BigAddCard from './Ads/BigAddCard';
import Ad from './Ads/SmallAd';
import {mapStandardStyle} from './mapData';
import {mockDirection} from './mockDirection';
import {useTickTime} from './useTickTime';

// const origin = {latitude: -33.8439069, longitude: 151.0775536};
// const destination = {latitude: -33.9174438, longitude: 151.2217491};
const origin = 'Sydney Olympic Park';
const destination = 'Manly';
const GOOGLE_MAPS_API_KEY = 'AIzaSyCwTHpLD23nVmwcVdIFqCj40EiTus7zh8M';

// import normalMarker from './assets/map_marker.png';
const normalMarker = require('./assets/map_marker.png');
const mainMarker = require('./assets/main_marker.png');

// import {useTheme} from '@react-navigation/nativ
// = Dimensions.get('screen').width / 2;
const padding = 10;

const {width, height} = Dimensions.get('window');
// const footerHeight = height / 3;
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const footerHeight = CARD_HEIGHT + 40;

// const cardWidth = CARD_WIDTH;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const MyMap3 = () => {
  //   const theme = useTheme();
  const [direction, setDirection] = useState<{
    source: LatLng;
    destination: LatLng;
    duration: number;
    distance: number;
  } | null>({
    source: mockDirection.coordinates[0],
    destination:
      mockDirection.coordinates[mockDirection.coordinates.length - 1],
    distance: mockDirection.distance,
    duration: mockDirection.duration,
  });

  const [userGesture, setUserGesture] = useState(false);
  const [km, setKm] = useState(0);
  const initialMapState = {
    markers: [] as Place[],
    region: {
      latitude: -33.84796,
      longitude: 151.07443,
      // latitudeDelta: 0.04864195044303443,
      // longitudeDelta: 0.040142817690068,

      latitudeDelta: 0.4874179061757644,
      longitudeDelta: 0.27110159397125244,
    },
  };

  const [mapState, setMapState] = useState(initialMapState);
  const [selectedMarker, setSelectedMarker] = useState<Place | null>(null);
  const [travelTool, setTravelTool] = useState<TravelTool>();
  const [showSearch, setShowSearch] = useState(false);
  const [radius, setRadius] = useState(1000);
  const {date} = useTickTime();

  const route: RouteProp<AppStackParamList, 'Main'> = useRoute();

  const {searchTerm} = route.params;
  console.log('searchTerm', searchTerm);

  // const estimatedTime = getNewTimeFormatted(date, km, travelTool?.speed);

  const onDirectionReady = (e: DirectionReady) => {
    console.log(JSON.stringify(e));
    if (e.coordinates.length < 1) return;

    setDirection({
      source: e.coordinates[0],
      destination: e.coordinates[e.coordinates.length - 1],
      duration: e.duration,
      distance: e.distance,
    });

    _map?.current?.fitToCoordinates(
      e.coordinates.slice(0, e.coordinates.length / 2),
      {
        edgePadding: {
          right: width / 20,
          bottom: height / 20,
          left: width / 20,
          top: height / 20,
        },
      },
    );

    // console.log({
    //   distance: e.distance,
    //   duration: e.duration,
    //   waypointOrder: JSON.stringify(e.waypointOrder),
    // });
  };

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

  const scrolledCardIndex = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    const {x} = e.contentOffset;
    const number = Math.floor(x / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
    if (number !== scrolledCardIndex.value) {
      scrolledCardIndex.value = number;
    }
  });

  const onMomentumScrollEnd = async () => {
    const marker = mapState.markers[scrolledCardIndex.value];
    const {geometry} = marker;
    _map?.current?.animateToRegion(
      {
        latitude: geometry.location.lat,
        longitude: geometry.location.lng,
        latitudeDelta: mapState.region.latitudeDelta,
        longitudeDelta: mapState.region.longitudeDelta,
      },
      350,
    );
  };

  // const onUserLocationChange = (event: EventUserLocation) => {
  //   setDirection(event.nativeEvent.coordinate.heading);
  // };

  // const interpolations = mapState.markers.map((marker, index) => {
  //   const inputRange = [
  //     (index - 1) * CARD_WIDTH,
  //     index * CARD_WIDTH,
  //     (index + 1) * CARD_WIDTH,
  //   ];

  //   const scale = mapAnimation.interpolate({
  //     inputRange,
  //     outputRange: [1, 1.5, 1],
  //     extrapolate: Extrapolate.CLAMP,
  //   });

  //   return {scale};
  // });
  const insets = useSafeAreaInsets();

  const onMarkerPress = (mapEventData: any) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }

    const node = _scrollView.current?.getNode();
    if (node) node.scrollTo({x: x, y: 0, animated: true});
  };

  const _map = React.useRef<MapView>(null);

  const _scrollView = React.useRef<Animated.ScrollView>(null);

  const searchFinished = (
    places: Place[],
    placeWithArrivalTime: PlaceWithArrival,
  ) => {
    setShowSearch(false);
    if (places.length > 0) {
      setMapState({...mapState, markers: places});
      _map.current?.fitToSuppliedMarkers(
        places.map((marker) => marker.place_id),
        {edgePadding: {top: 50, right: 50, bottom: 50, left: 50}},
      );
    }
  };

  const detailPressed = async (marker: Place) => {
    setSelectedMarker(marker);
    bottomSheetRef.current?.snapTo(0);
  };

  const [mapWidth, setMapWidth] = useState('99%');

  const updateMapStyle = () => {
    setMapWidth('100%');
  };

  const requestGeoLocationPermission = () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  };

  const onRegionChangeComplete = (
    region: Region,
    details: {isGesture: boolean},
  ) => {
    const {isGesture} = details;
    console.log('details ', details);

    if (isGesture !== undefined) setUserGesture(isGesture);
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
    console.log({region});
    const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
    console.log('zoom', zoom);

    const newRegion = {
      latitude: region.latitude - region.latitudeDelta / 5,
      longitude: region.longitude,
      //  + region.longitudeDelta / 2
    };
    // setMapState({...mapState, region: {...region, ...newRegion}});
    _map?.current?.coordinateForPoint({x: 185, y: 380}).then((coords) => {
      // alert('lon: ' + coords.longitude + ', lat: ' + coords.latitude),
      setMapState({
        ...mapState,
        region: {
          ...region,
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      });
    });
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

  const hasMarker = mapState.markers.length > 0;
  const showCafesScroll = hasMarker && !userGesture;

  return (
    <View style={styles.mainContainer}>
      <MapView
        ref={_map}
        initialRegion={mapState.region}
        style={[styles.container, {width: mapWidth}]}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStandardStyle}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        followsUserLocation={true}
        loadingEnabled={true}
        toolbarEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        // onUserLocationChange={onUserLocationChange}
        onPress={onMapPress}
        minZoomLevel={10}
        // minZoomLevel={6}
        maxZoomLevel={13}
        onMapReady={() => {
          requestGeoLocationPermission();
          updateMapStyle();
        }}
        onRegionChangeComplete={onRegionChangeComplete as any}>
        <CurrentLocationBeacon coordinate={mapState.region} km={km} />
        {mapState.markers.map((marker: Place, index: number) => {
          // const scaleStyle = {
          //   transform: [{scale: interpolations[index].scale}],
          // };
          const isSelected = index === scrolledCardIndex.value;
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.geometry.location.lat,
                longitude: marker.geometry.location.lng,
              }}
              style={isSelected ? styles.specialMarker : null}
              onPress={(e) => onMarkerPress(e)}
              title={marker.name}
              identifier={marker.place_id}>
              {/* <Animated.View style={[styles.markerWrap]}>
                <Animated.Image
                  source={isSelected ? mainMarker : normalMarker}
                  style={[styles.marker]}
                  resizeMode="cover"
                />
              </Animated.View> */}
            </Marker>
          );
        })}
        <MapViewDirections
          // origin={origin}
          origin={{latitude: current.latitude, longitude: current.longitude}}
          destination={searchTerm}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={3}
          strokeColor="green"
          onReady={onDirectionReady}
        />
      </MapView>
      {direction && (
        <EstimatedArrival
          coordinate={mapState.region}
          km={km}
          distance={direction.distance}
          startSource={direction.source}
          footerHeight={footerHeight}
          duration={direction.duration}
        />
      )}
      <TopFilter
        searchFinished={searchFinished}
        lat={mapState.region.latitude}
        lng={mapState.region.longitude}
        km={km}
        goByPressed={goByPressed}
        travelTool={travelTool}
        showSearch={showSearch}
        radius={radius}
        currentPosition={{
          lat: mapState.region.latitude,
          lng: mapState.region.longitude,
        }}
      />
      <View style={[{paddingBottom: insets.bottom}]}>
        {!hasMarker && (
          <BigAddCard
            size={`${Math.floor(CARD_WIDTH)}x${Math.floor(CARD_HEIGHT)}`}
          />
        )}
        <Ad />
      </View>
      {/* {(!hasMarker || (hasMarker && !showCafesScroll)) && (
        <View
          style={[styles.adsContainer, {bottom: insets.bottom + 170}]}></View>
      )} */}
      <View style={[styles.bottom, {bottom: insets.bottom + 70}]}>
        {showCafesScroll && (
          <Animated.ScrollView
            ref={_scrollView}
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            decelerationRate={0}
            snapToInterval={CARD_WIDTH} //your element width
            snapToAlignment={'center'}
            onMomentumScrollEnd={onMomentumScrollEnd}
            contentInset={{
              top: 0,
              left: SPACING_FOR_CARD_INSET,
              bottom: 0,
              right: SPACING_FOR_CARD_INSET,
            }}
            contentContainerStyle={{
              paddingHorizontal:
                Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
            }}>
            {mapState.markers.map((place, index) => (
              <DetailCard
                key={place.place_id}
                index={index}
                marker={place}
                detailPressed={detailPressed}
              />
            ))}
          </Animated.ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,

    alignItems: 'center',

    // justifyContent: 'flex-end',
  },
  container: {
    flex: 1,

    // padding: 10,
    // alignItems: 'center',
    // justifyContent: 'flex-end',
  },
  top: {flex: 0.5},
  bottom: {
    // flex: 0.4,
    position: 'absolute',

    // height: footerHeight,
    padding: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  adsContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
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
  specialMarker: {
    zIndex: 1,
  },
});

export default MyMap3;
