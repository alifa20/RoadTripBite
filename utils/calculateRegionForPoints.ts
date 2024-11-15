const { height } = Dimensions.get("window");

import { Dimensions } from "react-native";
import { LatLng, Region } from "react-native-maps";

// Add this function outside of the Map component
export const calculateRegionForPoints = (
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
