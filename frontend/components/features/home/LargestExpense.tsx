// frontend/components/features/home/LargestExpense.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Clock, ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import { BaseText } from "../../common/BaseText";

interface Props {
  name: string;
  amount: number;
  date: string;
  type: "debit" | "credit";
  referenceId: string;
}

const GREEN  = "#2E7D32";
const RED    = "#C62828";
const TEXT   = "#1A1A1A";
const MUTED  = "#757575";
const BORDER = "#E0E0E0";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export const LargestExpense = ({ name, amount, date, type, referenceId }: Props) => {
  const isDebit = type === "debit";
  const color   = isDebit ? RED : GREEN;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <BaseText style={styles.sectionLabel}>Largest Expense</BaseText>
        <BaseText style={[styles.amount, { color }]}>
          {isDebit ? "-" : "+"} Nu. {amount.toLocaleString("en-IN")}
        </BaseText>
      </View>

      {/* Name */}
      <BaseText style={styles.name}>{name}</BaseText>

      {/* Meta row */}
      <View style={styles.metaRow}>
        <View style={[styles.typePill, { backgroundColor: isDebit ? "#FFEBEE" : "#F1F8F1" }]}>
          {isDebit
            ? <ArrowDownLeft size={11} color={RED} />
            : <ArrowUpRight size={11} color={GREEN} />}
          <BaseText style={[styles.typeText, { color }]}>
            {isDebit ? "Debit" : "Credit"}
          </BaseText>
        </View>
        <BaseText style={styles.ref}>Ref: {referenceId}</BaseText>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dateRow}>
          <Clock size={11} color={MUTED} />
          <BaseText style={styles.date}>{formatDate(date)}</BaseText>
        </View>
        <View style={styles.categoryPill}>
          <BaseText style={styles.categoryText}>Bills</BaseText>
        </View>
      </View>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "500",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ref: {
    fontSize: 11,
    color: MUTED,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 11,
    color: MUTED,
  },
  categoryPill: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "500",
  },
});