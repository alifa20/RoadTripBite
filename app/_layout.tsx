import { Splash } from "@/components/Splash";
import { AuthProvider } from "@/contexts/AuthContext";
import { useRevenueCat } from "@/hooks/useRevenueCat";
import functions from "@react-native-firebase/functions";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "../store";

// Use a local emulator in development
if (__DEV__) {
  // If you are running on a physical device, replace http://localhost with the local ip of your PC. (http://192.168.x.x)
  functions().useEmulator("localhost", 5001);
}

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {currentOffering === null ? (
        <Splash />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="subscription" />
        </Stack>
      )}
    </GestureHandlerRootView>
  );
};
