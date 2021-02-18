import React, {ReactNode} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface Props {
  children: ReactNode;
  selected?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  icon?: ReactNode;
}
const Chip = ({
  children,
  icon,
  selected = false,
  onPress = () => {},
}: Props) => (
  <TouchableWithoutFeedback
    // style={[
    //   styles.container,
    //   {backgroundColor: selected ? '#dedede' : 'white'},
    // ]}
    onPress={onPress}>
    <View
      style={[
        styles.container,
        {backgroundColor: selected ? '#dedede' : 'white'},
        {
          flexDirection: 'row',
        },
      ]}>
      {icon && icon}
      {children}
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',

    marginHorizontal: 2,
  },
});

export default Chip;
