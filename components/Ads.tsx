import { ADS_HEIGHT } from "@/constants";
import React, { useRef } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";

const { height } = Dimensions.get("window");

// banner
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-5971323065106042/5579059579";

// native
// const adUnitId = "ca-app-pub-5971323065106042/4026304756";

export const Ads = () => {
  const bannerRef = useRef<BannerAd>(null);

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
  useForeground(() => {
    Platform.OS === "ios" && bannerRef.current?.load();
  });

  return (
    <View style={styles.container}>
      <BannerAd
        ref={bannerRef}
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
};

export default Ads;
const styles = StyleSheet.create({
  // container: {
  //   height: height / 3,
  // },
  container: {
    // Remove the fixed height
    width: "100%",
    alignItems: "center",
    maxHeight: ADS_HEIGHT,
  },
});

// import React, { useState, useRef } from 'react';
// import { Platform } from 'react-native';
// import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';

// const adUnitId = __DEV__ ? 'ca-app-pub-5971323065106042/5579059579' : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

// export const Ads= () =>{
//   const bannerRef = useRef<BannerAd>(null);

//   // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
//   // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
//   useForeground(() => {
//     Platform.OS === 'ios' && bannerRef.current?.load();
//   })

//   return (
//     <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
//   );
// }

// export default Ads
