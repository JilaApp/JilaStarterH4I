import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/colors";

export default function JobDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white[400],
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
});
