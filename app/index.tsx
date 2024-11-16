import Ads from "@/components/Ads";
import { LocationsBottomSheet } from "@/components/LocationsBottomSheet";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "../components/Map";
import { Test } from "@/components/Test";

export default function Index() {
  const { loading, error } = useAnonymousAuth();
  const bottomSheetRef = useRef<BottomSheet>(null);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Map bottomSheetRef={bottomSheetRef} />
      {/* <Test />   */}
      <LocationsBottomSheet bottomSheetRef={bottomSheetRef} />
      <Ads />
    </SafeAreaView>
  );
}
