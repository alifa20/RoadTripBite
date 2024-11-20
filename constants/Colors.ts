/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    // icon: '#687076',
    icon: "#333",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    // radar: `rgba(84, 56, 54, 0.2)`
    radar: "#543836",
    borderNotice: "#543836", // Retain green for light mode
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    // icon: '#9BA1A6',
    icon: "#fff",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    radar: "#FFF8E7",
    borderNotice: "#543836",  
  },
};
