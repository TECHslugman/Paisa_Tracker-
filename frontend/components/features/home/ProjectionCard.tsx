// frontend/components/features/home/ProjectionCard.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { TrendingUp, Calendar, Target, Wallet } from "lucide-react-native";
import { BaseText } from "../../common/BaseText";

interface Props {
  currentDailyAvg: number | string;
  daysRemaining: number | string;
  projectedMonthEnd: number | string;
}

export const ProjectionCard = ({
  currentDailyAvg,
  daysRemaining,
  projectedMonthEnd,
}: Props) => {
  // Defensive programming: Convert to number and default to 0 to prevent toFixed crashes
  const dailyAvg = Number(currentDailyAvg) || 0;
  const projected = Number(projectedMonthEnd) || 0;
  const daysLeft = Number(daysRemaining) || 0;

  const isOverBudget = projected > 3650;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <TrendingUp size={18} color="#2E7D32" />
          <BaseText style={styles.title}>Month End Projection</BaseText>
        </View>
        <View style={[
          styles.statusBadge,
          isOverBudget ? styles.statusBadgeWarning : styles.statusBadgeSuccess
        ]}>
          <BaseText style={styles.statusText}>
            {isOverBudget ? 'At Risk' : 'On Track'}
          </BaseText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Wallet size={16} color="#2E7D32" />
          <BaseText style={styles.statLabel}>Daily Avg</BaseText>
          <BaseText style={styles.statValue}>
            Nu {dailyAvg.toFixed(2)}
          </BaseText>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Calendar size={16} color="#2E7D32" />
          <BaseText style={styles.statLabel}>Days Left</BaseText>
          <BaseText style={styles.statValue}>{daysLeft}</BaseText>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Target size={16} color="#2E7D32" />
          <BaseText style={styles.statLabel}>Projected</BaseText>
          <BaseText style={[
            styles.statValue,
            isOverBudget ? styles.statValueWarning : styles.statValueSuccess
          ]}>
            Nu {projected.toFixed(2)}
          </BaseText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    color: "#1B5E20",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeSuccess: {
    backgroundColor: "#E8F5E9",
  },
  statusBadgeWarning: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 15,
    color: "#1B5E20",
    fontWeight: "600",
  },
  statValueSuccess: {
    color: "#2E7D32",
  },
  statValueWarning: {
    color: "#E53935",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#F0F0F0",
  },
});