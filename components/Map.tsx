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
import MapView, {
  Callout,
  LatLng,
  Marker,
  Polygon,
  Region,
} from "react-native-maps";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useCompass } from "../hooks/useCompass";
import { useLocation } from "../hooks/useLocation";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const INITIAL_LATITUDE_DELTA = 1.5;
const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * ASPECT_RATIO;

const getDelta = (latitudeDelta: number) => latitudeDelta * ASPECT_RATIO;

// Function to generate points for the angled radius beacon
const generateRadiusPoints = (
  center: Region,
  radiusInKm: number,
  startAngle: number,
  endAngle: number
) => {
  const points = [];
  const earthRadius = 6371; // Earth's radius in kilometers
  const angularDistance = radiusInKm / earthRadius;

  const radian = Math.PI / 180;

  for (let i = startAngle; i <= endAngle; i += 5) {
    const radians = i * radian;
    const lat = Math.asin(
      Math.sin(center.latitude * radian) * Math.cos(angularDistance) +
        Math.cos(center.latitude * radian) *
          Math.sin(angularDistance) *
          Math.cos(radians)
    );
    const lon =
      center.longitude * radian +
      Math.atan2(
        Math.sin(radians) *
          Math.sin(angularDistance) *
          Math.cos(center.latitude * radian),
        Math.cos(angularDistance) -
          Math.sin(center.latitude * radian) * Math.sin(lat)
      );

    points.push({
      latitude: lat * (180 / Math.PI),
      longitude: lon * (180 / Math.PI),
    });
  }

  // Add center point to close the polygon
  points.push(center);

  return points;
};

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

const AnimatedBeacon = ({
  coordinate,
  children,
}: {
  coordinate: LatLng;
  children: React.ReactNode;
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Marker coordinate={coordinate}>
      <View style={styles.beaconContainer}>
        <Animated.View style={[styles.beacon, animatedStyle]} />
        <View style={styles.beaconCenter} />
      </View>
      {children}
    </Marker>
  );
};

const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
// Helper function to get compass direction
const getCompassDirection = (degrees: number): string => {
  return directions[Math.round(degrees / 45) % 8];
};

const Map = () => {
  const mapRef = useRef<MapView>(null);
  const { heading, accuracy } = useCompass();

  const { location } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );

  // Add these new state variables
  const [speed, setSpeed] = useState<number | undefined>();
  const [compassDirection, setCompassDirection] = useState<string>("N");

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
  const calloutLink1 = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition1.latitude},${endMarkerPosition1.longitude},${zoomLevelLink}/data=!4m4!2m3!5m1!4e9!6e5`;
  const calloutLink2 = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition2.latitude},${endMarkerPosition2.longitude},${zoomLevelLink}/data=!4m4!2m3!5m1!4e9!6e5`;
  // const calloutLink3 = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition3.latitude},${endMarkerPosition3.longitude},11z`;

  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (location && mapRef.current) {
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
      }, 5000);
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
  ]);

  // Update useEffect to set speed and compass direction
  useEffect(() => {
    if (location) {
      setSpeed(Math.max(location.coords?.speed ?? 0, 0));
      setCompassDirection(getCompassDirection(heading));
    }
  }, [location, heading]);

  // const startAngle =
  //   location?.coords?.heading !== -1
  //     ? location?.coords?.heading ?? 20
  //     : heading;

  // Add this new animated value
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onPanDrag={() => setIsUserInteracting(true)}
        onRegionChangeComplete={() => setIsUserInteracting(false)}
      >
        <Marker
          coordinate={currentLocation}
          title="Your Location"
          description="You are here"
        />
        <Polygon
          coordinates={beaconPoints}
          fillColor="rgba(0, 150, 255, 0.2)"
          strokeColor="rgba(0, 150, 255, 0.5)"
          strokeWidth={2}
        />

        <AnimatedBeacon coordinate={endMarkerPosition1}>
          <Callout onPress={() => Linking.openURL(calloutLink1)}>
            <View>
              <Text>{radiusMap.distance}km from your location</Text>
              <Text style={styles.linkText}>Tap to open Google</Text>
            </View>
          </Callout>
        </AnimatedBeacon>
        <AnimatedBeacon coordinate={endMarkerPosition2}>
          <Callout onPress={() => Linking.openURL(calloutLink2)}>
            <View>
              <Text>{radiusMap.distance}km from your location</Text>
              <Text style={styles.linkText}>Tap to open Google</Text>
            </View>
          </Callout>
        </AnimatedBeacon>
      </MapView>
      <View style={styles.scrollersContainer}>
        <View style={styles.infoWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.infoContainer}
            contentContainerStyle={styles.infoContent}
          >
            <View style={styles.infoChip}>
              {noGPS && (
                <Animated.Text style={[styles.infoText, styles.noGps]}>
                  GPS
                </Animated.Text>
              )}
              <Animated.Text style={[styles.infoText, animatedTextStyle]}>
                Direction: {compassDirection}
              </Animated.Text>
            </View>
            <View style={styles.infoChip}>
              <Text style={styles.infoText}>
                Speed:{" "}
                {!!speed ? `${(speed * 3.6).toFixed(1)} km/h` : "0.0 km/h"}
              </Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    // justifyContent: "flex-end",
    // alignItems: "center",
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
    paddingTop: 80,
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
    backgroundColor: "rgba(154, 134, 181, 0.3)", // Changed to semi-transparent orange
  },
  beaconCenter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgb(154, 134, 181)", // Changed to solid orange
  },
});

export default Map;
