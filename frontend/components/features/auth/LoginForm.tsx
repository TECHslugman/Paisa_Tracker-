// frontend/components/features/LoginForm.tsx
import React, { useState } from "react";
import { saveUserId } from '../../../utils/sharedPrefs';
import { useRouter } from "expo-router";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFonts, Jaro_400Regular } from "@expo-google-fonts/jaro";
import { BaseText } from "../../common/BaseText";
import { Eye, EyeOff, Lock, Mail, CheckCircle } from "lucide-react-native";
import { authService } from "../../../services/authService";
import { useAuthStore } from "../../../store/authStore";

export const LoginForm = () => {
  const router = useRouter();
  const { saveAuth } = useAuthStore();
  const [fontsLoaded] = useFonts({ Jaro_400Regular });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.login(formData);
      await saveAuth(response.token);
      saveUserId(response.userId);
      setSuccess(true);
      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 1500);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  if (success) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIconRing}>
          <CheckCircle size={48} color="#2E7D32" />
        </View>
        <BaseText style={styles.successTitle}>Welcome back!</BaseText>
        <BaseText style={styles.successSub}>
          Login successful.{"\n"}Taking you to your dashboard…
        </BaseText>
        <ActivityIndicator
          size="small"
          color="#A5D6A7"
          style={{ marginTop: 32 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Hero image */}
      <Image
        source={require("../../../assets/images/login.png")}
        style={styles.heroImage}
        resizeMode="contain"
      />

      {/* Header */}
      <BaseText style={styles.header}>Welcome back</BaseText>
      <BaseText style={styles.subHeader}>
        Sign in to your Paisa Tracker account
      </BaseText>

      {/* Email */}
      <View style={styles.field}>
        <BaseText style={styles.label}>Email address</BaseText>
        <View style={styles.inputRow}>
          <Mail size={18} color="#A5D6A7" />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#BDBDBD"
            value={formData.email}
            onChangeText={(val) => setFormData({ ...formData, email: val })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>
      </View>

      {/* Password */}
      <View style={styles.field}>
        <View style={styles.labelRow}>
          <BaseText style={styles.label}>Password</BaseText>
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            disabled={loading}
          >
            <BaseText style={styles.forgotLink}>Forgot password?</BaseText>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Lock size={18} color="#A5D6A7" />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#BDBDBD"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(val) => setFormData({ ...formData, password: val })}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {showPassword
              ? <Eye size={20} color="#66BB6A" />
              : <EyeOff size={20} color="#66BB6A" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign in button */}
      <TouchableOpacity
        style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
        activeOpacity={0.85}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator size="small" color="#FFFFFF" />
          : <BaseText style={styles.signInBtnText}>Sign in</BaseText>}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <BaseText style={styles.orText}>OR</BaseText>
        <View style={styles.dividerLine} />
      </View>

      {/* Google */}
      <TouchableOpacity
        style={styles.googleBtn}
        activeOpacity={0.75}
        disabled={loading}
      >
        <Text style={styles.googleG}>G</Text>
        <BaseText style={styles.googleText}>Continue with Google</BaseText>
      </TouchableOpacity>

      {/* Register link */}
      <View style={styles.registerRow}>
        <BaseText style={styles.registerText}>Dont have an account? </BaseText>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          disabled={loading}
        >
          <BaseText style={styles.registerLink}>Create one</BaseText>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <BaseText style={styles.footer}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </BaseText>

    </View>
  );
};

const G = {
  dark:    "#1B5E20",
  mid:     "#2E7D32",
  accent:  "#66BB6A",
  light:   "#A5D6A7",
  lighter: "#C8E6C9",
  hint:    "#81C784",
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  heroImage: {
    width: 140,
    height: 140,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 22,
  },

  header: {
    fontSize: 28,
    color: G.dark,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subHeader: {
    fontSize: 14,
    color: G.accent,
    textAlign: "center",
    marginBottom: 36,
  },

  field: {
    marginBottom: 22,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: G.mid,
    letterSpacing: 0.1,
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: "500",
    color: G.mid,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: G.lighter,
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontFamily: "Jaro_400Regular",
    height: "100%",
  },

  signInBtn: {
    height: 58,
    backgroundColor: G.mid,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 28,
  },
  signInBtnDisabled: {
    backgroundColor: G.light,
  },
  signInBtnText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: G.lighter,
  },
  orText: {
    marginHorizontal: 14,
    fontSize: 12,
    fontWeight: "500",
    color: G.light,
    letterSpacing: 1,
  },

  googleBtn: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: G.lighter,
    borderRadius: 16,
    marginBottom: 28,
  },
  googleG: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F1F1F1",
    textAlign: "center",
    lineHeight: 26,
    fontSize: 13,
    fontWeight: "700",
    color: "#4285F4",
    overflow: "hidden",
  },
  googleText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  registerText: {
    fontSize: 13,
    color: G.hint,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: "500",
    color: G.mid,
  },

  footer: {
    textAlign: "center",
    fontSize: 11,
    color: G.light,
    lineHeight: 17,
    paddingHorizontal: 12,
  },

  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 120,
  },
  successIconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: G.lighter,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  successTitle: {
    fontSize: 26,
    color: G.dark,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  successSub: {
    fontSize: 15,
    color: G.accent,
    textAlign: "center",
    lineHeight: 22,
  },
});