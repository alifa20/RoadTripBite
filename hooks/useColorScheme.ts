import { useAppSelector } from "@/store/hooks";
import { useColorScheme as useColorSchemeRN } from "react-native";

export const useColorScheme = () => {
  const colorScheme = useColorSchemeRN() ?? "light";
  const themeMode = useAppSelector((state) => state.settings.themeMode);

  return themeMode === "system" ? colorScheme : themeMode;
};
