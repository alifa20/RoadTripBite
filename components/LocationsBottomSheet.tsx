import { useAppSelector } from "@/store/hooks";
import { ADS_HEIGHT } from "@/constants";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import { StyleSheet, Text } from "react-native";

interface Props {
  bottomSheetRef: React.RefObject<BottomSheet>;
}

export const LocationsBottomSheet = ({ bottomSheetRef }: Props) => {
  const showBottomSheet = useAppSelector(
    (state) => state.location.showBottomSheet
  );

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[ADS_HEIGHT + 50, ADS_HEIGHT + 150]}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: { flex: 1, padding: 36, alignItems: "center" },
});
