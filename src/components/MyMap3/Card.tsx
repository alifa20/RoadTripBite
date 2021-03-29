import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Place} from '../../api/types';

interface Props {
  place: Place;
  width: number;
  index: number;
  marginRight: number;
}

const Card = ({place, width = 100, index, marginRight = 0}: Props) => {
  return (
    <View style={{width, padding: marginRight}}>
      <View style={[styles.box]}>
        <Text>hi {index}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {borderColor: 'black', borderWidth: 1, flex: 1},
});

export default Card;
