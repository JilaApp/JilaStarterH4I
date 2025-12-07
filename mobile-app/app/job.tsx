import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import Background from "@/components/Background";
import DisplayBox from "@/components/DisplayBox";
import { Stepper } from "@/components/Stepper";
import { Button } from "@/components/Button";
import Link from "@/components/Link";

export default function JobDashboard() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleContinue = () => {
    setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
  };

  return (
    <Background>
      <DisplayBox>
        <View style={styles.container}>
          <Text style={styles.title}>Example display box</Text>
          <Text>(in job dashboard)</Text>
          <Link path="/dev">Dev Page</Link>

          {/* Example usage of Stepper and Button components */}
          <View style={styles.exampleContainer}>
            <Button text="Continue" onPress={handleContinue} />
            <Stepper totalSteps={4} currentStep={currentStep} />
          </View>
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
    fontSize: sizes.fontSize.lg,
    fontWeight: "700",
  },
  exampleContainer: {
    width: "100%",
    marginTop: sizes.spacing.lg,
    paddingHorizontal: sizes.spacing.lg,
    gap: sizes.spacing.md,
  },
  buttonText: {
    color: colors.jila[400],
    fontSize: sizes.fontSize.base,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
