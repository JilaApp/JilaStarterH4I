import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/colors";

export default function SocialServices() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Services</Text>
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
