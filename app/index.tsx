import Ads from "@/components/Ads";
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "../components/Map";

export default function Index() {
  const { loading, error } = useAnonymousAuth();

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
      <Map />
      <Ads />
    </SafeAreaView>
  );
}
