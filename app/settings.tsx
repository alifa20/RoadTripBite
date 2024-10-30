import { View, StyleSheet, Switch } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { toggleDarkMode, toggleNotifications } from "./store/settingsSlice";

export default function Settings() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { darkMode, notifications } = useAppSelector((state) => state.settings);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
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
      </View>
    </SafeAreaView>
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
    flex: 1,
    padding: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
