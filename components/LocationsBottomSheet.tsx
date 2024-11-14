import { ADS_HEIGHT } from "@/constants";
import { PHOTO_MARGIN, PHOTO_SIZE } from "@/constants/BottomSheetConstants";
import { useGetPlaceDetailsQuery } from "@/store/api/placeApi";
import { useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LocationImages } from "./LocationImages";

interface Props {
  bottomSheetRef: React.RefObject<BottomSheet>;
}

const Content = () => {
  const selectedLocation = useAppSelector(
    (state) => state.location.selectedLocation
  );

  const placeDetails = useGetPlaceDetailsQuery(
    {
      placeId: selectedLocation?.placeId ?? "",
      // fields: "photos,rating,user_ratings_total,opening_hours",
    },
    {
      skip: !selectedLocation?.placeId,
    }
  );

  const photos = [
    {
      photo_reference: selectedLocation?.photos?.[0] || "",
      width: 0,
      height: 0,
    },
    ...(placeDetails.currentData?.photos ?? []).slice(1, 5),
  ];

  return (
    <>
      <Text style={styles.title}>{selectedLocation?.name}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.address}>{selectedLocation?.address}</Text>
        </View>
        {selectedLocation?.rating && (
          <View style={styles.row}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>
              {selectedLocation?.rating} ({selectedLocation?.userRatingsTotal}{" "}
              reviews)
            </Text>
          </View>
        )}
        <View style={styles.row}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.status}>
            {selectedLocation?.isOpen ? "Open" : "Closed"}
          </Text>
        </View>
      </View>
      <LocationImages photos={photos} />
    </>
  );
};
export const LocationsBottomSheet = ({ bottomSheetRef }: Props) => {
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[ADS_HEIGHT + 50, ADS_HEIGHT + 200]}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Content />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  photoScroller: {
    paddingVertical: 12,
    gap: PHOTO_MARGIN,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 0.6,
    borderRadius: 8,
  },
  detailsContainer: {
    gap: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  address: {
    flex: 1,
    color: "#666",
  },
  rating: {
    color: "#666",
  },
  status: {
    color: "#666",
  },
});
