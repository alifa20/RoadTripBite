import { Region } from "react-native-maps";

// Function to generate points for the angled radius beacon
export const generateRadiusPoints = (
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