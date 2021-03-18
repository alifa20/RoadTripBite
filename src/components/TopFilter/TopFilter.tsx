import React, {useEffect, useReducer} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Chip from './Chip';
import {initialState} from './initialState';
import {reducer} from './reducer';
import {Filter, SetFilterPayload} from './types';
// import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getPlaces} from '../../api/places';
import {getNewTimeFormatted} from '../../utils/timeUtil';

interface Props {
  searchFinished: any;
  lat: number;
  lng: number;
  direction: number;
  km: number;
  goByPressed: () => void;
  travelTool?: {icon: string; value: string; speed: number};
  showSearch: boolean;
}
const TopFilter = ({
  searchFinished,
  lat,
  lng,
  km,
  goByPressed,
  travelTool = {icon: 'car-hatchback', value: 'Going by Car', speed: 30},
  showSearch,
}: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log('statestate', state);
  // console.log(new Date());
  const isDirty = state.isDirty;
  const filter = state.filter;
  const hasSelected = (Object.keys(filter) as Array<keyof typeof filter>).find(
    (key) => filter[key].checked === true,
  );
  // console.log("statestatestate", state.oldFilter);
  const keys = Object.keys(state.filter)
    .filter((key) => (state.filter as any)[key].checked)
    .filter(Boolean);
  const searchPress = async () => {
    const places = await getPlaces(
      keys,
      lat,
      lng,
      state.direction,
      state.goingBy,
      state.time,
    );

    searchFinished(places);
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
        <View>
          <Chip
            icon={
              <MaterialCommunityIcons
                // name="walk"
                // name="bike"
                // name="car-hatchback"
                name={travelTool.icon}
                size={16}
                color="green"
                style={{marginRight: 5}}
              />
            }
            onPress={goByPressed}>
            <Text>{travelTool.value}</Text>
          </Chip>
          <Chip selected={true}>
            <Text>Arrive at ~ {getNewTimeFormatted(km, travelTool.speed)}</Text>
          </Chip>
        </View>
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

        {/* <Chip>
          <Text>Arrive at: {`${state.time}`}</Text>

        </Chip>
       <Chip
          icon={
            <MaterialCommunityIcons
              name="lock-open-variant-outline"
              size={16}
              color="green"
              style={{marginRight: 5}}
            />
          }>
          <Text>{direction} Direction: North</Text>
          <MaterialCommunityIcons
            name="arrow-down"
            size={16}
            color="green"
            style={{marginRight: 5}}
          />
        </Chip>   */}

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
        {/* <Chip onPress={undoPress}>
          <Text>Clear filter </Text>
        </Chip> */}
        {/* )} */}
        {/* {hasSelected && isDirty && ( */}
        {showSearch && (
          <Chip onPress={() => searchPress()}>
            <Text>Search for my trip! </Text>
          </Chip>
        )}
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
    alignItems: 'flex-start',
    height: 70,
  },
  searchRow: {
    paddingTop: 5,
    // justifyContent: "space-between",
    // flexDirection: 'row-reverse',
    // flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
export default TopFilter;
