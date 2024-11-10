import { Paywall } from "@/components/RevenueCatUI/Paywall";
import { useRouter } from "expo-router";

export default function SubscriptionScreen() {
  const router = useRouter();

  const handleDismiss = () => {
    router.back();
  };

  const handlePurchaseCompleted = () => {
    router.replace("/");
  };

  return (
    <Paywall
      onDismiss={handleDismiss}
      onPurchaseCompleted={handlePurchaseCompleted}
    />
  );
}
