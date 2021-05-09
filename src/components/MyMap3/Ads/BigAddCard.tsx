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

interface Props {
  size: string;
}
const BigAddCard = ({size}: Props) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <BannerAd
        unitId={TestIds.BANNER}
        // size="LARGE_BANNER"
        size={size}
      />
    </View>
  );
};

export default BigAddCard;
