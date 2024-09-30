import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, Polygon, Region } from "react-native-maps";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
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

const radiusDeltaMap = {
  10: 0.5,
  60: 1.5,
};
const zoomLevelLinkMap  =  { 
  10: '14z',
  60: '11z'
}
const categories = ["Restaurants", "Coffee", "Groceries", "Chemists"];

const initLocation = {
  // latitude: 37.78825,
  // longitude: -122.4324,
  latitude: -33.826826,
  longitude: 151.085464,
  latitudeDelta: INITIAL_LATITUDE_DELTA,
  longitudeDelta: INITIAL_LONGITUDE_DELTA,
};

const AnimatedBeacon = ({ coordinate, children }) => {
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
  console.log("headingheadingheadingheading", heading, accuracy);

  const { location } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );

  // Add these new state variables
  const [speed, setSpeed] = useState<number | null>(null);
  const [compassDirection, setCompassDirection] = useState<string>("N");

  const radius = 10;
  const currentLocation: Region = location?.coords
    ? {
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        latitudeDelta: radiusDeltaMap[radius],
        longitudeDelta: getDelta(radiusDeltaMap[radius]),
      }
    : initLocation;

  useEffect(() => {
    if (location && mapRef.current) {
      // const region: Region = {
      //   latitude: location.coords?.latitude,
      //   longitude: location.coords?.longitude,
      //   latitudeDelta: INITIAL_LATITUDE_DELTA,
      //   longitudeDelta: INITIAL_LONGITUDE_DELTA,
      // };
      // setRegion()
      mapRef.current.animateToRegion(currentLocation, 1000); // 1000ms animation duration
    }
  }, [location]);

  // Update useEffect to set speed and compass direction
  useEffect(() => {
    if (location) {
      setSpeed(Math.max(location.coords?.speed ?? 0, 0));
      setCompassDirection(getCompassDirection(heading));
    }
  }, [location, heading]);

  const startAngle =
    location?.coords?.heading !== -1
      ? location?.coords?.heading ?? 20
      : heading;
  const beaconPoints = generateRadiusPoints(
    currentLocation,
    10,
    startAngle,
    startAngle + 50
  );

  // Calculate the position of the end marker
  const endMarkerPosition1 =
    beaconPoints[Math.round(beaconPoints.length / 3.5)]; // Second to last point
  const endMarkerPosition2 = beaconPoints[Math.round(beaconPoints.length / 2)]; // Second to last point
  // const endMarkerPosition3 = beaconPoints[Math.round(beaconPoints.length / 1.5)]; // Second to last point

  const zoomLevelLink = zoomLevelLinkMap[radius];
  const calloutLink1 = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition1.latitude},${endMarkerPosition1.longitude},${zoomLevelLink}`;
  const calloutLink2 = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition2.latitude},${endMarkerPosition2.longitude},${zoomLevelLink}`;
  // const calloutLink3 = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition3.latitude},${endMarkerPosition3.longitude},11z`;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          // initialRegion={region}
        >
          <Marker
            coordinate={currentLocation}
            // coordinate={
            //   location.coords && {
            //     latitude: location.coords.latitude,
            //     longitude: location.coords.longitude,
            //   }
            title="Your Location"
            description="You are here"
          />
          <Polygon
            coordinates={beaconPoints}
            fillColor="rgba(0, 150, 255, 0.2)"
            strokeColor="rgba(0, 150, 255, 0.5)"
            strokeWidth={2}
          />
          {/* <Marker
          coordinate={endMarkerPosition}
          title="End of Beacon"
          description="60km from your location"
        /> */}
          <AnimatedBeacon coordinate={endMarkerPosition1}>
            <Callout onPress={() => Linking.openURL(calloutLink1)}>
              <View>
                <Text>End of Beacon</Text>
                <Text>60km from your location</Text>
                <Text style={styles.linkText}>Tap to open Google</Text>
              </View>
            </Callout>
          </AnimatedBeacon>
          <AnimatedBeacon coordinate={endMarkerPosition2}>
            <Callout onPress={() => Linking.openURL(calloutLink2)}>
              <View>
                <Text>Search this area</Text>
                <Text style={styles.linkText}>Tap to open Google</Text>
              </View>
            </Callout>
          </AnimatedBeacon>
          {/* <AnimatedBeacon coordinate={endMarkerPosition3}>
            <Callout onPress={() => Linking.openURL(calloutLink3)}>
              <View>
                <Text>End of Beacon</Text>
                <Text>60km from your location</Text>
                <Text style={styles.linkText}>Tap to open Google</Text>
              </View>
            </Callout>
          </AnimatedBeacon> */}
        </MapView>
        <View style={styles.scrollersContainer}>
          {/* Speed and compass direction scroller */}
          <View style={styles.infoWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.infoContainer}
              contentContainerStyle={styles.infoContent}
            >
              <View style={styles.infoChip}>
                <Text style={styles.infoText}>
                  Direction: {compassDirection}
                </Text>
              </View>
              <View style={styles.infoChip}>
                <Text style={styles.infoText}>
                  Speed:{" "}
                  {speed !== null ? `${(speed * 3.6).toFixed(1)} km/h` : "N/A"}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
    backgroundColor: "rgba(138, 143, 226, 0.3)", // Changed to semi-transparent orange
  },
  beaconCenter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgb(138, 143, 226)", // Changed to solid orange
  },
});

export default Map;
