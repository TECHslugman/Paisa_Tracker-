// frontend/app/_layout.tsx
import { useEffect, useCallback, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const { isAuthenticated, loadAuth } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  const [mounted, setMounted] = useState(false);

  const initAuth = useCallback(async () => {
    await loadAuth();
    setMounted(true);
  }, [loadAuth]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!mounted) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)/home");
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, segments, router, mounted]);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}