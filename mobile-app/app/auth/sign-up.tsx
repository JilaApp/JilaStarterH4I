import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import Background from "@/components/Background";
import DisplayBox from "@/components/DisplayBox";
import { Stepper } from "@/components/Stepper";
import { Button } from "@/components/Button";
import Select from "@/components/Select";
import { Toggle } from "@/components/Toggle";
import Text from "@/components/JilaText";
import { UsernameInput, PasswordInput } from "@/components/Input";
import Dropdown from "@/components/Dropdown";
import SearchableDropdown from "@/components/SearchableDropdown";

import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import Checkbox from "@/components/Checkbox";
import { trpc } from "@/lib/trpc";
import { Loader, ChevronLeft, AlertCircle } from "lucide-react-native";

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const languageOptions = [
        {
            id: "english",
            title: "English",
            audioSource: require("../../assets/audio/sample.mp3"),
        },
        {
            id: "qanjobal",
            title: "Q'anjob'al",
            audioSource: require("../../assets/audio/sample.mp3"),
        },
    ];

    interface FormData {
        username: string;
        password: string;
        selectedLanguage: string | null;
        ttsEnabled: boolean;
        selectedDropdown: string | null;
        selectedCity: string | null;
        communityOrg: string;
        areaOrg: any;
    }

    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
        selectedLanguage: null,
        ttsEnabled: false,
        selectedDropdown: null,
        selectedCity: null,
        communityOrg: "",
        areaOrg: null,
    });

    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const [chooseCommunity, setChooseCommunity] = useState(false);
    const [customCommunity, setCustomCommunity] = useState(false);

    const onSignUpPress = async (selectedCommunityOrgName: string) => {
        if (!isLoaded) return;

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (!formData.username.trim()) {
            setError("Username is required");
            return;
        }

        if (!formData.selectedLanguage) {
            setError("Please select a language");
            return;
        }

        if (!formData.selectedDropdown) {
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
                username: formData.username,
                password: formData.password,
                unsafeMetadata: {
                    communityOrg: selectedCommunityOrgName,
                    language: formData.selectedLanguage,
                    state: formData.selectedDropdown,
                    city: formData.selectedCity || null,
                    ttsEnabled: formData.ttsEnabled,
                },
            });

            await setActive({ session: signUp.createdSessionId });

            // Redirect to Welcome Video page on success
            router.replace("/welcome");
        } catch (err: any) {
            console.error("Sign up error:", JSON.stringify(err, null, 2));
            setError(err.errors?.[0]?.message || "Failed to sign up");
        } finally {
            setLoading(false);
        }
    };

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

    const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
    const [citySearchText, setCitySearchText] = useState("");

    const [currentStep, setCurrentStep] = useState(1);

    const handleContinue = () => {
        setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        } else {
            router.back();
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
                return fullName.split(",")[0].trim();
            });
            const uniqueCityNames = [...new Set(cityNames)];
            setCitySuggestions(uniqueCityNames);
        } catch (error) {
            console.error("Fetching city error:", error);
            setCitySuggestions([]);
        }
    };

    const {
        data: communityOrgs,
        isLoading,
    } = trpc.community.getAllCommunityOrgs.useQuery();

    let largestOrg: any;
    let showStateWarning = false;

    if (communityOrgs && communityOrgs.length > 0) {
        if (formData.selectedDropdown) {
            const orgsInUserState = communityOrgs.filter(
                (org: any) => org.state === formData.selectedDropdown,
            );

            if (orgsInUserState.length > 0) {
                largestOrg = orgsInUserState[0];
                for (let org of orgsInUserState) {
                    if (
                        org.videos &&
                        largestOrg.videos &&
                        org.videos.length > largestOrg.videos.length
                    ) {
                        largestOrg = org;
                    }
                }
                showStateWarning = false;
            } else {
                largestOrg = communityOrgs[0];
                for (let org of communityOrgs) {
                    if (
                        org.videos &&
                        largestOrg.videos &&
                        org.videos.length > largestOrg.videos.length
                    ) {
                        largestOrg = org;
                    }
                }
                showStateWarning = true;
            }
        } else {
            largestOrg = communityOrgs[0];
            for (let org of communityOrgs) {
                if (
                    org.videos &&
                    largestOrg.videos &&
                    org.videos.length > largestOrg.videos.length
                ) {
                    largestOrg = org;
                }
            }
        }
    }

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
                                    selected={formData.selectedLanguage || ""}
                                    onSelect={(value) =>
                                        setFormData({ ...formData, selectedLanguage: value })
                                    }
                                />
                            </View>
                            <View style={styles.toggle}>
                                <Toggle
                                    onCheckedChange={(value) =>
                                        setFormData({ ...formData, ttsEnabled: value })
                                    }
                                    checked={formData.ttsEnabled}
                                />
                            </View>
                            <Button
                                text="Continue"
                                onPress={handleContinue}
                                disabled={!formData.selectedLanguage}
                            />
                            <Stepper totalSteps={4} currentStep={currentStep - 1} />

                            <View style={styles.signInContainer}>
                                <Text style={styles.signInText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => router.push("/auth/sign-in")}>
                                    <Text style={styles.signInLink}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
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
                            <UsernameInput
                                value={formData.username}
                                onChange={(value) =>
                                    setFormData({ ...formData, username: value })
                                }
                            />

                            <Text
                                style={{ fontWeight: "bold", fontSize: 16, marginTop: "5%" }}
                            >
                                Password
                            </Text>
                            <View style={{ marginBottom: "5%" }}>
                                <PasswordInput
                                    value={formData.password}
                                    onChange={(value) =>
                                        setFormData({ ...formData, password: value })
                                    }
                                />
                            </View>

                            {error ? <Text style={styles.errorText}>{error}</Text> : null}

                            <Button
                                text="Continue"
                                onPress={handleContinue}
                                disabled={
                                    !formData.username ||
                                    !formData.password ||
                                    formData.password.length < 8
                                }
                            />
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
                                        selected={formData.selectedDropdown || ""}
                                        onSelect={(value) =>
                                            setFormData({ ...formData, selectedDropdown: value })
                                        }
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
                                        selected={formData.selectedCity || ""}
                                        onSelect={(value) =>
                                            setFormData({ ...formData, selectedCity: value })
                                        }
                                        citySearch={true}
                                        onSearchChange={setCitySearchText}
                                    />
                                </View>
                            </View>

                            <Button
                                text="Continue"
                                onPress={handleContinue}
                                disabled={!formData.selectedDropdown}
                            />
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
                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={handleBack}
                                >
                                    <ChevronLeft size={20} color={colors.jila[400]} />
                                    <Text style={styles.backText}>Back</Text>
                                </TouchableOpacity>
                                <Text style={styles.title}>Select Community</Text>

                                {customCommunity ? (
                                    <View style={{ ...styles.exampleContainer, flex: 1 }}>
                                        <View style={{ marginBottom: "5%" }}>
                                            <View>
                                                <Text style={styles.sectionTitle}>
                                                    Search organization name:
                                                </Text>
                                                <SearchableDropdown
                                                    placeholder="Search organization..."
                                                    text="Search organization..."
                                                    options={communityOrgs.map((c: any) => c.name)}
                                                    selected={formData.areaOrg || ""}
                                                    onSelect={(value) =>
                                                        setFormData({ ...formData, areaOrg: value })
                                                    }
                                                    citySearch={false}
                                                    disabled={formData.communityOrg !== ""}
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
                                        <View style={{ flex: 1 }}>
                                            <ScrollView
                                                persistentScrollbar={true}
                                                showsVerticalScrollIndicator={true}
                                                indicatorStyle="black"
                                                style={{
                                                    ...styles.selectContainer,
                                                    paddingRight: 10,
                                                }}
                                            >
                                                <Select
                                                    options={communityOrgs.map((c: any) => {
                                                        return {
                                                            id: c.name,
                                                            title:
                                                                c.name.length < 17
                                                                    ? c.name
                                                                    : c.name.substring(0, 17) + "...",
                                                            audioSource: require("../../assets/audio/sample.mp3"),
                                                        };
                                                    })}
                                                    selected={formData.communityOrg}
                                                    onSelect={(value) =>
                                                        setFormData({ ...formData, communityOrg: value })
                                                    }
                                                />
                                            </ScrollView>
                                        </View>
                                        <Button
                                            text="Finish!"
                                            onPress={() => {
                                                const selectedOrg =
                                                    formData.communityOrg || (formData.areaOrg as string) || "";
                                                onSignUpPress(selectedOrg);
                                            }}
                                            disabled={
                                                loading || (!formData.communityOrg && !formData.areaOrg)
                                            }
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
                                                    audioSource: require("../../assets/audio/sample.mp3"),
                                                    disabled: chooseCommunity,
                                                },
                                            ]}
                                            selected="1"
                                            onSelect={() => { }}
                                        />

                                        {showStateWarning && (
                                            <View style={styles.warningContainer}>
                                                <View
                                                    style={{ flexDirection: "row", alignItems: "center" }}
                                                >
                                                    <AlertCircle size={20} color={colors.jila[400]} />
                                                    <Text style={styles.warningText}>
                                                        {" "}
                                                        Resources may not be local to your area
                                                    </Text>
                                                </View>
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
            </DisplayBox>
        </Background >
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
        width: "100%",
        alignItems: "center",
        marginVertical: sizes.spacing.sm,
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
        backgroundColor: colors.cream[300],
        padding: sizes.spacing.sm,
        borderRadius: sizes.borderRadius.sm,
    },
    warningText: {
        fontSize: sizes.fontSize.sm,
        color: colors.jila[400],
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
    errorText: {
        color: colors.error[400],
        fontSize: sizes.fontSize.sm,
        marginBottom: sizes.spacing.sm,
    },
    signInContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: sizes.spacing.md,
    },
    signInText: {
        color: colors.gray[400],
        fontSize: 16,
    },
    signInLink: {
        color: colors.jila[400],
        fontWeight: "700",
        fontSize: 16,
        textDecorationLine: "underline",
    },
});
