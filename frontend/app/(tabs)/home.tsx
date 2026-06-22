// frontend/app/(tabs)/home.tsx
import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { HomeHeader } from "../../components/features/home/HomeHeader";
import { SpendingCard } from "../../components/features/home/SpendingCard";
import { ProjectionCard } from "../../components/features/home/ProjectionCard";
import { LargestExpense } from "../../components/features/home/LargestExpense";

// Dummy data — replace with real API data later
const DUMMY = {
  name: "Pradeep Kumar",
  todaySpending: 0,
  todayTransactions: 0,
  weeklyAvg: 0.0,
  monthlyTotal: 2300,
  monthlyBudget: 3650,
  projection: {
    currentDailyAvg: 121.05,
    daysRemaining: 11,
    projectedMonthEnd: 3631.58,
  },
  largestExpense: {
    name: "Electricity Bill",
    amount: 1200,
    date: "2026-06-03",
  },
};

export default function Home() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const budgetPercent = Math.round(
    (DUMMY.monthlyTotal / DUMMY.monthlyBudget) * 100
  );

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/(auth)/login");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader name={DUMMY.name} onLogout={handleLogout} />

        <SpendingCard
          type="today"
          amount={DUMMY.todaySpending}
          subLabel={`${DUMMY.todayTransactions} transactions`}
        />

        <SpendingCard
          type="weekly"
          amount={DUMMY.weeklyAvg}
          subLabel="per day"
        />

        <SpendingCard
          type="monthly"
          amount={DUMMY.monthlyTotal}
          subLabel={`${budgetPercent}% of budget`}
          budgetPercent={budgetPercent}
        />

        <ProjectionCard
          currentDailyAvg={DUMMY.projection.currentDailyAvg}
          daysRemaining={DUMMY.projection.daysRemaining}
          projectedMonthEnd={DUMMY.projection.projectedMonthEnd}
        />

        <LargestExpense
          name={DUMMY.largestExpense.name}
          amount={DUMMY.largestExpense.amount}
          date={DUMMY.largestExpense.date}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EEF7EE",
  },
  scroll: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});