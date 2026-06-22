// frontend/components/features/home/ProjectionCard.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { TrendingUp } from "lucide-react-native";
import { BaseText } from "../../common/BaseText";

interface Props {
  currentDailyAvg: number;
  daysRemaining: number;
  projectedMonthEnd: number;
}

export const ProjectionCard = ({
  currentDailyAvg,
  daysRemaining,
  projectedMonthEnd,
}: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <TrendingUp size={15} color="#66BB6A" />
        <BaseText style={styles.title}>PROJECTION</BaseText>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <BaseText style={styles.rowLabel}>Current Daily Avg</BaseText>
        <BaseText style={styles.rowValue}>
          Nu {currentDailyAvg.toFixed(2)}
        </BaseText>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <BaseText style={styles.rowLabel}>Days Remaining</BaseText>
        <BaseText style={styles.rowValue}>{daysRemaining}</BaseText>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <BaseText style={styles.rowLabel}>Projected Month End</BaseText>
        <BaseText style={styles.rowValueGreen}>
          Nu {projectedMonthEnd.toFixed(2)}
        </BaseText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  title: {
    fontSize: 11,
    color: "#66BB6A",
    letterSpacing: 1.5,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rowLabel: {
    fontSize: 13,
    color: "#888",
  },
  rowValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  rowValueGreen: {
    fontSize: 16,
    color: "#66BB6A",
    fontWeight: "500",
    letterSpacing: -0.3,
  },
});