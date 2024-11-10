import { AuthProvider } from "@/contexts/AuthContext";
import { useRevenueCat } from "@/hooks/useRevenueCat";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./store";
import { Splash } from "@/components/Splash";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RootContent />
      </AuthProvider>
    </Provider>
  );
}

const RootContent = () => {
  const { currentOffering } = useRevenueCat();
  console.log("currentOffering", currentOffering);

  if (currentOffering === null) {
    return <Splash />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="subscription" />
      </Stack>
    </GestureHandlerRootView>
  );
};
