import { View, StyleSheet } from "react-native";
import { BaseText } from "../../components/common/BaseText";
export default function Profile() {
  return (
    <View style={s.screen}>
      <BaseText style={s.text}>Profile coming soon</BaseText>
    </View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#EEF7EE", alignItems: "center", justifyContent: "center" },
  text: { fontSize: 15, color: "#81C784" },
});