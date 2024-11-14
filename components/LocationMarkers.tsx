import { useAppSelector } from "@/store/hooks";
import { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";

interface Props {
  bottomSheetRef: React.RefObject<BottomSheet>;
}

export const LocationMarkers = ({ bottomSheetRef }: Props) => {
  const router = useRouter();
  const locations = useAppSelector((state) => state.location.locations);

  return (
    <>
      {locations.map((location) => (
        <Marker
          key={location.placeId}
          coordinate={{
            latitude: location.location.lat,
            longitude: location.location.lng,
          }}
          title={location.name}
          description={location.address}
          onPress={() => {
            bottomSheetRef.current?.expand();
            // // Optional: Navigate to detail view or show more info
            // router.push({
            //   pathname: "/place/[id]",
            //   params: { id: location.placeId }
            // });
          }}
        />
      ))}
    </>
  );
};
