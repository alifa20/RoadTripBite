import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import Chip from "./Chip";

const TopFilter = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Chip>
          <Text>Arrive at: 17:30</Text>
        </Chip>
        <Chip>
          <Text>Direction: North</Text>
        </Chip>
        <Chip selected>
          <Text>Restaurant 4+ </Text>
        </Chip>
        <Chip>
          <Text>Petrol </Text>
        </Chip>
        <Chip>
          <Text>Groceries</Text>
        </Chip>
        <Chip>
          <Text>Coffee 3+</Text>
        </Chip>
        <Chip>
          <Text>Hotels 3+</Text>
        </Chip>
      </ScrollView>
      <View style={styles.searchRow}>
        <Chip>
          <Text>Search for my trip! </Text>
        </Chip>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 70,
    width: "100%",
  },
  scrollContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  searchRow: { paddingTop: 5, alignItems: "center" },
});
export default TopFilter;
