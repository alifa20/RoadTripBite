import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppSelector } from "@/store/hooks";
import { setLocations } from "@/store/locationSlice";
import { generateRadiusPoints } from "@/utils/generateRadiusPoints";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import functions from "@react-native-firebase/functions";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  InteractionManager,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { LatLng, Marker, Polygon, Region } from "react-native-maps";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { useCompass } from "../hooks/useCompass";
import { useLocation } from "../hooks/useLocation";
import { DirectionalBeacon } from "./DirectionalBeacon";
import { LocationMarkers } from "./LocationMarkers";
import { SpeedOMeter } from "./SpeedOMeter";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const INITIAL_LATITUDE_DELTA = 1.5;
const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * ASPECT_RATIO;

const getDelta = (latitudeDelta: number) => latitudeDelta * ASPECT_RATIO;

// const radiusDeltaMap = {
//   10: 0.5,
//   60: 1.5,
// };
// const zoomLevelLinkMap = {
//   10: "14z",
//   60: "11z",
// };
const categories = ["Restaurants", "Coffee", "Groceries", "Chemists"];

const initLocation = {
  // latitude: 37.78825,
  // longitude: -122.4324,
  latitude: -33.826826,
  longitude: 151.085464,
  latitudeDelta: INITIAL_LATITUDE_DELTA,
  longitudeDelta: INITIAL_LONGITUDE_DELTA,
};

type radiusMap = {
  mode: "walking" | "driving";
  distance: number;
  delta: number;
  zoomLevel: string;
};

// Add this function outside of the Map component
const calculateRegionForPoints = (
  points: LatLng[],
  topPadding: number
): Region => {
  let minLat = points[0].latitude;
  let maxLat = points[0].latitude;
  let minLng = points[0].longitude;
  let maxLng = points[0].longitude;

  points.forEach((point) => {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLng = Math.min(minLng, point.longitude);
    maxLng = Math.max(maxLng, point.longitude);
  });

  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const deltaLat = (maxLat - minLat) * 1.1; // Add 10% padding
  const deltaLng = (maxLng - minLng) * 1.1; // Add 10% padding

  // Calculate the latitude shift based on topPadding
  const latitudeShift = (deltaLat * topPadding) / height;

  return {
    latitude: midLat + latitudeShift / 2, // Shift the center slightly south
    longitude: midLng,
    latitudeDelta: Math.max(deltaLat * (height / (height - topPadding)), 0.01), // Adjust zoom level
    longitudeDelta: Math.max(deltaLng * (height / (height - topPadding)), 0.01), // Adjust zoom level
  };
};

const getRadiusFromSpeed = (speed = 0): radiusMap => {
  // Walking speed (up to 5 km/h)
  if (speed <= 5) {
    return {
      mode: "walking",
      distance: 10,
      delta: 0.5,
      zoomLevel: "14z",
    }; // 10 km radius for walking (5 km/h * 2 hours)
  }
  // Speeds between 5 km/h and 40 km/h
  else if (speed > 5 && speed <= 40) {
    const distance = Math.ceil(speed * 2); // 2 hours of travel at current speed
    return {
      mode: "walking",
      distance,
      delta: 0.5,
      zoomLevel: "14z",
    };
  }
  // Speeds between 40 km/h and 60 km/h
  else if (speed > 40 && speed <= 60) {
    const distance = 120; // 120 km radius (60 km/h * 2 hours)
    return {
      mode: "driving",
      distance,
      delta: 1.5,
      zoomLevel: "11z",
    };
  }
  // Speeds between 60 km/h and 80 km/h
  else if (speed > 60 && speed <= 80) {
    const distance = 160; // 160 km radius (80 km/h * 2 hours)
    return {
      mode: "driving",
      distance,
      delta: 1.5,
      zoomLevel: "11z",
    };
  }
  // Speeds above 80 km/h
  const distance = 200; // Cap at 200 km radius for very high speeds
  return {
    mode: "driving",
    distance,
    delta: 1.5,
    zoomLevel: "11z",
  };
};

const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
// Helper function to get compass direction
const getCompassDirection = (degrees: number): string => {
  return directions[Math.round(degrees / 45) % 8];
};

interface MapProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
}

const Map = ({ bottomSheetRef }: MapProps) => {
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const preferredMap = useAppSelector((state) => state.settings.preferredMap);
  const locations = useAppSelector((state) => state.location.locations);
  const minRating = useAppSelector((state) => state.settings.minRating);
  const minReviewCount = useAppSelector(
    (state) => state.settings.minReviewCount
  );

  const { heading, accuracy } = useCompass();

  const { location } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );
  const radarColor = useThemeColor({}, "radar");

  // Add these new state variables
  const [speed, setSpeed] = useState<number | undefined>();
  const [compassDirection, setCompassDirection] = useState<string>("N");
  const [isCenteringEnabled, setIsCenteringEnabled] = useState(true);
  const buttonOpacity = useSharedValue(1);

  const radiusMap = getRadiusFromSpeed(speed);
  const currentLocation: Region = location?.coords
    ? {
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        latitudeDelta: radiusMap.delta,
        longitudeDelta: getDelta(radiusMap.delta),
      }
    : initLocation;

  const startAngle =
    radiusMap.mode === "walking" ? heading : location?.coords?.heading ?? 20;

  const beaconPoints = generateRadiusPoints(
    currentLocation,
    radiusMap.distance,
    startAngle,
    startAngle + 50
  );

  // Calculate the position of the end marker
  const endMarkerPosition1 =
    beaconPoints[Math.round(beaconPoints.length / 3.5)]; // Second to last point
  const endMarkerPosition2 = beaconPoints[Math.round(beaconPoints.length / 2)]; // Second to last point
  // const endMarkerPosition3 = beaconPoints[Math.round(beaconPoints.length / 1.5)]; // Second to last point

  const zoomLevelLink = radiusMap.zoomLevel;
  // https://www.google.com/maps/search/Restaurants/@-33.798424,151.0866225,15z/data=!4m4!2m3!5m1!4e9!6e5
  // const calloutLink1 = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition1.latitude},${endMarkerPosition1.longitude},${zoomLevelLink}/data=!4m4!2m3!5m1!4e9!6e5`;
  const linkGoogle = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition2.latitude},${endMarkerPosition2.longitude},${zoomLevelLink}/data=!4m4!2m3!5m1!4e9!6e5`;
  const linkApple = `maps://maps.apple.com/?q=${selectedCategory}&ll=${endMarkerPosition2.latitude},${endMarkerPosition2.longitude}&z=${zoomLevelLink}`;
  let calloutLink2 = "";
  if (preferredMap === "GOOGLE") {
    calloutLink2 = linkGoogle;
  } else if (preferredMap === "APPLE") {
    calloutLink2 = linkApple;
  }
  // const calloutLink3 = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition3.latitude},${endMarkerPosition3.longitude},11z`;

  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!isCenteringEnabled) {
      return;
    }
    if (location && mapRef.current) {
      const allPoints =
        // locations.length > 0
        //   ? locations.map(({ location }) => ({
        //       latitude: location.lat,
        //       longitude: location.lng,
        //     }))
        //   :
        [
          currentLocation,
          endMarkerPosition1,
          endMarkerPosition2,
          ...beaconPoints,
        ];

      const topPadding = 200; // Height of the top controls
      const region = calculateRegionForPoints(allPoints, topPadding);

      // Clear any existing timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      // Set a new timeout
      animationTimeoutRef.current = setTimeout(() => {
        if (!isUserInteracting) {
          InteractionManager.runAfterInteractions(() => {
            mapRef.current?.animateToRegion(region, 1000);
          });
        }
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [
    location,
    beaconPoints,
    endMarkerPosition1,
    endMarkerPosition2,
    isUserInteracting,
    isCenteringEnabled,
  ]);

  // Update useEffect to set speed and compass direction
  useEffect(() => {
    if (location) {
      setSpeed(Math.max(location.coords?.speed ?? 0, 0));
      setCompassDirection(getCompassDirection(heading));
    }
  }, [location, heading]);

  const opacity = useSharedValue(1);

  const noGPS = location?.coords?.heading === -1;

  useEffect(() => {
    if (noGPS) {
      opacity.value = withRepeat(
        withTiming(0, { duration: 1000, easing: Easing.ease }),
        -1,
        true
      );
    } else {
      // Stop the animation and set opacity to 1 if heading is not -1
      opacity.value = 1;
    }
  }, [noGPS]);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const onSearch = async () => {
    if (preferredMap === "IN_APP") {
      try {
        const resp = await functions().httpsCallable<
          {
            lat: number;
            lng: number;
            type: string;
            rating: number;
            userRatingsTotal: number;
          },
          { results: Array<{
            rating: number;
            userRatingsTotal: number;
            location: {
              lat: number;
              lng: number;
            };
            isOpen: boolean;
            address: string;
            placeId: string;
            name: string;
            priceLevel: number | null;
            photos: string[];
          }> }
        >("placesOnCall")({
          lat: beaconPoints[beaconPoints.length / 3].latitude,
          lng: beaconPoints[beaconPoints.length / 3].longitude,
          type: selectedCategory,
          rating: minRating,
          userRatingsTotal: minReviewCount,
        });

        const locations = resp.data.results.map((place) => ({
          location: {
            lat: place.location.lat,
            lng: place.location.lng,
          },
          name: place.name,
          rating: place.rating,
          userRatingsTotal: place.userRatingsTotal,
          address: place.address,
          isOpen: place.isOpen,
          photos: place.photos,
        }));

        const locs = locations.map(({ location }) => ({
          latitude: location.lat,
          longitude: location.lng,
        }));

        const topPadding = 200;
        const region = calculateRegionForPoints(locs, topPadding);

        mapRef.current?.animateToRegion(region, 1000);

        setIsCenteringEnabled(false);
        dispatch(setLocations(resp.data.results));
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    } else {
      Linking.openURL(calloutLink2);
    }
  };

  const hasValidHeading =
    location?.coords?.heading !== undefined && location.coords.heading > -1;
  // const hasValidHeading = true

  const onCogClick = () => {
    router.push("/settings");
  };

  const onMapPress = () => {
    bottomSheetRef.current?.close();
  };

  const handleCenterPress = () => {
    if (!location?.coords) return;

    setIsUserInteracting(false);
    setIsCenteringEnabled(true);
    buttonOpacity.value = withSpring(1);

    const region = calculateRegionForPoints(
      locations.length > 0
        ? locations.map(({ location }) => ({
            latitude: location.lat,
            longitude: location.lng,
          }))
        : [
            currentLocation,
            endMarkerPosition1,
            endMarkerPosition2,
            ...beaconPoints,
          ],
      200
    );

    mapRef.current?.animateToRegion(region, 1000);
  };

  const handleMapDrag = () => {
    setIsUserInteracting(true);
    if (isCenteringEnabled) {
      setIsCenteringEnabled(false);
      buttonOpacity.value = withSpring(0.5);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onPanDrag={handleMapDrag}
        onRegionChangeComplete={() => setIsUserInteracting(false)}
        onPress={onMapPress}
      >
        <Marker
          coordinate={currentLocation}
          title="Your Location"
          description="You are here"
        />
        <LocationMarkers bottomSheetRef={bottomSheetRef} />
        {/* <Marker
          coordinate={{
            latitude:
              beaconPoints[Math.round(beaconPoints.length / 3)].latitude,
            longitude:
              beaconPoints[Math.round(beaconPoints.length / 3)].longitude,
          }}
          title="Your Location"
          description="You are here"
        /> */}
        <Polygon
          coordinates={beaconPoints}
          fillColor={`${radarColor}33`}
          // strokeColor={`${radarColor}88`}
          // fillColor={`${radarColor}66`}
          strokeColor={`${radarColor}CC`}
          strokeWidth={2}
        />

        {hasValidHeading && (
          <Marker coordinate={currentLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <DirectionalBeacon heading={location?.coords?.heading ?? 0} />
          </Marker>
        )}
      </MapView>
      <Animated.View style={[styles.centerButton]}>
        <TouchableOpacity
          onPress={handleCenterPress}
          disabled={isCenteringEnabled}
        >
          <MaterialCommunityIcons
            name={isCenteringEnabled ? "crosshairs-gps" : "crosshairs"}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.scrollersContainer}>
        <View style={styles.infoWrapper}>
          {/* <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search locations..."
          /> */}
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.infoContainer}
            contentContainerStyle={styles.infoContent}
          >
            <View style={styles.infoChip}>
              {noGPS && (
                <Animated.Text
                  style={[
                    styles.infoText,
                    ...(noGPS
                      ? [styles.noGps, animatedTextStyle]
                      : [styles.gps]),
                  ]}
                >
                  {!noGPS && "✓ "}
                  GPS -
                </Animated.Text>
              )}
              <Animated.Text style={[styles.infoText]}>
                Direction: {compassDirection}
              </Animated.Text>
            </View>
            <View style={styles.infoChip}>
              <Text style={styles.infoText}>
                Speed:{" "}
                {!!speed ? `${(speed * 3.6).toFixed(1)} km/h` : "0.0 km/h"}
              </Text>
            </View>
          </ScrollView> */}
        </View>

        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            <TouchableOpacity style={styles.categoryChip} onPress={onCogClick}>
              <Feather name="settings" size={18} color="#333" />
            </TouchableOpacity>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryChip}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={styles.categoryText}>
                  {selectedCategory === category && "✓  "}
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onSearch}>
            <Text style={styles.buttonText}>
              Search
              {/* &gt; {radiusMap.distance}km */}
            </Text>
          </TouchableOpacity>
        </View>
        <SpeedOMeter speed={speed} style={styles.speedContainer} />
        {/* <View style={styles.compass}>
          <Compass heading={heading} direction={compassDirection} />
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: height / 1.5,
    flex: 1,
  },
  scrollersContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  infoWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingTop: 60,
  },
  categoriesWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 10,
  },
  infoContainer: {
    flexGrow: 0,
  },
  infoContent: {
    paddingHorizontal: 10,
  },
  infoChip: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  gps: {
    color: "green",
    textDecorationColor: "bold",
    paddingRight: 5,
  },
  noGps: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    paddingRight: 5,
  },
  categoriesContainer: {
    flexGrow: 0,
  },
  categoriesContent: {
    paddingHorizontal: 10,
  },
  categoryChip: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  customMarker: {
    width: 40,
    height: 40,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  beaconContainer: {
    width: 200,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  beacon: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(84, 56, 54, 0.3)",
  },
  beaconCenter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgb(84, 56, 54)",
  },
  directionalBeaconContainer: {
    width: 400,
    height: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  directionalBeacon: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    borderTopWidth: 120,
    borderRightWidth: 120,
    borderBottomWidth: 0,
    borderLeftWidth: 120,
    borderTopColor: "rgba(84, 56, 54, 0.8)",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  directionalBeaconCenter: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: "rgb(84, 56, 54)",
  },
  buttonContainer: {
    // position: 'absolute',
    // left: '50%',
    // transform: [{ translateX: -75 }, { translateY: -20 }],

    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#543836",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  speedContainer: {
    position: "absolute",
    right: 10,
    top: height / 6, // Adjust this value to position below infoChips
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 50,
    height:62
  },
  speedValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  speedUnit: {
    fontSize: 12,
    color: "#666",
    marginTop: -2,
  },
  compass: {
    width: 50,
  },
  centerButton: {
    position: "absolute",
    right: 16,
    bottom: 50, // Adjust this value based on your layout
    backgroundColor: "white",
    borderRadius: 30,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    opacity: 0.9,
  },
});

export default Map;
