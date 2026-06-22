// frontend/components/common/CustomInput.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export const CustomInput = ({ label, ...props }: { label: string; [key: string]: any }) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor="#A0A0A0" {...props} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#333' },
  input: { 
    height: 60, borderWidth: 1, borderColor: '#7ED957', 
    borderRadius: 12, paddingHorizontal: 15, backgroundColor: '#FFF' 
  }
});