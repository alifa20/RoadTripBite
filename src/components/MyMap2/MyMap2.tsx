import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import {Place} from '../../api/types';
import BottomSheetContent from '../BottomSheetContent';
import {TopFilter} from '../TopFilter';
import DetailCard from './DetailCard';
import {mapStandardStyle, markers} from './mapData';

// import {useTheme} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const MyMap2 = () => {
  //   const theme = useTheme();

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
      latitude: -33.84795,
      longitude: 151.0744,
      // latitude: -33.86795,
      // longitude: 151.2744,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
  };

  const [state, setState] = useState(initialMapState);
  // const [details, setDetails] = useState<PlaceDetail>(null);
  const [selectedMarker, setSelectedMarker] = useState<Place | null>(null);

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);
  const bottomSheetRef = React.createRef<ScrollBottomSheet<FlatList<string>>>();

  useEffect(() => {
    mapAnimation.addListener(({value}) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= state.markers.length) {
        index = state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const {geometry} = state.markers[index];
          _map?.current?.animateToRegion(
            {
              latitude: geometry.location.lat,
              longitude: geometry.location.lng,
              latitudeDelta: state.region.latitudeDelta,
              longitudeDelta: state.region.longitudeDelta,
            },
            350,
          );
        }
      }, 10);
      clearTimeout(regionTimeout);
    });
  });

  const interpolations = state.markers.map((marker, index) => {
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
    setState({...state, markers: places});
    _map.current?.fitToSuppliedMarkers(
      places.map((marker) => marker.place_id),
      {edgePadding: {top: 50, right: 50, bottom: 50, left: 50}},
    );

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

  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
        initialRegion={state.region}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        // customMapStyle={theme.dark ? mapDarkStyle : mapStandardStyle}
        customMapStyle={mapStandardStyle}>
        {state.markers.map((marker, index) => {
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
      <TopFilter
        searchFinished={searchFinished}
        lat={state.region.latitude}
        lng={state.region.longitude}
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
        {state.markers.map((marker, index) => (
          <DetailCard
            key={marker.place_id}
            index={index}
            marker={marker}
            detailPressed={detailPressed}
          />
        ))}
      </Animated.ScrollView>
      <BottomSheetContent ref={bottomSheetRef} marker={selectedMarker} />
    </View>
  );
};

export default MyMap2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
