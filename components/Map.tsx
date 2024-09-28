import React, { useState } from "react";
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
import { useLocation } from "../hooks/useLocation";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const INITIAL_LATITUDE_DELTA = 1.5;
const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * ASPECT_RATIO;

const categories = ["Restaurants", "Coffee", "Groceries", "Chemists"];

const Map = () => {
  useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: INITIAL_LATITUDE_DELTA,
    longitudeDelta: INITIAL_LONGITUDE_DELTA,
  });

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

  const beaconPoints = generateRadiusPoints(region, 60, 45, 95);

  // Calculate the position of the end marker
  const endMarkerPosition1 =
    beaconPoints[Math.round(beaconPoints.length / 3.5)]; // Second to last point
  const endMarkerPosition2 = beaconPoints[Math.round(beaconPoints.length / 2)]; // Second to last point
  // const endMarkerPosition3 = beaconPoints[Math.round(beaconPoints.length / 1.5)]; // Second to last point
  console.log("endMarkerPosition", endMarkerPosition2);

  const calloutLink1 = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition1.latitude},${endMarkerPosition1.longitude},11z`;
  const calloutLink2 = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition2.latitude},${endMarkerPosition2.longitude},11z`;
  // const calloutLink3 = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition3.latitude},${endMarkerPosition3.longitude},11z`;
  console.log("calloutLink", calloutLink2);

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView style={styles.map} initialRegion={region}>
          <Marker
            coordinate={region}
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
                <Text>End of Beacon</Text>
                <Text>60km from your location</Text>
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
  categoriesWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingTop: 80, // Adjust this value based on your device's status bar height
    paddingBottom: 10,
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
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  beacon: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 140, 0, 0.3)", // Changed to semi-transparent orange
  },
  beaconCenter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgb(255, 140, 0)", // Changed to solid orange
  },
});

export default Map;
