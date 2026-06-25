// frontend/components/features/home/SpendingCard.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, BarChart2, CalendarDays, ArrowUp, ArrowDown } from "lucide-react-native";
import { BaseText } from "../../common/BaseText";

interface SpendingCardProps {
  type: "today" | "weekly" | "monthly";
  amount: number;
  subLabel: string;
  budgetPercent?: number;
  weeklyTotal?: number;
  totalTransactions?: number;
}

const config = {
  today:   { label: "Today",          icon: (c: string) => <Calendar size={14} color={c} /> },
  weekly:  { label: "Weekly Average", icon: (c: string) => <BarChart2 size={14} color={c} /> },
  monthly: { label: "This Month",     icon: (c: string) => <CalendarDays size={14} color={c} /> },
};

const GREEN = "#2E7D32";
const RED   = "#C62828";
const TEXT  = "#1A1A1A";
const MUTED = "#757575";
const BORDER = "#E0E0E0";

export const SpendingCard = ({
  type,
  amount,
  subLabel,
  budgetPercent,
  weeklyTotal,
  totalTransactions,
}: SpendingCardProps) => {
  const { label, icon } = config[type];
  const isOverBudget = (budgetPercent ?? 0) > 80;
  const isGrid = type === "today" || type === "weekly";

  const formatAmount = (val: number) =>
    `Nu. ${val.toLocaleString("en-IN", { minimumFractionDigits: val % 1 === 0 ? 0 : 2 })}`;

  return (
    <View style={[styles.card, isGrid && styles.gridCard]}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.labelRow}>
          {icon(MUTED)}
          <BaseText style={styles.label}>{label}</BaseText>
        </View>
        {type === "monthly" && (
          <View style={[styles.trendBadge, isOverBudget ? styles.trendRed : styles.trendGreen]}>
            {isOverBudget
              ? <ArrowDown size={11} color={RED} />
              : <ArrowUp size={11} color={GREEN} />}
            <BaseText style={[styles.trendText, { color: isOverBudget ? RED : GREEN }]}>
              {isOverBudget ? "Over" : "Under"}
            </BaseText>
          </View>
        )}
      </View>

      {/* Amount */}
      <BaseText style={[styles.amount, isGrid && styles.amountGrid, isOverBudget && { color: RED }]}>
        {formatAmount(amount)}
      </BaseText>
      <BaseText style={styles.sub}>{subLabel}</BaseText>

      {/* Weekly total */}
      {type === "weekly" && weeklyTotal !== undefined && (
        <View style={styles.extraRow}>
          <BaseText style={styles.extraLabel}>Weekly total</BaseText>
          <BaseText style={styles.extraValue}>{formatAmount(weeklyTotal)}</BaseText>
        </View>
      )}

      {/* Transaction count */}
      {totalTransactions !== undefined && type !== "weekly" && (
        <View style={styles.extraRow}>
          <BaseText style={styles.extraLabel}>Transactions</BaseText>
          <BaseText style={styles.extraValue}>{totalTransactions}</BaseText>
        </View>
      )}

      {/* Progress bar — monthly only */}
      {type === "monthly" && budgetPercent !== undefined && (
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(budgetPercent, 100)}%` as any,
                  backgroundColor: isOverBudget ? RED : GREEN,
                },
              ]}
            />
          </View>
          <BaseText style={styles.progressText}>{budgetPercent}% used</BaseText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 12,
  },
  gridCard: {
    flex: 1,
    marginBottom: 0,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "500",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  trendGreen: { backgroundColor: "#F1F8F1" },
  trendRed:   { backgroundColor: "#FFEBEE" },
  trendText:  { fontSize: 11, fontWeight: "600" },

  amount: {
    fontSize: 26,
    fontWeight: "700",
    color: TEXT,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  amountGrid: { fontSize: 20 },
  sub: {
    fontSize: 12,
    color: MUTED,
  },

  extraRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  extraLabel: { fontSize: 11, color: MUTED },
  extraValue: { fontSize: 12, color: TEXT, fontWeight: "600" },

  progressWrap: { marginTop: 12 },
  progressBg: {
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressFill: { height: "100%", borderRadius: 2 },
  progressText:  { fontSize: 11, color: MUTED, textAlign: "right" },
});