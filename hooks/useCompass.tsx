import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
// @ts-ignore
import CompassHeading from "react-native-compass-heading";

export const useCompass = () => {
  const [heading, setHeading] = useState(-1);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const degree_update_rate = 3;

    CompassHeading.start(degree_update_rate, ({ heading, accuracy }) => {
      setAccuracy(accuracy);
      setHeading(heading);
      console.log("CompassHeading: ", heading, accuracy);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  return { heading, accuracy };
};
