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
    <TouchableOpacity
      hitSlop={{
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      }}
      style={style.container}
      onPress={onPress}
    >
      <Ionicons name="close" size={24} color="#333" />
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
});
