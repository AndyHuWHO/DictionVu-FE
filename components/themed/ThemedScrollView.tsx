// components/themed/ThemedScrollView.tsx
import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedScrollView(props: ThemedScrollViewProps) {
  const { style, contentContainerStyle, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return (
    <ScrollView
      style={[{ backgroundColor }, style]}
      contentContainerStyle={contentContainerStyle}
      {...otherProps}
    />
  );
}

