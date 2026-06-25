// frontend/components/features/home/SpendingCard.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, BarChart2, CalendarDays, ArrowUp, ArrowDown } from "lucide-react-native";
import { BaseText } from "../../common/BaseText";
import { LinearGradient } from "expo-linear-gradient";

interface SpendingCardProps {
  type: "today" | "weekly" | "monthly";
  amount: number;
  subLabel: string;
  budgetPercent?: number;
  weeklyTotal?: number;       // new
  totalTransactions?: number; // new
}

const config = {
  today: {
    label: "Today's Spending",
    icon: (color: string) => <Calendar size={18} color={color} />,
    gradient: ["#E8F5E9", "#C8E6C9"],
  },
  weekly: {
    label: "Weekly Average",
    icon: (color: string) => <BarChart2 size={18} color={color} />,
    gradient: ["#E3F2FD", "#BBDEFB"],
  },
  monthly: {
    label: "Monthly Total",
    icon: (color: string) => <CalendarDays size={18} color={color} />,
    gradient: ["#FFF3E0", "#FFE0B2"],
  },
};

export const SpendingCard = ({
  type,
  amount,
  subLabel,
  budgetPercent,
  weeklyTotal,
  totalTransactions,
}: SpendingCardProps) => {
  const { label, icon, gradient } = config[type];
  const isOverBudget = (budgetPercent ?? 0) > 80;
  const isGrid = type === "today" || type === "weekly";

  const formatAmount = (val: number) =>
    `Nu ${val.toLocaleString("en-IN", {
      minimumFractionDigits: val % 1 === 0 ? 0 : 2,
    })}`;

  return (
    <View style={[styles.card, isGrid && styles.gridCard]}>
      <LinearGradient
        colors={gradient as any}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.content}>
        {/* Top row — label + icon */}
        <View style={styles.topRow}>
          <View style={styles.labelContainer}>
            {icon(isOverBudget ? "#E53935" : "#2E7D32")}
            <BaseText style={styles.label}>{label}</BaseText>
          </View>
          {type === "monthly" && (
            <View
              style={[
                styles.trendBadge,
                isOverBudget ? styles.trendBadgeDown : styles.trendBadgeUp,
              ]}
            >
              {isOverBudget ? (
                <ArrowDown size={12} color="#E53935" />
              ) : (
                <ArrowUp size={12} color="#2E7D32" />
              )}
              <BaseText
                style={[
                  styles.trendText,
                  isOverBudget ? styles.trendTextDown : styles.trendTextUp,
                ]}
              >
                {isOverBudget ? "Over" : "Under"}
              </BaseText>
            </View>
          )}
        </View>

        {/* Main amount */}
        <BaseText
          style={[
            styles.amount,
            isOverBudget && styles.amountRed,
            isGrid && styles.gridAmount,
          ]}
        >
          {formatAmount(amount)}
        </BaseText>

        {/* Sub label */}
        <BaseText style={styles.sub}>{subLabel}</BaseText>

        {/* Weekly total — only on weekly card */}
        {type === "weekly" && weeklyTotal !== undefined && (
          <View style={styles.extraRow}>
            <View style={styles.dividerLine} />
            <View style={styles.extraItem}>
              <BaseText style={styles.extraLabel}>Weekly total</BaseText>
              <BaseText style={styles.extraValue}>
                {formatAmount(weeklyTotal)}
              </BaseText>
            </View>
          </View>
        )}

        {/* Total transactions — on today and monthly */}
        {totalTransactions !== undefined && type !== "weekly" && (
          <View style={styles.extraRow}>
            <View style={styles.dividerLine} />
            <View style={styles.extraItem}>
              <BaseText style={styles.extraLabel}>Transactions</BaseText>
              <BaseText style={styles.extraValue}>{totalTransactions}</BaseText>
            </View>
          </View>
        )}

        {/* Progress bar — monthly only */}
        {type === "monthly" && budgetPercent !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(budgetPercent, 100)}%` as any,
                    backgroundColor: isOverBudget ? "#E53935" : "#2E7D32",
                  },
                ]}
              />
            </View>
            <BaseText style={styles.progressText}>{budgetPercent}% used</BaseText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  gridCard: {
    flex: 1,
    marginBottom: 0,
  },
  gradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  content: {
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendBadgeUp: { backgroundColor: "#E8F5E9" },
  trendBadgeDown: { backgroundColor: "#FFEBEE" },
  trendText: { fontSize: 10, fontWeight: "600" },
  trendTextUp: { color: "#2E7D32" },
  trendTextDown: { color: "#E53935" },
  amount: {
    fontSize: 28,
    color: "#1B5E20",
    letterSpacing: -0.5,
    marginBottom: 4,
    fontWeight: "700",
  },
  gridAmount: { fontSize: 22 },
  amountRed: { color: "#E53935" },
  sub: {
    fontSize: 12,
    color: "#888",
  },

  // Extra info row (weekly total / transactions)
  extraRow: {
    marginTop: 10,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginBottom: 8,
  },
  extraItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  extraLabel: {
    fontSize: 11,
    color: "#999",
  },
  extraValue: {
    fontSize: 12,
    color: "#444",
    fontWeight: "500",
  },

  // Progress
  progressContainer: { marginTop: 12 },
  progressBg: {
    height: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: "#888",
    textAlign: "right",
  },
});