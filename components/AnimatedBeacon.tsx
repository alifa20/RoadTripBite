import React from "react";
import { StyleSheet, View } from "react-native";
import { LatLng, Marker } from "react-native-maps";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const AnimatedBeacon = ({
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

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(84, 56, 54, 0.3)",
  },
  beaconCenter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgb(84, 56, 54)",
  },
});
