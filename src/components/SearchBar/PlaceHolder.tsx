import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface Props {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
}

export const PlaceHolder = ({text, onPress}: Props) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // height: 151,
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginVertical: 5,
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
  },
  text: {
    color: 'black',
    fontSize: 14,
  },
});
