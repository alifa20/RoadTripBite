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
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const INITIAL_LATITUDE_DELTA = 1.5;
const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * ASPECT_RATIO;

const categories = ["Restaurants", "Coffee", "Groceries", "Chemists"];

const Map = () => {
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
  const generateRadiusPoints = (center, radiusInKm, startAngle, endAngle) => {
    const points = [];
    const earthRadius = 6371; // Earth's radius in kilometers
    const angularDistance = radiusInKm / earthRadius;

    for (let i = startAngle; i <= endAngle; i += 5) {
      const radians = i * (Math.PI / 180);
      const lat = Math.asin(
        Math.sin(center.latitude * (Math.PI / 180)) *
          Math.cos(angularDistance) +
          Math.cos(center.latitude * (Math.PI / 180)) *
            Math.sin(angularDistance) *
            Math.cos(radians)
      );
      const lon =
        center.longitude * (Math.PI / 180) +
        Math.atan2(
          Math.sin(radians) *
            Math.sin(angularDistance) *
            Math.cos(center.latitude * (Math.PI / 180)),
          Math.cos(angularDistance) -
            Math.sin(center.latitude * (Math.PI / 180)) * Math.sin(lat)
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
  const endMarkerPosition = beaconPoints[Math.round(beaconPoints.length / 2)]; // Second to last point
  console.log("endMarkerPosition", endMarkerPosition);

  const onRegionChangeComplete = (newRegion: Region) => {
    const zoomLevel =
      Math.log2(360 * (width / 256 / newRegion.longitudeDelta)) + 1;
    console.log(
      "Current zoom level:",
      zoomLevel,
      newRegion.longitudeDelta,
      newRegion.latitudeDelta
    );
  };

  const calloutLink = `https://www.google.com/maps/search/${selectedCategory}/@${endMarkerPosition.latitude},${endMarkerPosition.longitude},11z`;
  console.log("calloutLink", calloutLink);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          onRegionChangeComplete={onRegionChangeComplete}
          style={styles.map}
          // provider={PROVIDER_GOOGLE}
          initialRegion={region}
        >
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
          <Marker coordinate={endMarkerPosition}>
            <Callout onPress={() => Linking.openURL(calloutLink)}>
              <View>
                <Text>End of Beacon</Text>
                <Text>60km from your location</Text>
                <Text style={styles.linkText}>Tap to open Google</Text>
              </View>
            </Callout>
          </Marker>
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
});

export default Map;
