import { Colors } from "@/constants/Colors";
import { useThemeContext } from "@/context/ThemeContext";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { colorScheme } = useThemeContext();
  const colorFromProps = props[colorScheme];
  return colorFromProps ?? Colors[colorScheme][colorName];
}