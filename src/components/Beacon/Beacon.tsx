import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import Animated, {Easing} from 'react-native-reanimated';
import {useMemoOne} from 'use-memo-one';

interface Props {
  onPress: () => void;
  play: boolean;
  width?: number;
  height?: number;
  color1?: string;
  color2?: string;
  children?: React.ReactNode;
}

const {
  Value,
  block,
  timing,
  cond,
  eq,
  set,
  interpolate,
  Extrapolate,
  Clock,
  and,
  clockRunning,
  stopClock,
  startClock,
  not,
  useCode,
} = Animated;

const runTiming = (clock: Animated.Clock, max = 2) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    frameTime: new Value(0),
    time: new Value(0),
  };
  const config = {
    toValue: new Value(1),
    duration: 1000,
    easing: Easing.linear,
  };

  return block([
    timing(clock, state, config),
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(state.position, 0),
    ]),

    state.position,
  ]);
};

const Beacon = ({
  onPress,
  play,
  width = 24,
  height = 24,
  color1 = 'orange',
  color2 = 'red',
  children,
}: Props) => {
  const {progress, clock, isPlaying} = useMemoOne(
    () => ({
      progress: new Value(0),
      clock: new Clock(),
      isPlaying: new Value(1) as Animated.Value<number>,
    }),
    [],
  );

  isPlaying.setValue(play ? 1 : 0);

  useCode(
    () =>
      block([
        cond(and(eq(isPlaying, 0), clockRunning(clock)), stopClock(clock)),
        cond(
          and(eq(isPlaying, 1), not(clockRunning(clock))),
          startClock(clock),
        ),
        set(progress, runTiming(clock)),
      ]),
    [],
  );

  const scale = interpolate(progress, {
    inputRange: [0, 0.75, 1],
    outputRange: [1, 30.3, 30.4],
    extrapolate: Extrapolate.CLAMP,
  });

  const scale2 = interpolate(progress, {
    inputRange: [0, 0.3, 0.75, 1],
    outputRange: [1, 1, 1.3, 1.4],
    extrapolate: Extrapolate.CLAMP,
  });

  const opacity = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <Animated.View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Animated.View
            style={{
              width,
              height,
              backgroundColor: color1,
              borderRadius: 50,
              opacity,
              transform: [{scale}],
            }}
          />
        </View>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Animated.View
            style={{
              width,
              height,
              backgroundColor: color2,
              borderRadius: 50,
              opacity,
              transform: [{scale: scale2}],
            }}
          />
        </View>
        <TouchableWithoutFeedback
          onPress={onPress}
          style={{
            width,
            height,
            backgroundColor: color2,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {children}
        </TouchableWithoutFeedback>
      </View>
    </Animated.View>
  );
};

export default Beacon;
