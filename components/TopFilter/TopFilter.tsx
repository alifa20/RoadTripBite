import React, { useReducer } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Chip from "./Chip";
import { initialState } from "./initialState";
import { reducer } from "./reducer";
import { SetFilterPayload } from "./types";

const TopFilter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isDirty = state.isDirty;
  const newFilter = state.newFilter;
  // console.log("statestatestate", state.oldFilter);
  const searchPress = () => {
    dispatch({
      type: "SAVE_OLD_FILTER",
    });
  };
  const chipPress = (payload: SetFilterPayload) => {
    dispatch({
      type: "UPDATE_FILTER",
      payload: {
        isDirty: true,
        filter: payload,
      },
    });
  };

  const undoPress = () => {
    dispatch({
      type: "SET_FILTER",
      payload: { filter: state.oldFilter, isDirty: false },
    });
  };

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
        <Chip
          selected={newFilter.restaurants.checked}
          onPress={() =>
            chipPress({ key: "restaurants", rating: 4, checked: true })
          }
        >
          <Text>Restaurant 4+ </Text>
        </Chip>
        <Chip
          onPress={() => chipPress({ key: "petrol", checked: true })}
          selected={newFilter.petrol.checked}
        >
          <Text>Petrol </Text>
        </Chip>
        <Chip
          onPress={() => chipPress({ key: "groceries", checked: true })}
          selected={newFilter.groceries.checked}
        >
          <Text>Groceries</Text>
        </Chip>
        <Chip
          onPress={() => chipPress({ key: "coffee", rating: 4, checked: true })}
          selected={newFilter.coffee.checked}
        >
          <Text>Coffee 3+</Text>
        </Chip>
        <Chip
          onPress={() => chipPress({ key: "hotels", rating: 4, checked: true })}
          selected={newFilter.hotels.checked}
        >
          <Text>Hotels 3+</Text>
        </Chip>
      </ScrollView>
      <View style={styles.searchRow}>
        {isDirty && (
          <Chip onPress={undoPress}>
            <Text>Undo </Text>
          </Chip>
        )}
        {isDirty && (
          <Chip onPress={() => searchPress()}>
            <Text>Search for my trip! </Text>
          </Chip>
        )}
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
  searchRow: {
    paddingTop: 5,
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    paddingHorizontal: 10,
  },
});
export default TopFilter;
