import React from 'react';
import {View, Text} from 'react-native';

import {
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
} from '@react-native-firebase/admob';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

RewardedAd.createForAdRequest(TestIds.REWARDED);

interface Props {
  size: string;
}
const BigAddCard = ({size}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: insets.bottom,
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
