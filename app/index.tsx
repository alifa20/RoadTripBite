import Ads from "@/components/Ads";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "../components/Map";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Map />
      <Ads />
    </SafeAreaView>
  );
}
