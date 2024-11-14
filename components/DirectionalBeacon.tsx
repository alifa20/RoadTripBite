import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const DirectionalBeacon = ({ heading }: { heading: number }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
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
      transform: [{ scale: scale.value }, { rotate: `${heading}deg` }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.directionalBeaconContainer}>
      <Animated.View style={[styles.directionalBeacon, animatedStyle]} />
      <View style={styles.directionalBeaconCenter} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});
