import { API_KEYS } from "@/constants/apiKeys";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
} from "react-native-purchases";
import { useAnonymousAuth } from "./useAnonymousAuth";

export const useRevenueCat = () => {
  const { user } = useAnonymousAuth();
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>();

  useEffect(() => {
    if (!user) {
      return;
    }

    const initializePurchases = async () => {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

      if (Platform.OS === "ios") {
        await Purchases.configure({
          // apiKey: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY,
          apiKey: API_KEYS.apple,
        });
        const { customerInfo, created } = await Purchases.logIn(user.uid);
      }
      //   else if (Platform.OS === 'android') {
      //     await Purchases.configure({
      //       apiKey: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY
      //     });
      //     // OR for Amazon:
      //     // await Purchases.configure({
      //     //   apiKey: process.env.EXPO_PUBLIC_REVENUECAT_AMAZON_API_KEY,
      //     //   useAmazon: true
      //     // });
      //   }
      const offerings = await Purchases.getOfferings();
      setCurrentOffering(offerings.current);
    };

    initializePurchases().catch(console.error);
  }, [user]);

  return { currentOffering };
};
