// frontend/components/features/RegisterForm.tsx
import React, { useState } from "react";
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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFonts, Jaro_400Regular } from "@expo-google-fonts/jaro";
import { BaseText } from "../../common/BaseText";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
} from "lucide-react-native";
import { authService } from "../../../services/authService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

export const RegisterForm = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Jaro_400Regular });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
  });

  const validate = () => {
    const newErrors = { name: "", email: "", password: "", number: "" };
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
      valid = false;
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    if (!formData.number.trim()) {
      newErrors.number = "Phone number is required";
      valid = false;
    } else if (!/^\+?[\d\s\-]{7,15}$/.test(formData.number)) {
      newErrors.number = "Enter a valid phone number";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password = "Password must contain letters and numbers";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await authService.register(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/(auth)/login");
      }, 1500);
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, val: string) => {
    setFormData({ ...formData, [field]: val });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  if (!fontsLoaded) return null;

  if (success) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIconRing}>
          <CheckCircle size={48} color="#2E7D32" />
        </View>
        <BaseText style={styles.successTitle}>You are all set!</BaseText>
        <BaseText style={styles.successSub}>
          Account created.{"\n"}Taking you to sign in…
        </BaseText>
        <ActivityIndicator size="small" color="#A5D6A7" style={{ marginTop: 32 }} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Hero image */}
          <Image
            source={require("../../../assets/images/register.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />

          {/* Header */}
          <BaseText style={styles.header}>Create account</BaseText>
          <BaseText style={styles.subHeader}>Start tracking your money today</BaseText>

          {/* Full name */}
          <View style={styles.field}>
            <BaseText style={styles.label}>Full name</BaseText>
            <View style={[styles.inputRow, errors.name ? styles.inputError : null]}>
              <User size={18} color="#A5D6A7" />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#BDBDBD"
                value={formData.name}
                onChangeText={(val) => updateField("name", val)}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>
            {errors.name ? <ErrorMsg msg={errors.name} /> : null}
          </View>

          {/* Email */}
          <View style={styles.field}>
            <BaseText style={styles.label}>Email address</BaseText>
            <View style={[styles.inputRow, errors.email ? styles.inputError : null]}>
              <Mail size={18} color="#A5D6A7" />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#BDBDBD"
                value={formData.email}
                onChangeText={(val) => updateField("email", val)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
            {errors.email ? <ErrorMsg msg={errors.email} /> : null}
          </View>

          {/* Phone */}
          <View style={styles.field}>
            <BaseText style={styles.label}>Phone number</BaseText>
            <View style={[styles.inputRow, errors.number ? styles.inputError : null]}>
              <Phone size={18} color="#A5D6A7" />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#BDBDBD"
                value={formData.number}
                onChangeText={(val) => updateField("number", val)}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>
            {errors.number ? <ErrorMsg msg={errors.number} /> : null}
          </View>

          {/* Password */}
          <View style={styles.field}>
            <BaseText style={styles.label}>Password</BaseText>
            <View style={[styles.inputRow, errors.password ? styles.inputError : null]}>
              <Lock size={18} color="#A5D6A7" />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(val) => updateField("password", val)}
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
            {errors.password ? <ErrorMsg msg={errors.password} /> : null}
          </View>

          {/* Create account button */}
          <TouchableOpacity
            style={[styles.createBtn, loading && styles.createBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator size="small" color="#FFFFFF" />
              : <BaseText style={styles.createBtnText}>Create account</BaseText>}
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

          {/* Sign in link */}
          <View style={styles.signInRow}>
            <BaseText style={styles.signInText}>Already have an account? </BaseText>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              disabled={loading}
            >
              <BaseText style={styles.signInLink}>Sign in</BaseText>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <BaseText style={styles.footer}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </BaseText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const ErrorMsg = ({ msg }: { msg: string }) => (
  <View style={errStyles.row}>
    <AlertCircle size={11} color="#E53935" />
    <Text style={errStyles.text}>{msg}</Text>
  </View>
);

const errStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
    paddingLeft: 2,
  },
  text: {
    fontSize: 11,
    color: "#E53935",
  },
});

const G = {
  dark:    "#1B5E20",
  mid:     "#2E7D32",
  accent:  "#66BB6A",
  light:   "#A5D6A7",
  lighter: "#C8E6C9",
  hint:    "#81C784",
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    flex: 1,
  },

  heroImage: {
    width: 100,
    height: 100,
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
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: G.mid,
    letterSpacing: 0.1,
    marginBottom: 2,
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
  inputError: {
    borderColor: "#E53935",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontFamily: "Jaro_400Regular",
    height: "100%",
  },

  createBtn: {
    height: 58,
    backgroundColor: G.mid,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  createBtnDisabled: {
    backgroundColor: G.light,
  },
  createBtnText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
    marginBottom: 15,
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

  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  signInText: {
    fontSize: 13,
    color: G.hint,
  },
  signInLink: {
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