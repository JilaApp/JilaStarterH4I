import { View, StyleSheet } from "react-native";
import { colors } from "@/colors";

interface StepperProps {
  totalSteps: number;
  currentStep: number;
}

export function Stepper({ totalSteps, currentStep }: StepperProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.step,
            index <= currentStep ? styles.stepActive : styles.stepInactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "100%",
  },
  step: {
    flex: 1,
    height: 4,
  },
  stepActive: {
    backgroundColor: colors.jila[400],
  },
  stepInactive: {
    backgroundColor: colors.gray[200],
  },
});
