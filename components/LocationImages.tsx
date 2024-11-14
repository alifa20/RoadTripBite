import { PHOTO_MARGIN, PHOTO_SIZE } from "@/constants/BottomSheetConstants";
import { useGetPhotoUrlQuery } from "@/store/api/photoApi";
import { PlaceDetails } from "@/store/api/placeApi";
import { useAppSelector } from "@/store/hooks";
import React from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet } from "react-native";
import { LocationImage } from "./LocationImage";

interface Props {
  photos: PlaceDetails["photos"];
}
export const LocationImages = ({ photos }: Props) => {
  const selectedLocation = useAppSelector(
    (state) => state.location.selectedLocation
  );

  // const { data: photoUrl } = useGetPhotoUrlQuery(
  //   {
  //     photoReference: selectedLocation?.photos[0] ?? "",
  //     maxWidth: 400,
  //   },
  //   {
  //     skip: !selectedLocation?.photos[0],
  //   }
  // );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.photoScroller}
    >
      {/* {selectedLocation.photos.map((photo) => ( */}
      {/* <Image
        // key={photo}
        source={{ uri: photoUrl }}
        style={styles.photo}
        resizeMode="cover"
      /> */}
      {photos?.map((photo) => (
        <LocationImage
          key={photo.photo_reference}
          photoReference={photo.photo_reference}
        />
      ))}

      {/* ))} */}
    </ScrollView>
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
