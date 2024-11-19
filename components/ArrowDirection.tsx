import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  DIRECTIONS,
  setDirection,
  setHeadingManual,
} from "@/store/odometerSlice";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  style: ViewStyle;
}

// type Direction = {
//   name: string;
//   symbol: string;
//   range: [number, number];
// };

// const DIRECTIONS: Direction[] = [
//   { name: "N", symbol: "↑", range: [337.5, 22.5] },
//   { name: "NE", symbol: "↗", range: [22.5, 67.5] },
//   { name: "E", symbol: "→", range: [67.5, 112.5] },
//   { name: "SE", symbol: "↘", range: [112.5, 157.5] },
//   { name: "S", symbol: "↓", range: [157.5, 202.5] },
//   { name: "SW", symbol: "↙", range: [202.5, 247.5] },
//   { name: "W", symbol: "←", range: [247.5, 292.5] },
//   { name: "NW", symbol: "↖", range: [292.5, 337.5] },
// ];

export const ArrowDirection = ({ style }: Props) => {
  const radarColor = useThemeColor({}, "radar");
  const dispatch = useAppDispatch();

  const deviceDirection = useAppSelector((state) => state.odometer.direction);
  const headingManual = useAppSelector((state) => state.odometer.headingManual);

  const [isManualSet, setIsManualSet] = useState(headingManual);

  const theDirection = isManualSet ? deviceDirection : deviceDirection;

  return (
    <TouchableHighlight
      onPress={() => {
        if (!isManualSet) {
          setIsManualSet(true);
          dispatch(setHeadingManual(true));
        }

        const current = DIRECTIONS.findIndex(
          (dir) => dir.name === deviceDirection.name
        );
        const next = (current + 1) % DIRECTIONS.length;

        dispatch(setDirection(DIRECTIONS[next]));
      }}
      onLongPress={() => {
        setIsManualSet(false);
        dispatch(setHeadingManual(false));
      }}
    >
      <View
        style={[
          style,
          { alignItems: "center" },
          !isManualSet ? [styles.manual, { borderColor: radarColor }] : {},
        ]}
      >
        <Text style={{ fontSize: 26 }}>{theDirection.symbol}</Text>
        <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontSize: 16 }}>
          {theDirection.name}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  manual: {
    borderWidth: 2,
  },
});
