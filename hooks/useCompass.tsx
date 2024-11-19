import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { DIRECTIONS, setDirection, setHeading } from "@/store/odometerSlice";
import { useEffect, useState } from "react";
// @ts-ignore
import CompassHeading from "react-native-compass-heading";

type Direction = {
  name: string;
  symbol: string;
  range: [number, number];
};

const getDirection = (heading: number) => {
  // Normalize heading to 0-360
  const normalizedHeading = ((heading % 360) + 360) % 360;

  // Special case for North which wraps around 360/0
  if (
    normalizedHeading >= DIRECTIONS[0].range[0] ||
    normalizedHeading <= DIRECTIONS[0].range[1]
  ) {
    return DIRECTIONS[0];
  }

  // Find matching direction
  return (
    DIRECTIONS.find(
      (direction) =>
        normalizedHeading > direction.range[0] &&
        normalizedHeading <= direction.range[1]
    ) || DIRECTIONS[0]
  ); // Default to North if no match (shouldn't happen)
};
export const useCompass = () => {
  // const [heading, setHeading] = useState(-1);
  const [accuracy, setAccuracy] = useState(0);
  const dispatch = useAppDispatch();
  const headingManual = useAppSelector((state) => state.odometer.headingManual);

  useEffect(() => {
    const degree_update_rate = 3;

    CompassHeading.start(degree_update_rate, ({ heading, accuracy }: any) => {
      
      dispatch(setHeading(heading));

      if (headingManual) {
        return;
      }

      setAccuracy(accuracy);
      setHeading(heading);
      dispatch(setDirection(getDirection(heading)));
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  // const currentDirection = useMemo(() => {
  //   // Normalize heading to 0-360
  //   const normalizedHeading = ((heading % 360) + 360) % 360;

  //   // Special case for North which wraps around 360/0
  //   if (
  //     normalizedHeading >= DIRECTIONS[0].range[0] ||
  //     normalizedHeading <= DIRECTIONS[0].range[1]
  //   ) {
  //     return DIRECTIONS[0];
  //   }

  //   // Find matching direction
  //   return (
  //     DIRECTIONS.find(
  //       (direction) =>
  //         normalizedHeading > direction.range[0] &&
  //         normalizedHeading <= direction.range[1]
  //     ) || DIRECTIONS[0]
  //   ); // Default to North if no match (shouldn't happen)
  // }, [heading]);

  // return { heading, accuracy, roundedHeading: currentDirection };
  return null;
};
