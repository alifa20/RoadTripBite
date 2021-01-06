import React, { ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

interface Props {
  children: ReactNode;
  selected?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}
const Chip = ({ children, selected = false, onPress = () => {} }: Props) => (
  <TouchableOpacity
    style={[
      styles.container,
      { backgroundColor: selected ? "#dedede" : "white" },
    ]}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ddd",

    marginHorizontal: 2,
  },
});

export default Chip;
