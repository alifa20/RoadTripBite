/**
 * Copyright (c) 2020 Raul Gomez Acuna
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
// import { Colors, ProgressBar } from "react-native-paper";
import ScrollBottomSheet from "react-native-scroll-bottom-sheet";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { HomeStackParamsList } from "../App";
import { createMockData, ListItemData } from "../utils";
import Handle from "../components/Handle";
import Transaction from "../components/Transaction";
import Animated, {
  concat,
  Easing,
  Extrapolate,
  interpolate,
  Value,
} from "react-native-reanimated";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Permissions from "expo-permissions";
import BottomSheetContent from "../components/BottomSheetContent";
import { TopFilter } from "../components/TopFilter";

interface Props {
  //   navigation: StackNavigationProp<HomeStackParamsList, "Main">;
}

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");
const { statusBarHeight } = Constants;
const navBarHeight = 56;

const sections = createMockData();

const Main: React.FC<Props> = () => {
  const snapPointsFromTop = ["45%", windowHeight - 100];
  const animatedPosition = React.useRef(new Value(0.5));
  const bottomSheetRef = useRef<ScrollBottomSheet<ListItemData>>(null);
  const [location, setLocation] = useState<Location.LocationObject>({
    coords: {
      latitude: 37.78825,
      longitude: -122.4324,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: 0,
  });
  const [errorMsg, setErrorMsg] = useState<string>();

  const handleLeftRotate = concat(
    interpolate(animatedPosition.current, {
      inputRange: [0, 0.4, 1],
      outputRange: [25, 0, 0],
      extrapolate: Extrapolate.CLAMP,
    }),
    "deg"
  );
  const handleRightRotate = concat(
    interpolate(animatedPosition.current, {
      inputRange: [0, 0.4, 1],
      outputRange: [-25, 0, 0],
      extrapolate: Extrapolate.CLAMP,
    }),
    "deg"
  );
  const cardScale = interpolate(animatedPosition.current, {
    inputRange: [0, 0.6, 1],
    outputRange: [1, 1, 0.9],
    extrapolate: Extrapolate.CLAMP,
  });

  const renderSectionHeader = React.useCallback(
    ({ section }) => (
      <View style={styles.section}>
        <Text>{section.title}</Text>
      </View>
    ),
    []
  );

  const renderItem = React.useCallback(
    ({ item }) => <Transaction {...item} />,
    []
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const closeBottomSheet = () => {
    bottomSheetRef?.current?.snapTo(1);
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPanDrag={closeBottomSheet}
      />
      <TopFilter />
      {/* <ScrollView style={styles.scrollView}> */}
      <ScrollBottomSheet<ListItemData>
        ref={bottomSheetRef}
        enableOverScroll
        removeClippedSubviews={Platform.OS === "android" && sections.length > 0}
        componentType="ScrollView"
        topInset={statusBarHeight + navBarHeight}
        animatedPosition={animatedPosition.current}
        snapPoints={snapPointsFromTop}
        initialSnapIndex={0}
        animationConfig={{
          easing: Easing.inOut(Easing.linear),
        }}
        renderHandle={() => (
          <Handle style={{ paddingVertical: 20, backgroundColor: "#F3F4F9" }}>
            <Animated.View
              style={[
                styles.handle,
                {
                  left: windowWidth / 2 - 20,
                  transform: [{ rotate: handleLeftRotate }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.handle,
                {
                  right: windowWidth / 2 - 20,
                  transform: [{ rotate: handleRightRotate }],
                },
              ]}
            />
          </Handle>
        )}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <BottomSheetContent />
      </ScrollBottomSheet>

      {/* <ScrollBottomSheet<ListItemData>
        enableOverScroll
        removeClippedSubviews={Platform.OS === "android" && sections.length > 0}
        componentType="ScrollView"
        topInset={statusBarHeight + navBarHeight}
        animatedPosition={animatedPosition.current}
        snapPoints={snapPointsFromTop}
        initialSnapIndex={1}
        animationConfig={{
          easing: Easing.inOut(Easing.linear),
        }}
        renderHandle={() => (
          <Handle style={{ paddingVertical: 20, backgroundColor: "#F3F4F9" }}>
            <Animated.View
              style={[
                styles.handle,
                {
                  left: windowWidth / 2 - 20,
                  transform: [{ rotate: handleLeftRotate }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.handle,
                {
                  right: windowWidth / 2 - 20,
                  transform: [{ rotate: handleRightRotate }],
                },
              ]}
            />
          </Handle>
        )}
        contentContainerStyle={styles.contentContainerStyle}
        stickySectionHeadersEnabled
        sections={sections}
        keyExtractor={(i) => i.id}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    alignItems: "center",
  },
  contentContainerStyle: {
    backgroundColor: "white",
  },
  handle: {
    position: "absolute",
    width: 22,
    height: 4,
    backgroundColor: "#BDBDBD",
    borderRadius: 4,
    marginTop: 17,
  },
  card: {
    width: windowWidth - 128,
    height: (windowWidth - 128) / 1.57,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 8,
  },
  section: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F9",
    borderWidth: 0.5,
    borderColor: "#B7BECF",
  },
  row: {
    marginTop: 24,
    width: windowWidth - 128,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  balance: {
    fontWeight: "bold",
    fontSize: 32,
  },
  progressBar: {
    width: windowWidth - 256,
    marginBottom: 24,
    borderRadius: 4,
  },
  action: {
    height: 48,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#81D4FA",
    marginBottom: 8,
  },
  poundSign: {
    fontWeight: "bold",
    fontSize: 18,
    paddingTop: 8,
  },
  map: { width: windowWidth, height: windowHeight },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
});

export default Main;
