import React, {useEffect, useState} from 'react';
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
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import Animated, {
  Extrapolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import {Place, PlaceDetail, PlaceWithArrival} from '../../api/types';
import {getDistanceFromLatLonInKm} from '../../utils/getDistanceFromLatLonInKm';
import {getNewTimeFormatted} from '../../utils/timeUtil';
import CurrentLocationBeacon from '../CurrentLocationBeacon';
import EstimatedArrival from '../EstimatedArrival';
import DetailCard from '../MyMap2/DetailCard';
import {TopFilter} from '../TopFilter';
import {TravelTool} from '../TopFilter/types';
import Card from './Card';
import {mapStandardStyle, markers} from './mapData';
import {places} from './mockData';
import {useTickTime} from './useTickTime';
// import normalMarker from './assets/map_marker.png';
const normalMarker = require('./assets/map_marker.png');
const mainMarker = require('./assets/main_marker.png');

// import {useTheme} from '@react-navigation/nativ
// = Dimensions.get('screen').width / 2;
const padding = 10;

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const cardWidth = CARD_WIDTH;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const MyMap3 = () => {
  //   const theme = useTheme();
  const [direction, setDirection] = useState(12);
  const [km, setKm] = useState(0);
  const initialMapState = {
    markers,
    region: {
      latitude: -33.84796,
      longitude: 151.07443,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
  };

  const [mapState, setMapState] = useState(initialMapState);
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
  const onUserLocationChange = (event: EventUserLocation) => {
    setDirection(event.nativeEvent.coordinate.heading);
  };

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

  const onMarkerPress = (mapEventData: any) => {
    console.log('press');

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
              <Animated.View style={[styles.markerWrap]}>
                <Animated.Image
                  // source={require('./assets/map_marker.png')}
                  source={isSelected ? mainMarker : normalMarker}
                  style={[
                    styles.marker,
                    // scaleStyle
                  ]}
                  resizeMode="cover"
                />
              </Animated.View>
            </Marker>
          );
        })}
      </MapView>
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
        currentPosition={{
          lat: mapState.region.latitude,
          lng: mapState.region.longitude,
        }}
      />
      <View style={styles.bottom}>
        <Animated.ScrollView
          ref={_scrollView}
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          decelerationRate={0}
          snapToInterval={cardWidth} //your element width
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
          {(places as Place[]).map((place, index) => (
            // <Card
            //   key={place.name}
            //   width={cardWidth}
            //   place={place}
            //   index={index}
            //   marginRight={padding}
            // />
            <DetailCard
              key={place.place_id}
              index={index}
              marker={place}
              detailPressed={detailPressed}
            />
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  top: {flex: 0.5},
  bottom: {
    flex: 0.4,
    padding: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
