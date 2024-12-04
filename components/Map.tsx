import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { searchLocations } from "@/store/locationSlice";
import { setIsCenteringEnabled } from "@/store/odometerSlice";
import { calculateRegionForPoints } from "@/utils/calculateRegionForPoints";
import { generateRadiusPoints } from "@/utils/generateRadiusPoints";
import { getRadiusFromSpeed } from "@/utils/getRadiusFromSpeed";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
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
import MapView, { Marker, Polygon, Region } from "react-native-maps";
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { useLocation } from "../hooks/useLocation";
import { DirectionalBeacon } from "./DirectionalBeacon";
import { LocationMarkers } from "./LocationMarkers";
import { SpeedOMeter } from "./SpeedOMeter";
import { ArrowDirection } from "./ArrowDirection";
import { Toast } from "./Toast";

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
const categories = [
  { name: "Restaurants", value: "restaurant" },
  { name: "Coffee", value: "cafe" },
  { name: "Groceries", value: "convenience_store" },
  { name: "Chemists", value: "pharmacy" },
];

const initLocation = {
  // latitude: 37.78825,
  // longitude: -122.4324,
  latitude: -33.826826,
  longitude: 151.085464,
  latitudeDelta: INITIAL_LATITUDE_DELTA,
  longitudeDelta: INITIAL_LONGITUDE_DELTA,
};

// const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
// Helper function to get compass direction
// const getCompassDirection = (degrees: number): string => {
//   return directions[Math.round(degrees / 45) % 8];
// };

interface MapProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
}

const Map = ({ bottomSheetRef }: MapProps) => {
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const colorScheme = useColorScheme();
  const radarDisabled = useThemeColor({}, "radarDisabled");

  const preferredMap = useAppSelector((state) => state.settings.preferredMap);
  const locations = useAppSelector((state) => state.location.locations);
  const minRating = useAppSelector((state) => state.settings.minRating);
  // const avgSpeed = useAppSelector((state) => state.odometer.avgSpeed);
  const avgSpeed = useAppSelector((state) =>
    [...state.odometer.speedList].sort().at(-1)
  );
  const direction = useAppSelector((state) => state.odometer.direction);
  const loading = useAppSelector((state) => state.location.loading);

  const minReviewCount = useAppSelector(
    (state) => state.settings.minReviewCount
  );

  // const { heading, accuracy } = useCompass();

  const { location: rawLocation } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].value
  );
  const radarColor = useThemeColor({}, "radar");

  // Add these new state variables
  // const [isCenteringEnabled, dispatch(setIsCenteringEnabled] = useState(true));
  const isCenteringEnabled = useAppSelector(
    (state) => state.odometer.isCenteringEnabled
  );

  const buttonOpacity = useSharedValue(1);

  const radiusMap = getRadiusFromSpeed(avgSpeed);
  const currentLocation: Region = rawLocation?.coords
    ? {
        latitude: rawLocation.coords?.latitude,
        longitude: rawLocation.coords?.longitude,
        latitudeDelta: radiusMap.delta,
        longitudeDelta: getDelta(radiusMap.delta),
      }
    : initLocation;

  const startAngle = direction.range[0];
  // radiusMap.mode === "walking" ? direction.range[0] : rawLocation?.coords?.heading ?? 20;

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

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    actions?: { text: string; onPress: () => void }[];
  }>({
    visible: false,
    message: "",
  });

  const showToast = (
    message: string,
    actions?: { text: string; onPress: () => void }[]
  ) => {
    setToast({ visible: true, message, actions });
  };

  const hideToast = () => {
    setToast({ visible: false, message: "" });
  };

  useEffect(() => {
    if (!isCenteringEnabled) {
      return;
    }
    if (mapRef.current) {
      const allPoints = [
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
    // location,
    beaconPoints,
    endMarkerPosition1,
    endMarkerPosition2,
    isUserInteracting,
    isCenteringEnabled,
  ]);

  // Update useEffect to set speed and compass direction
  // useEffect(() => {
  //   if (location) {
  //     dispatch(setSpeed(Math.max(location.coords?.speed ?? 0, 0)));
  //     dispatch(setCompassDirection(getCompassDirection(heading)));
  //   }
  // }, [location, heading, dispatch]);

  const opacity = useSharedValue(1);

  const noGPS = rawLocation?.coords?.heading === -1;

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

  const onSearch = async () => {
    if (preferredMap === "IN_APP") {
      try {
        let shouldShowToast = true;
        const timeoutId = setTimeout(() => {
          showToast(
            "The app is taking long time? You can continue other apps:",
            [
              {
                text: "Google Maps",
                onPress: () => Linking.openURL(linkGoogle),
              },
              {
                text: "Apple Maps",
                onPress: () => Linking.openURL(linkApple),
              },
            ]
          );
        }, 1000);

        const param = {
          lat: beaconPoints[beaconPoints.length / 3].latitude,
          lng: beaconPoints[beaconPoints.length / 3].longitude,
          type: selectedCategory,
          rating: minRating,
          userRatingsTotal: minReviewCount,
        };

        const resultAction = await dispatch(searchLocations(param));

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (searchLocations.fulfilled.match(resultAction)) {
          if (resultAction.payload.length === 0) {
            return;
          }

          const locs = resultAction.payload.map(({ location }) => ({
            latitude: location.lat,
            longitude: location.lng,
          }));

          const topPadding = 200;
          const region = calculateRegionForPoints(locs, topPadding);
          mapRef.current?.animateToRegion(region, 1000);
          dispatch(setIsCenteringEnabled(false));
        }
      } catch (error) {
        console.error("Error fetching places:", error);
        showToast("Error fetching places. Please try again.");
      }
    } else {
      Linking.openURL(calloutLink2);
    }
  };

  const hasValidHeading =
    rawLocation?.coords?.heading !== undefined &&
    rawLocation.coords.heading > -1;
  // const hasValidHeading = true

  const onCogClick = () => {
    router.push("/settings");
  };

  const onMapPress = () => {
    bottomSheetRef.current?.close();
  };

  const handleCenterPress = () => {
    if (!rawLocation?.coords) return;

    setIsUserInteracting(false);
    dispatch(setIsCenteringEnabled(true));
    buttonOpacity.value = withSpring(1);

    const region = calculateRegionForPoints(
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
      ],
      200
    );

    mapRef.current?.animateToRegion(region, 1000);
  };

  const handleMapDrag = () => {
    setIsUserInteracting(true);
    if (isCenteringEnabled) {
      dispatch(setIsCenteringEnabled(false));
      buttonOpacity.value = withSpring(0.5);
    }
  };

  return (
    <View style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        onHide={hideToast}
        duration={5000}
        actions={toast.actions}
        // actions={[
        //   {
        //     text: "Google Maps",
        //     onPress: () => Linking.openURL(linkGoogle),
        //   },
        //   {
        //     text: "Apple Maps",
        //     onPress: () => Linking.openURL(linkApple),
        //   },
        // ]}
      />
      <MapView
        userInterfaceStyle={colorScheme}
        ref={mapRef}
        style={styles.map}
        onPanDrag={handleMapDrag}
        onRegionChangeComplete={() => setIsUserInteracting(false)}
        onPress={onMapPress}
        showsCompass={true}
        rotateEnabled={true}
        compassOffset={{ x: -12, y: height * 0.65 }}
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
            <DirectionalBeacon heading={rawLocation?.coords?.heading ?? 0} />
          </Marker>
        )}
      </MapView>
      <TouchableOpacity
        onPress={handleCenterPress}
        disabled={isCenteringEnabled}
      >
        <Animated.View style={[styles.centerButton]}>
          <MaterialCommunityIcons
            name={isCenteringEnabled ? "crosshairs-gps" : "crosshairs"}
            size={24}
            color="#000"
          />
        </Animated.View>
      </TouchableOpacity>
      <View style={styles.scrollersContainer}>
        <View style={styles.infoWrapper} />
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
                onPress={() => setSelectedCategory(category.value)}
              >
                <Text style={styles.categoryText}>
                  {selectedCategory === category.value && "✓  "}
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: loading ? radarDisabled : "#543836" },
            ]}
            onPress={onSearch}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Searching..." : "Search"}
              {/* &gt; {radiusMap.distance}km */}
            </Text>
          </TouchableOpacity>
        </View>
        <SpeedOMeter style={styles.speedContainer} />
        <ArrowDirection style={styles.arrowDirection} />
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
    height: 62,
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
  arrowDirection: {
    position: "absolute",
    right: 10,
    top: height / 11, // Adjust this value to position below infoChips
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
    height: 75,
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
