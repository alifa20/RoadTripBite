import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface Props {
  speed?: number;
  style: ViewStyle;
}

export const SpeedOMeter = ({ speed = 0, style }: Props) => {
  return (
    <View style={style}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.speedValue]}>
        {(speed * 3.6).toFixed(0)}
      </Text>
      <Text style={styles.speedUnit}>km/h</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
