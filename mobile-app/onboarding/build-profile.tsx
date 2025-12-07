import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
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
import { trpc } from "@/lib/trpc";
import { Loader, ChevronLeft } from "lucide-react-native";

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
  // const [communityOrg, setCommunityOrg] = React.useState(COMMUNITY_ORGS[0]);
  // const [language, setLanguage] = React.useState(LANGUAGES[0]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [chooseCommunity, setChooseCommunity] = useState(false);
  const [customCommunity, setCustomCommunity] = useState(false);

  const onSignUpPress = async (selectedCommunityOrgName: string) => {
    if (!isLoaded) return;

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!selectedLanguage) {
      setError("Please select a language");
      return;
    }

    if (!selectedDropdown) {
      setError("Please select a state");
      return;
    }

    if (!selectedCommunityOrgName) {
      setError("Please select a community organization");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signUp.create({
        username,
        password,
        unsafeMetadata: {
          communityOrg: selectedCommunityOrgName,
          language: selectedLanguage,
          state: selectedDropdown,
          city: selectedCity || null,
        },
      });

      await setActive({ session: signUp.createdSessionId });

      setCurrentStep(5);
    } catch (err: any) {
      console.error("Sign up error:", JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const [selectedDropdown, setSelectedDropdown] = useState<string | null>(null);
  const dropdownOptions = [
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
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [citySearchText, setCitySearchText] = useState("");

  const [currentStep, setCurrentStep] = useState(1);

  const handleContinue = () => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (citySearchText.length > 2) {
      fetchCitySuggestions(citySearchText);
    } else {
      setCitySuggestions([]);
    }
  }, [citySearchText]);

  const fetchCitySuggestions = async (input: string) => {
    const url = `http://gd.geobytes.com/AutoCompleteCity?q=${encodeURIComponent(input)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const json = await response.json();
      const cityNames = (json || []).map((fullName: string) => {
        return fullName.split(',')[0].trim();
      });
      setCitySuggestions(cityNames);
    } catch (error) {
      console.error("Fetching city error:", error);
      setCitySuggestions([]);
    }
  };

  const {
    data: communityOrgs,
    isLoading,
    fetchError,
  } = trpc.community.getAllCommunityOrgs.useQuery();

  let largestOrg;
  let showStateWarning = false;

  if (communityOrgs && communityOrgs.length > 0) {
    if (selectedDropdown) {
      const orgsInUserState = communityOrgs.filter(org => org.state === selectedDropdown);

      if (orgsInUserState.length > 0) {
        largestOrg = orgsInUserState[0];
        for (let org of orgsInUserState) {
          if (org.videos && largestOrg.videos && org.videos.length > largestOrg.videos.length) {
            largestOrg = org;
          }
        }
        showStateWarning = false;
      } else {
        largestOrg = communityOrgs[0];
        for (let org of communityOrgs) {
          if (org.videos && largestOrg.videos && org.videos.length > largestOrg.videos.length) {
            largestOrg = org;
          }
        }
        showStateWarning = true;
      }
    } else {
      largestOrg = communityOrgs[0];
      for (let org of communityOrgs) {
        if (org.videos && largestOrg.videos && org.videos.length > largestOrg.videos.length) {
          largestOrg = org;
        }
      }
    }
  }

  const [communityOrg, setCommunityOrg] = useState("");
  const [areaOrg, setAreaorg] = useState(largestOrg);

  return (
    <Background>
      <DisplayBox>
        {/* select language */}
        {currentStep === 1 && (
          <View style={styles.container}>
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
              <Button text="Continue" onPress={handleContinue} disabled={!selectedLanguage} />
              <Stepper totalSteps={4} currentStep={currentStep - 1} />
            </View>
          </View>
        )}

        {/* username/password */}
        {currentStep === 2 && (
          <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ChevronLeft size={20} color={colors.jila[400]} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Create profile</Text>

            <View style={styles.exampleContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Username</Text>
              <UsernameInput onChange={setUsername} />

              <Text
                style={{ fontWeight: "bold", fontSize: 16, marginTop: "5%" }}
              >
                Password
              </Text>
              <View style={{ marginBottom: "5%" }}>
                <PasswordInput onChange={setPassword} />
              </View>

              <Button text="Continue" onPress={handleContinue} disabled={!username || !password || password.length < 8} />
              <Stepper totalSteps={4} currentStep={currentStep - 1} />
            </View>
          </View>
        )}

        {/* state/city is WIP */}
        {currentStep === 3 && (
          <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ChevronLeft size={20} color={colors.jila[400]} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
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

              <Text
                style={{ fontWeight: "bold", fontSize: 16, marginTop: "5%" }}
              >
                City (optional)
              </Text>
              <View style={{ marginBottom: "5%" }}>
                <View>
                  <SearchableDropdown
                    placeholder="Search U.S. cities..."
                    text={"Search U.S. cities..."}
                    options={citySuggestions}
                    selected={selectedCity}
                    onSelect={setSelectedCity}
                    citySearch={true}
                    onSearchChange={setCitySearchText}
                  />
                </View>
              </View>

              <Button text="Continue" onPress={handleContinue} disabled={!selectedDropdown} />
              <Stepper totalSteps={4} currentStep={currentStep - 1} />
            </View>
          </View>
        )}

        {/* community */}
        {currentStep === 4 && (
          <View style={styles.container}>
            {isLoading || !communityOrgs || !largestOrg ? (
              <Loader />
            ) : (
              <>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <ChevronLeft size={20} color={colors.jila[400]} />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
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
                          options={communityOrgs.map((c) => c.name)}
                          selected={areaOrg}
                          onSelect={setAreaorg}
                          citySearch={false}
                          disabled={communityOrg !== ""}
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        color: colors.jila[400],
                        fontWeight: "800",
                        margin: "auto",
                        fontSize: 20,
                      }}
                    >
                      OR
                    </Text>

                    <Text style={styles.sectionTitle}>
                      Select from your area:
                    </Text>
                    <ScrollView
                      persistentScrollbar={true}
                      showsVerticalScrollIndicator={true}
                      indicatorStyle="black"
                      style={{
                        ...styles.selectContainer,
                        height: 200,
                        paddingRight: 10,
                      }}
                    >
                      <Select
                        options={communityOrgs.map((c) => {
                          return {
                            id: c.name,
                            title:
                              c.name.length < 17
                                ? c.name
                                : c.name.substring(0, 17) + "...",
                            audioSource: require("../assets/audio/sample.mp3"),
                          };
                        })}
                        selected={communityOrg}
                        onSelect={setCommunityOrg}
                      />
                    </ScrollView>
                    <Button
                      text="Finish!"
                      onPress={() => {
                        const selectedOrg = communityOrg || areaOrg?.name || "";
                        onSignUpPress(selectedOrg);
                      }}
                      disabled={loading || (!communityOrg && !areaOrg)}
                    />
                    <Stepper totalSteps={4} currentStep={currentStep - 1} />
                  </View>
                ) : (
                  <View style={{ ...styles.exampleContainer, gap: 14 }}>
                    <View>
                      <Text
                        style={{
                          marginTop: 5,
                          fontSize: 20,
                          fontWeight: "700",
                        }}
                      >
                        Your Organization
                      </Text>
                      <Text>Default largest organization in your area</Text>
                    </View>
                    <Select
                      options={[
                        {
                          id: "1",
                          title:
                            largestOrg.name.length < 15
                              ? largestOrg.name
                              : largestOrg.name.substring(0, 15) + "...",
                          audioSource: require("../assets/audio/sample.mp3"),
                          disabled: chooseCommunity,
                        },
                      ]}
                      selected="1"
                      onSelect={() => {}}
                    />

                    {showStateWarning && (
                      <View style={styles.warningContainer}>
                        <Text style={styles.warningText}>
                          ⚠ Resources may not be local to your area
                        </Text>
                      </View>
                    )}

                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
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
                          onSignUpPress(largestOrg.name);
                        }
                      }}
                      disabled={loading}
                    />
                    <Stepper totalSteps={4} currentStep={currentStep - 1} />
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Step 5: Video Welcome Screen */}
        {currentStep === 5 && (
          <View style={styles.videoContainer}>
            <Text style={styles.videoTitle}>Welcome!</Text>
            <Text style={styles.videoSubtitle}>
              Watch this video to learn how to use the app!
            </Text>

            <View style={styles.videoWrapper}>
              <VideoEmbed
                uri="https://youtu.be/tXlPRgp1zhY"
                type={VideoType.YouTube}
                height={250}
              />
            </View>

            <Button text="Continue" onPress={() => router.replace("/")} />
          </View>
        )}
      </DisplayBox>
    </Background>
  );
}

const styles = StyleSheet.create({
  stateDropdown: {
    width: "100%",
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
    marginBottom: sizes.spacing.sm,
  },
  dropdownText: {
    color: colors.gray[700],
  },
  semibold: {
    fontWeight: "600",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: sizes.spacing.sm,
    marginLeft: -sizes.spacing.md,
  },
  backText: {
    fontSize: sizes.fontSize.base,
    color: colors.jila[400],
    marginLeft: sizes.spacing.xs,
  },
  warningContainer: {
    backgroundColor: colors.cream[200],
    padding: sizes.spacing.sm,
    borderRadius: sizes.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.error[400],
  },
  warningText: {
    fontSize: sizes.fontSize.sm,
    color: colors.error[400],
    fontWeight: "600",
  },
  videoContainer: {
    flex: 1,
    width: "93%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.white[400],
    marginHorizontal: "auto",
    paddingTop: sizes.spacing.xl,
    gap: sizes.spacing.md,
  },
  videoTitle: {
    fontSize: sizes.fontSize.xxl,
    fontWeight: "700",
    color: colors.jila[400],
  },
  videoSubtitle: {
    fontSize: sizes.fontSize.base,
    color: colors.type[400],
    textAlign: "center",
    paddingHorizontal: sizes.spacing.md,
  },
  videoWrapper: {
    width: "100%",
    paddingHorizontal: sizes.spacing.md,
  },
});
