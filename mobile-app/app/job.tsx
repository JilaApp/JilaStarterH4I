import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/colors";
import Background from "@/components/Background";
import DisplayBox from "@/components/DisplayBox";

export default function JobDashboard() {
  return (
    // This is just an example usage of the background. The actual job page
    // will have a will have a different styling.
    <Background>
      <DisplayBox>
        <View style={styles.container}>
          <Text style={styles.title}>Job Dashboard</Text>
          <Text>Your content here</Text>
        </View>
      </DisplayBox>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white[400],
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
});
