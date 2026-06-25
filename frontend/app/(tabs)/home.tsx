// frontend/app/(tabs)/home.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Animated,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { transactionService } from "../../services/transactionServices";
import { HomeHeader } from "../../components/features/home/HomeHeader";
import { SpendingCard } from "../../components/features/home/SpendingCard";
import { ProjectionCard } from "../../components/features/home/ProjectionCard";
import { LargestExpense } from "../../components/features/home/LargestExpense";

export default function Home() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await transactionService.getHomeSummary();
        setData(result);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        Alert.alert("Error", "Failed to load summary");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (!data) return null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F9F5" />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader name="User" onLogout={handleLogout} />

        <View style={styles.statsGrid}>
          <View style={styles.gridItem}>
            <SpendingCard
              type="today"
              amount={data.today.amount}
              subLabel="today"
              totalTransactions={data.today.transactionCount}
            />
          </View>
          <View style={styles.gridItem}>
            <SpendingCard
              type="weekly"
              amount={parseFloat(data.week.averagePerDay)}
              subLabel="daily avg"
              weeklyTotal={data.week.amount}
            />
          </View>
        </View>

        <SpendingCard
          type="monthly"
          amount={data.month.amount}
          subLabel={`${data.month.monthProgress} of budget`}
          totalTransactions={data.month.transactionCount}
        />

        <ProjectionCard
          currentDailyAvg={data.projection?.currentDailyAverage || 0}
          daysRemaining={data.projection?.daysRemaining || 0}
          projectedMonthEnd={data.projection?.projectedMonthEnd || 0}
        />

        <LargestExpense
          name={data.largestExpense?.merchant || "No data yet"}
          amount={data.largestExpense?.amount || 0}
          date={data.largestExpense?.timestamp || new Date().toISOString()}
          type={data.largestExpense?.type || "debit"}
          referenceId={data.largestExpense?.reference_id || "N/A"}
        />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F9F5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 12 },
  statsGrid: { flexDirection: "row", gap: 12, marginBottom: 12 },
  gridItem: { flex: 1 },
});
