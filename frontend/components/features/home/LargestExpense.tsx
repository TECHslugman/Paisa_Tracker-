// frontend/components/features/home/LargestExpense.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";
import { BaseText } from "../../common/BaseText";

interface Props {
  name: string;
  amount: number;
  date: string;
}

export const LargestExpense = ({ name, amount, date }: Props) => {
  return (
    <View style={styles.card}>
      <BaseText style={styles.label}>LARGEST EXPENSE</BaseText>
      <BaseText style={styles.name}>{name}</BaseText>
      <BaseText style={styles.amount}>
        BTN {amount.toLocaleString()}
      </BaseText>
      <View style={styles.dateRow}>
        <Clock size={12} color="#A5D6A7" />
        <BaseText style={styles.date}>{date}</BaseText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#C8E6C9",
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    color: "#A5D6A7",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    color: "#1B5E20",
    marginBottom: 4,
    fontWeight: "500",
  },
  amount: {
    fontSize: 22,
    color: "#E53935",
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  date: {
    fontSize: 12,
    color: "#A5D6A7",
  },
});