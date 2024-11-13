import { useAppSelector } from "@/app/store/hooks";
import { Marker } from "react-native-maps";
import { useRouter } from "expo-router";

export const LocationMarkers = () => {
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
            // Optional: Navigate to detail view or show more info
            router.push({
              pathname: "/place/[id]",
              params: { id: location.placeId }
            });
          }}
        />
      ))}
    </>
  );
};

