import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export function ThemedTextInput(props: TextInputProps) {
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");
  const backgroundColor = useThemeColor({}, "background");
  const placeholderColor = useThemeColor({}, "placeholder");
  

  return (
    <TextInput
      {...props}
      style={[
        props.style,
        { color: textColor, borderColor: borderColor},
      ]}
      placeholderTextColor={placeholderColor}
    />
  );
}