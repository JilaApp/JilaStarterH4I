import { View, StyleSheet } from "react-native";
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
import Text from "@/components/JilaText";
import { UsernameInput, PasswordInput } from "@/components/Input";
import Dropdown from "@/components/Dropdown";
import SearchableDropdown from "@/components/SearchableDropdown";

import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import Checkbox from "@/components/Checkbox";

const COMMUNITY_ORGS = [
  "Community Org 1",
  "Community Org 2",
  "Community Org 3",
  "Other",
];

const LANGUAGES = [
  "English",
  "Spanish",
  "Q'anjob'al",
  "Mam",
  "K'iche'",
  "Other",
];

export default function BuildProfile() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

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

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [communityOrg, setCommunityOrg] = React.useState(COMMUNITY_ORGS[0]);
  // const [language, setLanguage] = React.useState(LANGUAGES[0]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [chooseCommunity, setChooseCommunity] = useState(false);
  const [customCommunity, setCustomCommunity] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Create sign up with username and password
      // Store community org and language in unsafe metadata (will be moved to database by webhook)
      await signUp.create({
        username,
        password,
        unsafeMetadata: {
          communityOrg,
          language,
        },
      });

      // Set the session active
      await setActive({ session: signUp.createdSessionId });

      // Navigate to home
      router.replace("/");
    } catch (err: any) {
      console.error("Sign up error:", JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const [selectedDropdown, setSelectedDropdown] = useState<string | null>(null);
  const dropdownOptions = [
    "",
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const cityOptions = [
    "Champaign",
    "Urbana",
    "Chicago",
    "Springfield",
    "Peoria",
    "Rockford",
    "Naperville",
    "Aurora",
    "Joliet",
    "Elgin",
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleContinue = () => {
    setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
  };

  return (
    <Background>
      <DisplayBox>
        {/* select language */}
        {/* <View style={styles.container}>
          <Text style={styles.title}>Select your language</Text>
          <View style={styles.exampleContainer}>
            <View style={styles.selectContainer}>
                <Select
                options={languageOptions}
                selected={selectedLanguage}
                onSelect={setSelectedLanguage}
                />
            </View>
            <View style={styles.toggle}>
              <Toggle />
            </View>
            <Button text="Continue" onPress={handleContinue} />
            <Stepper totalSteps={4} currentStep={currentStep} />
          </View>
        </View> */}

        {/* username/password */}
        {/* <View style={styles.container}>
          <Text style={styles.title}>Create profile</Text>
          
          <View style={styles.exampleContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Username</Text>
            <UsernameInput onChange={setUsername} />

            <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: "5%" }}>Password</Text>
            <View style={{marginBottom: "5%"}}>
              <PasswordInput onChange={setPassword} />
            </View>

            <Button text="Continue" onPress={handleContinue} />
            <Stepper totalSteps={4} currentStep={currentStep} />
          </View>
        </View> */}

        {/* community */}
        <View style={styles.container}>
          <Text style={styles.title}>Select Community</Text>

          {customCommunity ? (
            <View style={styles.exampleContainer}>
              <View style={{ marginBottom: "5%" }}>
                <View>
                  <Text style={styles.sectionTitle}>
                    Search organization name:
                  </Text>
                  <SearchableDropdown
                    placeholder="Search organization..."
                    text="Search organization..."
                    options={cityOptions}
                    selected={selectedCity}
                    onSelect={setSelectedCity}
                  />
                </View>
              </View>

              <View style={styles.selectContainer}>
                <Select
                  options={languageOptions}
                  selected={selectedLanguage}
                  onSelect={setSelectedLanguage}
                />
              </View>
              <Button
                text="Finish!"
                onPress={() => {
                  handleContinue();
                }}
              />
              <Stepper totalSteps={4} currentStep={currentStep} />
            </View>
          ) : (
            <View style={{ ...styles.exampleContainer, gap: 14 }}>
              <View>
                <Text style={{ marginTop: 5, fontSize: 20, fontWeight: "700" }}>
                  Your Organization
                </Text>
                <Text>Default largest organization in your area</Text>
              </View>
              <Select
                options={[
                  {
                    id: "1",
                    title: "hi",
                    audioSource: require("../assets/audio/sample.mp3"),
                    disabled: chooseCommunity,
                  },
                ]}
                selected="1"
                onSelect={() => {}}
              />
              <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <Checkbox
                  size="small"
                  checked={chooseCommunity}
                  onCheckedChange={() => {
                    setChooseCommunity(!chooseCommunity);
                  }}
                />
                <Text>Choose my own community</Text>
              </View>

              <Button
                text={chooseCommunity ? "Continue" : "Finish!"}
                onPress={() => {
                  if (chooseCommunity) {
                    setCustomCommunity(true);
                  } else {
                    handleContinue();
                  }
                }}
              />
              <Stepper totalSteps={4} currentStep={currentStep} />
            </View>
          )}
        </View>

        {/* VIEW 3 WIP */}
        {/* <View style={styles.container}>
          <Text style={styles.title}>Select your location</Text>

          <View style={styles.exampleContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>State</Text>
            <View style={styles.dropdownContainer}>
              <View style={styles.stateDropdown}>
                <Dropdown
                  text={"--Select State--"}
                  options={dropdownOptions}
                  selected={selectedDropdown}
                  onSelect={setSelectedDropdown}
                />
              </View>
            </View>
            <Button text="Continue" onPress={handleContinue} />
            <Stepper totalSteps={4} currentStep={currentStep} />

            <Text
              style={{ fontWeight: "bold", fontSize: 16, marginTop: "-10%" }}
            >
              City (optional)
            </Text>
            <View style={{ marginBottom: "5%" }}>
              <View>
                <SearchableDropdown
                  placeholder="Search U.S. cities..."
                  text={"Champaign"}
                  options={cityOptions}
                  selected={selectedCity}
                  onSelect={setSelectedCity}
                />
              </View>
            </View>

            <Button text="Continue" onPress={handleContinue} />
            <Stepper totalSteps={4} currentStep={currentStep} />
          </View> 
        </View>*/}
      </DisplayBox>
    </Background>
  );
}

const styles = StyleSheet.create({
  stateDropdown: {
    width: "140%",
    marginLeft: -40,
    marginTop: -40,
  },
  container: {
    flex: 1,
    width: "93%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white[400],
    marginHorizontal: "auto",
  },
  toggle: {
    flex: 1,
    // marginHorizontal: "auto",
    width: "70%",
    marginTop: "-20%",
    marginLeft: "-11%",
    marginBottom: "-15%",
  },
  title: {
    fontSize: sizes.fontSize.lg,
    fontWeight: "700",
    color: colors.jila[400],
    marginBottom: 0,
  },
  exampleContainer: {
    width: "125%",
    marginTop: sizes.spacing.xs,
    paddingHorizontal: sizes.spacing.xs,
    gap: sizes.spacing.xs,
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
    marginBottom: 0,
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
