import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface Props {
  onPress: TouchableOpacityProps["onPress"];
}

export const CloseButton = ({ onPress }: Props) => {
  return (
    <TouchableOpacity style={style.container} onPress={onPress}>
      <Ionicons name="close" size={24} color="#333" />
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: {
    padding: 5,
  },
});
