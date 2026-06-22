// frontend/components/common/BaseText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

export const BaseText = (props: TextProps) => {
  return <Text {...props} style={[styles.text, props.style]} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Jaro_400Regular', // Global font applied here
  },
});