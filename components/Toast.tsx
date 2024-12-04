import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  duration?: number;
  actions?: {
    text: string;
    onPress: () => void;
  }[];
}

export const Toast = ({
  visible,
  message,
  onHide,
  duration = 3000,
  actions,
}: ToastProps) => {
  const opacity = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withSpring(1);
      progress.value = withTiming(1, { duration });
      const timer = setTimeout(onHide, duration);
      return () => clearTimeout(timer);
    } else {
      opacity.value = withSpring(0);
      progress.value = 0;
    }
  }, [visible, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, animatedStyle]}>
      <Text style={styles.message}>{message}</Text>
      {actions && actions.length > 0 && (
        <View style={styles.actionContainer}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={action.onPress}
            >
              <Text style={styles.actionText}>{action.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Animated.View style={[styles.progressBar, progressStyle]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 8,
    padding: 16,
    zIndex: 1000,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    color: "#fff",
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    // marginTop: 8,
    marginLeft: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 3,
    backgroundColor: "#4CAF50",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});
