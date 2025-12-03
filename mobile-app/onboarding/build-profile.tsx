import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import Background from "@/components/Background";
import DisplayBox from "@/components/DisplayBox";
import { Stepper } from "@/components/Stepper";
import { Button } from "@/components/Button";
import Select from "@/components/Select";
import Link from "@/components/Link";
import { Toggle } from "@/components/Toggle";


export default function BuilProfile() {

    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [smallChecked, setSmallChecked] = useState(false);
    const [largeChecked, setLargeChecked] = useState(false);
    const languageOptions = [
        {
            id: "english",
            title: "English",
            audioSource: require("../assets/audio/sample.mp3"),
        },
        {
            id: "qanjobal",
            title: "Q'anjob'al",
            audioSource: require("../assets/audio/sample.mp3"),
        },
    ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleContinue = () => {
    setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
  };

  return (
    <Background>
      <DisplayBox>
        <View style={styles.container}>
          <Text style={styles.title}>Select your language</Text>
          {/* <Text>(in job dashboard)</Text>
          <Link path="/dev">
            <Text style={styles.buttonText}>Dev Page</Text>
          </Link>
          <Link path="/onboarding">
            <Text style={styles.buttonText}>Onboarding Page</Text>
          </Link>
          {/* Example usage of Stepper and Button components */}
          <View style={styles.exampleContainer}>
            <View style={styles.selectContainer}>
                <Select
                options={languageOptions}
                selected={selectedLanguage}
                onSelect={setSelectedLanguage}
                />
            </View>
            <Toggle />
            <Button text="Continue" onPress={handleContinue} />
            <Stepper totalSteps={4} currentStep={currentStep} />
          </View> */}
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
    color: colors.jila[300],
  },
  exampleContainer: {
    width: "100%",
    marginTop: sizes.spacing.lg,
    paddingHorizontal: sizes.spacing.lg,
    gap: sizes.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: colors.type[400],
  },
  selectContainer: {
    paddingVertical: 20,
  },
  checkboxContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    gap: 25,
  },
  linkContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    gap: 15,
    backgroundColor: colors.cream[300],
  },
  colorDemoTitle: {
    fontSize: 30,
    fontWeight: "700",
  },
  dropdownContainer: {
    margin: 40,
  },
  dropdownText: {
    color: colors.gray[700],
  },
  semibold: {
    fontWeight: "600",
  },
});