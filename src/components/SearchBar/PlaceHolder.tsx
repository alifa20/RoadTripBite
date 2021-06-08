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
    // flex: 1,`
    // height: 151,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  text: {
    color: 'black',
    fontSize: 14,
  },
});
