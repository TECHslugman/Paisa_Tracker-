// frontend/components/features/home/HomeHeader.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Bell, LogOut } from "lucide-react-native";
import { BaseText } from "../../common/BaseText";
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  name?: string;
  onLogout?: () => void;
  isSticky?: boolean;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export const HomeHeader = ({ name = "there", onLogout, isSticky = false }: Props) => {
  const firstName = name.split(" ")[0];

  return (
    <View style={[styles.container, isSticky && styles.stickyContainer]}>
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
          <LinearGradient
            colors={['#2E7D32', '#43A047']}
            style={styles.avatarRing}
          >
            <BaseText style={styles.avatarLetter}>
              {firstName.charAt(0).toUpperCase()}
            </BaseText>
          </LinearGradient>
          <BaseText style={styles.appName}>Paisa Tracker</BaseText>
        </View>
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Bell size={20} color="#2E7D32" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          {onLogout && (
            <TouchableOpacity 
              style={styles.iconBtn} 
              onPress={onLogout}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <LogOut size={20} color="#2E7D32" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.greetingContainer}>
        <BaseText style={styles.greeting}>
          {getGreeting()}, {firstName}
        </BaseText>
        <BaseText style={styles.sub}>
          Here is your financial snapshot for today
        </BaseText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  stickyContainer: {
    marginBottom: 0,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarLetter: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  appName: {
    fontSize: 18,
    color: "#1B5E20",
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingContainer: {
    marginTop: 4,
  },
  greeting: {
    fontSize: 22,
    color: "#1B5E20",
    marginBottom: 4,
    letterSpacing: -0.3,
    fontWeight: "600",
  },
  sub: {
    fontSize: 13,
    color: "#81C784",
    fontWeight: "400",
  },
});