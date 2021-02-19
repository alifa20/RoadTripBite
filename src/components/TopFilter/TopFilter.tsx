import React, {useEffect, useReducer} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Chip from './Chip';
import {initialState} from './initialState';
import {reducer} from './reducer';
import {SetFilterPayload} from './types';
// import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TopFilter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isDirty = state.isDirty;
  const filter = state.filter;
  const hasSelected = (Object.keys(filter) as Array<keyof typeof filter>).find(
    (key) => filter[key].checked === true,
  );
  // console.log("statestatestate", state.oldFilter);
  const searchPress = () => {
    dispatch({
      type: 'SET_IS_DIRTY',
      payload: {isDirty: false},
    });
  };
  const chipPress = (payload: SetFilterPayload) => {
    dispatch({
      type: 'UPDATE_FILTER',
      payload: {
        isDirty: true,
        filter: payload,
      },
    });
  };

  const undoPress = () => {
    dispatch({
      type: 'CLEAR_FILTER',
    });
  };

  useEffect(() => {
    chipPress({
      key: 'restaurants',
      rating: 4,
      checked: !state.filter.restaurants.checked,
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <Chip
          selected={filter.restaurants.checked}
          onPress={() =>
            chipPress({
              key: 'restaurants',
              rating: 4,
              checked: !state.filter.restaurants.checked,
            })
          }>
          <Text>Restaurant 4+ </Text>
        </Chip>
        <Chip>
          <Text>Arrive at: 17:30</Text>
        </Chip>
        <Chip>
          <Text>Direction: North</Text>
        </Chip>
        <Chip
          icon={
            <MaterialCommunityIcons
              // name="walk"
              name="bike"
              // name="car-hatchback"
              size={16}
              color="green"
              style={{marginRight: 5}}
            />
          }>
          <Text>Going by Car</Text>
        </Chip>

        <Chip
          onPress={() =>
            chipPress({key: 'petrol', checked: !state.filter.petrol.checked})
          }
          selected={filter.petrol.checked}>
          <Text>Petrol </Text>
        </Chip>
        <Chip
          onPress={() =>
            chipPress({
              key: 'groceries',
              checked: !state.filter.groceries.checked,
            })
          }
          selected={filter.groceries.checked}>
          <Text>Groceries</Text>
        </Chip>
        <Chip
          onPress={() =>
            chipPress({
              key: 'coffee',
              rating: 4,
              checked: !state.filter.coffee.checked,
            })
          }
          selected={filter.coffee.checked}>
          <Text>Coffee 3+</Text>
        </Chip>
        <Chip
          onPress={() =>
            chipPress({
              key: 'hotels',
              rating: 4,
              checked: !state.filter.hotels.checked,
            })
          }
          selected={filter.hotels.checked}>
          <Text>Hotels 3+</Text>
        </Chip>
      </ScrollView>
      <View style={styles.searchRow}>
        {/* {hasSelected && ( */}
        <Chip onPress={undoPress}>
          <Text>Clear filter </Text>
        </Chip>
        {/* )} */}
        {/* {hasSelected && isDirty && ( */}
        <Chip onPress={() => searchPress()}>
          <Text>Search for my trip! </Text>
        </Chip>
        {/* )} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 70,
    width: '100%',
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  searchRow: {
    paddingTop: 5,
    // justifyContent: "space-between",
    flexDirection: 'row-reverse',
    paddingHorizontal: 10,
  },
});
export default TopFilter;
