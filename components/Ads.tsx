import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
const { height } = Dimensions.get("window");

export const Ads = () => {
  return (
    <View style={styles.container}>
      <Text>Ads1</Text>
      <Text>Ads2</Text>
      <Text>Ads1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height / 3,
  },
});
