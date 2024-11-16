import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import MapView from "react-native-maps";

const { width, height } = Dimensions.get("window");

export const Test = () => {
  return (
    <MapView showsCompass={true} style={styles.map} rotateEnabled={true} />
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
});
