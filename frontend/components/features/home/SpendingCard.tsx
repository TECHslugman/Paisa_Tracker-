// frontend/components/features/home/SpendingCard.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, BarChart2, CalendarDays } from "lucide-react-native";
import { BaseText } from "../../common/BaseText";

interface SpendingCardProps {
  type: "today" | "weekly" | "monthly";
  amount: number;
  subLabel: string;
  budgetPercent?: number; // only used for monthly
}

const config = {
  today: {
    label: "Today's Spending",
    icon: (c: string) => <Calendar size={16} color={c} />,
  },
  weekly: {
    label: "Weekly Average",
    icon: (c: string) => <BarChart2 size={16} color={c} />,
  },
  monthly: {
    label: "Monthly Total",
    icon: (c: string) => <CalendarDays size={16} color={c} />,
  },
};

export const SpendingCard = ({
  type,
  amount,
  subLabel,
  budgetPercent,
}: SpendingCardProps) => {
  const { label, icon } = config[type];
  const isOverBudget = (budgetPercent ?? 0) > 80;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <BaseText style={styles.label}>{label}</BaseText>
        {icon("#A5D6A7")}
      </View>

      <BaseText style={[styles.amount, isOverBudget && styles.amountRed]}>
        Nu {amount.toLocaleString("en-IN", { minimumFractionDigits: amount % 1 === 0 ? 0 : 2 })}
      </BaseText>

      <BaseText style={styles.sub}>{subLabel}</BaseText>

      {type === "monthly" && budgetPercent !== undefined && (
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(budgetPercent, 100)}%` as any,
                backgroundColor: isOverBudget ? "#E53935" : "#66BB6A",
              },
            ]}
          />
        </View>
      )}
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: "#81C784",
    letterSpacing: 0.2,
  },
  amount: {
    fontSize: 26,
    color: "#1B5E20",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  amountRed: {
    color: "#E53935",
  },
  sub: {
    fontSize: 12,
    color: "#A5D6A7",
  },
  progressBg: {
    height: 4,
    backgroundColor: "#E8F5E9",
    borderRadius: 2,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});