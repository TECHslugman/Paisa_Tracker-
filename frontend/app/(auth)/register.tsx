// frontend/app/(auth)/register.tsx
import { StyleSheet, View, ScrollView } from "react-native";
import { RegisterForm } from "../../components/features/auth/RegisterForm";

export default function Register() {
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <RegisterForm />
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