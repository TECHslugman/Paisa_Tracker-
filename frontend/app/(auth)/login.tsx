// frontend/app/(auth)/login.tsx
import { StyleSheet, View, ScrollView } from "react-native";
import { LoginForm } from "../../components/features/auth/LoginForm";

export default function Login() {
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LoginForm />
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
    paddingTop: 48,
    paddingBottom: 32,
  },
});