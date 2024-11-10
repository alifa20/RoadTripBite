import React from "react";
import { View } from "react-native";
import { PurchasesOffering } from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";

interface PaywallProps {
  onDismiss?: () => void;
  onPurchaseCompleted?: () => void;
  onRestoreCompleted?: () => void;
  offering?: PurchasesOffering | null;
}

export const Paywall = ({
  onDismiss,
  onPurchaseCompleted,
  onRestoreCompleted,
  offering,
}: PaywallProps) => {
  return (
    <View style={{ flex: 1 }}>
      <RevenueCatUI.Paywall
        options={{ displayCloseButton: true, offering }}
        onDismiss={onDismiss}
        onPurchaseCompleted={onPurchaseCompleted}
        onRestoreCompleted={onRestoreCompleted}
      />
    </View>
  );
};
