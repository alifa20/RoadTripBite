import React, {ReactNode} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableHighlight,
  View,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';

interface Props {
  children: ReactNode;
  selected?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  icon?: ReactNode;
  style?: ViewStyle;
  loading?: boolean;
}
const Chip = ({
  children,
  icon,
  selected = false,
  onPress = () => {},
  loading = false,
  style,
}: Props) => {
  // if (loading) return <ActivityIndicator />;

  const showIcon = !loading && icon;
  const showChildren = !loading;

  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      style={[{borderRadius: 25}, style]}
      {...(!loading && {onPress})}>
      <View
        style={[
          styles.container,
          {backgroundColor: selected ? '#dedede' : 'white'},
          {
            flexDirection: 'row',
          },
        ]}>
        {loading && <ActivityIndicator />}
        {showIcon && icon}
        {showChildren && children}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    // justifyContent: 'center',
    marginHorizontal: 2,
  },
});

export default Chip;
