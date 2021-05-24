import React, {FunctionComponent, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ViewStyle,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import {PredictionType} from './types';

type SearchBarProps = {
  value: string;
  style?: ViewStyle | ViewStyle[];
  onChangeText: (text: string) => void;
  predictions: PredictionType[];
  showPredictions: boolean;
  onPredictionTapped: (placeId: string, description: string) => void;
};

export const SearchBarWithAutocomplete = (props: SearchBarProps) => {
  const [inputSize, setInputSize] = useState({width: 0, height: 0});

  const {
    value,
    style,
    onChangeText,
    onPredictionTapped,
    predictions,
    showPredictions,
  } = props;

  const {container, inputStyle} = styles;
  const passedStyles = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style;
  const inputBottomRadius = showPredictions
    ? {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }
    : {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      };

  const _renderPredictions = (predictions: PredictionType[]) => {
    const {predictionsContainer, predictionRow} = styles;
    const calculatedStyle = {
      width: inputSize.width,
    };

    return (
      <FlatList
        data={predictions}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={predictionRow}
              onPress={() =>
                onPredictionTapped(item.place_id, item.description)
              }>
              <Text numberOfLines={1}>{item.description}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.place_id}
        keyboardShouldPersistTaps="handled"
        style={[predictionsContainer, calculatedStyle]}
      />
    );
  };

  return (
    <View style={[container, {...passedStyles}]}>
      <TextInput
        style={[inputStyle, inputBottomRadius]}
        placeholder="End destination"
        placeholderTextColor="gray"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onLayout={(event) => {
          const {height, width} = event.nativeEvent.layout;
          setInputSize({height, width});
        }}
      />
      {showPredictions && _renderPredictions(predictions)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    // width: 400,
  },
  inputStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
    color: 'black',
    fontSize: 16,
  },
  predictionsContainer: {
    backgroundColor: '#e6e6e6',
    padding: 10,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  predictionRow: {
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomColor: '#8a8a8a',
    borderBottomWidth: 1,
  },
});
