import React from 'react';
import {View, Text} from 'react-native';

import {
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
} from '@react-native-firebase/admob';

InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

RewardedAd.createForAdRequest(TestIds.REWARDED);

const Ad = () => {
  return <BannerAd unitId={TestIds.BANNER} size="FULL_BANNER" />;
};

export default Ad;
