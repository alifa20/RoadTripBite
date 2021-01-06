import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  children: ReactNode;
  selected?: boolean;
}
const Chip = ({ children, selected = false }: Props) => (
  <TouchableOpacity
    style={[
      styles.container,
      { backgroundColor: selected ? "#dedede" : "white" },
    ]}
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
