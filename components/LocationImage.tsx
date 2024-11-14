import { ActivityIndicator, Image, StyleSheet } from "react-native";

import { PHOTO_SIZE } from "@/constants/BottomSheetConstants";
import { useGetPhotoUrlQuery } from "@/store/api/photoApi";
import React from "react";

interface Props {
  photoReference: string;
}

export const LocationImage = ({ photoReference }: Props) => {
  const { data: photoUrl, isLoading } = useGetPhotoUrlQuery({
    photoReference,
    maxWidth: 400,
  });

  return (
    <>
      {isLoading && <ActivityIndicator style={styles.photo} />}
      <Image
        source={{ uri: photoUrl }}
        style={styles.photo}
        resizeMode="cover"
      />
    </>
  );
};

const styles = StyleSheet.create({
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 0.6,
    borderRadius: 8,
  },
});
