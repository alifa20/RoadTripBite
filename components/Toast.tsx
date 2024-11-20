import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withSequence,
} from 'react-native-reanimated';

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  duration?: number;
}

export function Toast({ 
  visible, 
  message, 
  onHide, 
  duration = 5000 
}: ToastProps) {
  const progressWidth = useSharedValue(0);
  const toastOpacity = useSharedValue(0);
  const toastTranslateY = useSharedValue(-100);

  useEffect(() => {
    if (visible) {
      showToast();
    }
  }, [visible]);

  const showToast = () => {
    progressWidth.value = 0;
    toastOpacity.value = 0;
    toastTranslateY.value = -100;

    toastTranslateY.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
    toastOpacity.value = withSpring(1);

    progressWidth.value = withSequence(
      withTiming(100, {
        duration,
        easing: Easing.linear,
      }),
      withTiming(100, { duration: 0 }, (finished) => {
        if (finished) {
          runOnJS(onHide)();
        }
      })
    );
  };

  const handleHideToast = () => {
    toastOpacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    toastTranslateY.value = withTiming(-100, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    }, () => {
      runOnJS(onHide)();
    });
  };

  const toastAnimatedStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
    transform: [{ translateY: toastTranslateY.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, toastAnimatedStyle]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastText}>{message}</Text>
        <TouchableOpacity onPress={handleHideToast} style={styles.toastClose}>
          <Text style={styles.toastCloseText}>✕</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 8,
    zIndex: 1000,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  toastText: {
    color: 'white',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  toastClose: {
    padding: 4,
  },
  toastCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
