// frontend/components/features/home/LargestExpense.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Clock, AlertCircle, ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import { BaseText } from "../../common/BaseText";

interface Props {
  name: string;
  amount: number;
  date: string;
  type: "debit" | "credit";
  referenceId: string;
}

export const LargestExpense = ({
  name,
  amount,
  date,
  type,
  referenceId,
}: Props) => {
  const isDebit = type === "debit";

  return (
    <View style={styles.card}>

      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <AlertCircle size={16} color="#E53935" />
          <BaseText style={styles.label}>LARGEST EXPENSE</BaseText>
        </View>
        <View style={[styles.amountBadge, !isDebit && styles.amountBadgeCredit]}>
          <BaseText style={[styles.amountBadgeText, !isDebit && styles.amountBadgeTextCredit]}>
            Nu {amount.toLocaleString()}
          </BaseText>
        </View>
      </View>

      {/* Name */}
      <BaseText style={styles.name}>{name}</BaseText>

      {/* Type + Reference row */}
      <View style={styles.metaRow}>
        <View style={[styles.typeBadge, isDebit ? styles.typeBadgeDebit : styles.typeBadgeCredit]}>
          {isDebit
            ? <ArrowDownLeft size={12} color="#E53935" />
            : <ArrowUpRight size={12} color="#2E7D32" />}
          <BaseText style={[styles.typeText, isDebit ? styles.typeTextDebit : styles.typeTextCredit]}>
            {isDebit ? "Debit" : "Credit"}
          </BaseText>
        </View>

        <View style={styles.refRow}>
          <BaseText style={styles.refLabel}>Ref: </BaseText>
          <BaseText style={styles.refValue}>{referenceId}</BaseText>
        </View>
      </View>

      {/* Footer row */}
      <View style={styles.footerRow}>
        <View style={styles.dateRow}>
          <Clock size={12} color="#999" />
          <BaseText style={styles.date}>{date}</BaseText>
        </View>
        <View style={styles.categoryBadge}>
          <BaseText style={styles.categoryText}>Bills</BaseText>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E8F5E9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  amountBadge: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  amountBadgeCredit: {
    backgroundColor: "#E8F5E9",
  },
  amountBadgeText: {
    fontSize: 13,
    color: "#E53935",
    fontWeight: "700",
  },
  amountBadgeTextCredit: {
    color: "#2E7D32",
  },

  // Name
  name: {
    fontSize: 17,
    color: "#1B5E20",
    fontWeight: "600",
    marginBottom: 10,
  },

  // Type + reference
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeBadgeDebit: {
    backgroundColor: "#FFEBEE",
  },
  typeBadgeCredit: {
    backgroundColor: "#E8F5E9",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  typeTextDebit: {
    color: "#E53935",
  },
  typeTextCredit: {
    color: "#2E7D32",
  },
  refRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  refLabel: {
    fontSize: 11,
    color: "#999",
  },
  refValue: {
    fontSize: 11,
    color: "#555",
    fontWeight: "500",
  },

  // Footer
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  categoryBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
});