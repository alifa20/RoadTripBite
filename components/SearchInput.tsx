import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Search...",
}: SearchInputProps) {
  const colorScheme = useColorScheme()  
  const iconColor = Colors[colorScheme].icon;

  const handleClear = () => {
    onChangeText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { color: Colors[colorScheme].text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors[colorScheme].icon}
      />
      <TouchableOpacity
        onPress={handleClear}
        style={styles.iconContainer}
        disabled={!value}
      >
        <Ionicons
          name={value ? "close-circle" : "search"}
          size={20}
          color={iconColor}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  iconContainer: {
    padding: 4,
  },
});
