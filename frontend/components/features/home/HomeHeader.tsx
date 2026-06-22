// frontend/components/features/home/HomeHeader.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity} from "react-native";
import { Bell, LogOut } from "lucide-react-native";
import { BaseText } from "../../common/BaseText";

interface Props {
  name?: string;
  onLogout?: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const HomeHeader = ({ name = "there", onLogout }: Props) => {
  const firstName = name.split(" ")[0];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
          <View style={styles.avatarRing}>
            <BaseText style={styles.avatarLetter}>
              {firstName.charAt(0).toUpperCase()}
            </BaseText>
          </View>
          <BaseText style={styles.appName}>Paisa Tracker</BaseText>
        </View>
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.bellBtn}>
            <Bell size={20} color="#2E7D32" />
          </TouchableOpacity>
          {onLogout && (
            <TouchableOpacity 
              style={styles.logoutBtn} 
              onPress={onLogout}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <LogOut size={20} color="#2E7D32" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <BaseText style={styles.greeting}>
        {getGreeting()}, {firstName}
      </BaseText>
      <BaseText style={styles.sub}>
        Here is your financial overview for today.
      </BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#C8E6C9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 16,
    color: "#1B5E20",
    fontWeight: "600",
  },
  appName: {
    fontSize: 17,
    color: "#1B5E20",
    fontWeight: "500",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#C8E6C9",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#C8E6C9",
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 22,
    color: "#1B5E20",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 13,
    color: "#81C784",
  },
});