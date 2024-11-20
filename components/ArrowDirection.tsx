import { useCompass } from "@/hooks/useCompass";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  DIRECTIONS,
  setDirection,
  setHeadingManual,
} from "@/store/odometerSlice";
import React, { useCallback, useMemo } from "react";
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

export const ArrowDirection = ({ style }: Props) => {
  useCompass();

  const radarColor = useThemeColor({}, "radar");
  const dispatch = useAppDispatch();
  const deviceDirection = useAppSelector((state) => state.odometer.direction);
  const headingManual = useAppSelector((state) => state.odometer.headingManual);

  const handlePress = useCallback(() => {
    if (!headingManual) {
      dispatch(setHeadingManual(true));
    }

    const current = DIRECTIONS.findIndex(
      (dir) => dir.name === deviceDirection.name
    );
    const next = (current + 1) % DIRECTIONS.length;
    dispatch(setDirection(DIRECTIONS[next]));
  }, [dispatch, deviceDirection.name, headingManual]);

  const handleLongPress = useCallback(() => {
    dispatch(setHeadingManual(false));
  }, [dispatch]);

  return (
    <TouchableHighlight
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={500}
      //   underlayColor="rgba(128, 128, 128, 0.2)"
    >
      <View
        style={[
          style,
          { alignItems: "center" },
          !headingManual ? [styles.manual, { borderColor: radarColor }] : {},
        ]}
      >
        <Text style={{ fontSize: 26 }}>{deviceDirection.symbol}</Text>
        <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontSize: 16 }}>
          {deviceDirection.name}
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
