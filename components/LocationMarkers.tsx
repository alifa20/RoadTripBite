import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedLocation } from "@/store/locationSlice";
import BottomSheet from "@gorhom/bottom-sheet";
import { Marker } from "react-native-maps";

interface Props {
  bottomSheetRef: React.RefObject<BottomSheet>;
}

export const LocationMarkers = ({ bottomSheetRef }: Props) => {
  //   const router = useRouter();
  const dispatch = useAppDispatch();
  const locations = useAppSelector((state) => state.location.locations);

  return (
    <>
      {locations.map((location) => (
        <Marker
          stopPropagation={true} // Prevents the map's onPress from being called
          key={location.placeId}
          coordinate={{
            latitude: location.location.lat,
            longitude: location.location.lng,
          }}
          title={location.name}
          description={location.address}
          onPress={() => {
            dispatch(setSelectedLocation(location));
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
