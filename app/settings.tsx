import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, StyleSheet, Switch, Text, View, Pressable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setMinRating,
  setMinReviewCount,
  setPreferredMap,
  toggleNotifications,
  setTimeWindow,
  setThemeMode,
} from "../store/settingsSlice";
import {
  MAP_TYPES,
  MapType,
  MIN_RATINGS,
  MIN_REVIEW_COUNTS,
  TIME_LABELS,
  TIME_OPTIONS,
} from "../store/types";
import { CloseButton } from "@/components/CloseButton";

export default function Settings() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const color = useThemeColor({}, "icon");

  const {
    notifications,
    preferredMap,
    minRating,
    minReviewCount,
    timeWindow,
    themeMode,
  } = useAppSelector((state) => state.settings);

  const [showMapPicker, setShowMapPicker] = useState(false);
  const [showRatingPicker, setShowRatingPicker] = useState(false);
  const [showReviewCountPicker, setShowReviewCountPicker] = useState(false);
  const [showTimeWindowPicker, setShowTimeWindowPicker] = useState(false);

  return (
    <ThemedSafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={color}
          />
        </TouchableOpacity>
        <ThemedText type="title">Settings</ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.settingItem}>
          <ThemedText>Theme</ThemedText>
          <View style={styles.themeSelector}>
            <Pressable
              style={[
                styles.themeOption,
                themeMode === 'light' && styles.themeOptionSelected,
              ]}
              onPress={() => dispatch(setThemeMode('light'))}
            >
              <Ionicons name="sunny" size={20} color={themeMode === 'light' ? '#FFF8F0' : '#543836'} />
            </Pressable>
            <Pressable
              style={[
                styles.themeOption,
                themeMode === 'system' && styles.themeOptionSelected,
              ]}
              onPress={() => dispatch(setThemeMode('system'))}
            >
              <Ionicons name="phone-portrait" size={20} color={themeMode === 'system' ? '#FFF8F0' : '#543836'} />
            </Pressable>
            <Pressable
              style={[
                styles.themeOption,
                themeMode === 'dark' && styles.themeOptionSelected,
              ]}
              onPress={() => dispatch(setThemeMode('dark'))}
            >
              <Ionicons name="moon" size={20} color={themeMode === 'dark' ? '#FFF8F0' : '#543836'} />
            </Pressable>
          </View>
        </View>

        <View style={styles.settingItem}>
          <ThemedText>Notifications</ThemedText>
          <Switch
            value={notifications}
            onValueChange={() => {
              dispatch(toggleNotifications());
            }}
          />
        </View>

        <View style={styles.settingItem}>
          <ThemedText>Default Map</ThemedText>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowMapPicker(true)}
          >
            <Text>{MAP_TYPES[preferredMap]}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <ThemedText>Minimum Rating</ThemedText>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowRatingPicker(true)}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text>{minRating === 1 ? "Any" : minRating}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <ThemedText>Reviews</ThemedText>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowReviewCountPicker(true)}
          >
            <Text>{minReviewCount === 1 ? "Any" : `+${minReviewCount}`}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <ThemedText>Time Window</ThemedText>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowTimeWindowPicker(true)}
          >
            <Text>{TIME_LABELS[timeWindow]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showMapPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMapPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Map Type</Text>
              <CloseButton onPress={() => setShowMapPicker(false)} />
            </View>
            {Object.keys(MAP_TYPES).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mapOption,
                  preferredMap === type && styles.mapOptionSelected,
                ]}
                onPress={() => {
                  dispatch(setPreferredMap(type as MapType));
                  setShowMapPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.mapOptionText,
                    preferredMap === type && styles.mapOptionTextSelected,
                  ]}
                >
                  {MAP_TYPES[type as MapType]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRatingPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRatingPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Minimum Rating</Text>
              <CloseButton onPress={() => setShowRatingPicker(false)} />
            </View>
            {Object.entries(MIN_RATINGS).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.mapOption,
                  minRating === value && styles.mapOptionSelected,
                ]}
                onPress={() => {
                  dispatch(setMinRating(value));
                  setShowRatingPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.mapOptionText,
                    minRating === value && styles.mapOptionTextSelected,
                  ]}
                >
                  {value === 1 ? "Any" : value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showReviewCountPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReviewCountPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Minimum Reviews</Text>
              <CloseButton onPress={() => setShowReviewCountPicker(false)} />
            </View>
            {Object.entries(MIN_REVIEW_COUNTS).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.mapOption,
                  minReviewCount === value && styles.mapOptionSelected,
                ]}
                onPress={() => {
                  dispatch(setMinReviewCount(value));
                  setShowReviewCountPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.mapOptionText,
                    minReviewCount === value && styles.mapOptionTextSelected,
                  ]}
                >
                  {value === 1 ? "Any" : `+${value}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTimeWindowPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimeWindowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time Window</Text>
              <CloseButton onPress={() => setShowTimeWindowPicker(false)} />
            </View>
            {Object.values(TIME_OPTIONS).map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.mapOption,
                  timeWindow === value && styles.mapOptionSelected,
                ]}
                onPress={() => {
                  dispatch(setTimeWindow(value));
                  setShowTimeWindowPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.mapOptionText,
                    timeWindow === value && styles.mapOptionTextSelected,
                  ]}
                >
                  {TIME_LABELS[value]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },

  backButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  pickerButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF8F0",
    borderRadius: 16,
    padding: 16,
    width: "80%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#543836",
  },
  mapOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  mapOptionSelected: {
    backgroundColor: "#543836",
  },
  mapOptionText: {
    fontSize: 16,
    color: "#543836",
  },
  mapOptionTextSelected: {
    color: "#FFF8F0",
    fontWeight: "600",
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f0f0f0',
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  themeOption: {
    padding: 8,
    borderRadius: 6,
  },
  themeOptionSelected: {
    backgroundColor: '#543836',
  },
});
