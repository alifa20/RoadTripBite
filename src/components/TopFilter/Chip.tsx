import React, {ReactNode} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableHighlight,
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
  <TouchableHighlight
    activeOpacity={0.6}
    underlayColor="#DDDDDD"
    style={[
      {borderRadius: 25},
      //   styles.container,
      //   {backgroundColor: selected ? '#dedede' : 'white'},
    ]}
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
  </TouchableHighlight>
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
