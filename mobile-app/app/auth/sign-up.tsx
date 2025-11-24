import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Eye, EyeOff } from "lucide-react-native";
import { colors } from "@/colors";

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

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [communityOrg, setCommunityOrg] = React.useState(COMMUNITY_ORGS[0]);
  const [language, setLanguage] = React.useState(LANGUAGES[0]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.pageTitle, styles.titleColor]}>Sign Up</Text>

          <View style={styles.formContainer}>
            <View>
              <Text style={[styles.label, styles.labelColor]}>Username</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={username}
                placeholder="Enter username"
                onChangeText={setUsername}
                selectionColor={colors.jila[400]}
              />
            </View>

            <View>
              <Text style={[styles.label, styles.labelColor]}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  placeholder="Enter password"
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  selectionColor={colors.jila[400]}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={24} color={colors.gray[400]} />
                  ) : (
                    <Eye size={24} color={colors.gray[400]} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={[styles.label, styles.labelColor]}>
                Confirm Password
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  placeholder="Confirm password"
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={setConfirmPassword}
                  selectionColor={colors.jila[400]}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={24} color={colors.gray[400]} />
                  ) : (
                    <Eye size={24} color={colors.gray[400]} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={[styles.label, styles.labelColor]}>
                Community Organization
              </Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={communityOrg} onChange={setCommunityOrg}>
                  {COMMUNITY_ORGS.map((org) => (
                    <Picker.Item key={org} label={org} value={org} />
                  ))}
                </Picker>
              </View>
            </View>

            <View>
              <Text style={[styles.label, styles.labelColor]}>Language</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={language} onChange={setLanguage}>
                  {LANGUAGES.map((lang) => (
                    <Picker.Item key={lang} label={lang} value={lang} />
                  ))}
                </Picker>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={loading}
              style={[styles.signUpButton, loading && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/sign-in")}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.cream[300],
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    minHeight: "100%",
  },
  card: {
    backgroundColor: colors.white[400],
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 24,
  },
  titleColor: {
    color: colors.jila[400],
  },
  formContainer: {
    gap: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  labelColor: {
    color: colors.type[400],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeButton: {
    paddingRight: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
  },
  errorText: {
    color: colors.error[400],
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: colors.jila[400],
    borderRadius: 8,
    padding: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white[400],
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signInText: {
    color: colors.gray[400],
  },
  signInLink: {
    color: colors.jila[400],
    fontWeight: "700",
  },
});
