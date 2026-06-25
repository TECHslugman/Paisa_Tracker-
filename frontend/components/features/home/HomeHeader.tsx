// frontend/components/features/home/HomeHeader.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Bell, LogOut } from "lucide-react-native";
import { BaseText } from "../../common/BaseText";

interface Props {
  name?: string;
  onLogout?: () => void;
  isSticky?: boolean;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const GREEN      = "#2E7D32";
const TEXT       = "#1A1A1A";
const MUTED      = "#757575";
const BORDER     = "#E0E0E0";

export const HomeHeader = ({ name = "there", onLogout, isSticky = false }: Props) => {
  const firstName = name.split(" ")[0];
  const initial   = firstName.charAt(0).toUpperCase();

  return (
    <View style={[styles.container, isSticky && styles.stickyContainer]}>
      {/* Top row */}
      <View style={styles.topRow}>
        {/* Left — avatar + app name */}
        <View style={styles.logoRow}>
          <View style={styles.avatar}>
            <BaseText style={styles.avatarLetter}>{initial}</BaseText>
          </View>
          <View>
            <BaseText style={styles.appName}>Paisa Tracker</BaseText>
            <BaseText style={styles.appTagline}>Personal Finance</BaseText>
          </View>
        </View>

        {/* Right — actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Bell size={18} color={GREEN} strokeWidth={1.8} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          {onLogout && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onLogout}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <LogOut size={18} color={MUTED} strokeWidth={1.8} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Greeting */}
      <View style={styles.greetingRow}>
        <BaseText style={styles.greeting}>
          {getGreeting()}, {firstName}
        </BaseText>
        <View style={styles.datePill}>
          <BaseText style={styles.dateText}>
            {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </BaseText>
        </View>
      </View>
      <BaseText style={styles.sub}>Your financial snapshot for today</BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  stickyContainer: {
    marginBottom: 0,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  appName: {
    fontSize: 15,
    color: TEXT,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  appTagline: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "400",
    marginTop: 1,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E53935",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 14,
  },

  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  greeting: {
    fontSize: 20,
    color: TEXT,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  datePill: {
    backgroundColor: "#F1F8F1",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 12,
    color: GREEN,
    fontWeight: "600",
  },
  sub: {
    fontSize: 13,
    color: MUTED,
    fontWeight: "400",
  },
});