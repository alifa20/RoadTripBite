import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

interface CompassProps {
  heading: number;
  direction: string;
}

export function Compass({ heading, direction }: CompassProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${heading}deg` }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.compassOuter}>
        <Animated.View style={[styles.compassInner, animatedStyle]}>
          <View style={styles.arrow} />
          <View style={styles.cardinalPoints}>
            {["N", "E", "S", "W"].map((point) => (
              <Text
                key={point}
                style={[
                  styles.cardinalPoint,
                  point === "N" && styles.cardinalPointNorth,
                ]}
              >
                {point}
              </Text>
            ))}
          </View>
        </Animated.View>
      </View>
      <Text style={styles.direction}>{direction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  compassOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  compassInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    width: 4,
    height: 25,
    backgroundColor: "red",
    position: "absolute",
    top: 5,
  },
  cardinalPoints: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardinalPoint: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
  cardinalPointNorth: {
    color: "red",
  },
  direction: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
});
