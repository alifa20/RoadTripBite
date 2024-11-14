import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, StyleSheet, Switch, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setPreferredMap,
  toggleDarkMode,
  toggleNotifications,
} from "../store/settingsSlice";
import { MAP_TYPES, MapType } from "../store/types";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Settings() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const color = useThemeColor({}, "icon");

  const { darkMode, notifications, preferredMap } = useAppSelector(
    (state) => state.settings
  );

  const [showMapPicker, setShowMapPicker] = useState(false);

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
            // color="#333"
            color={color}
          />
        </TouchableOpacity>
        <ThemedText type="title">Settings</ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.settingItem}>
          <ThemedText>Dark Mode</ThemedText>
          <Switch
            value={darkMode}
            onValueChange={() => {
              dispatch(toggleDarkMode());
            }}
          />
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
              <TouchableOpacity onPress={() => setShowMapPicker(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
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
});
