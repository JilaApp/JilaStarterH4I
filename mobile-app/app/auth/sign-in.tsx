import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { colors } from "@/colors";

export default function SignInScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: username,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      console.error("Sign in error:", JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.pageTitle, styles.titleColor]}>Sign In</Text>

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

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              onPress={onSignInPress}
              disabled={loading}
              style={[styles.signInButton, loading && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
                <Text style={styles.signUpLink}>Sign Up</Text>
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
  errorText: {
    color: colors.error[400],
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: colors.jila[400],
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
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
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signUpText: {
    color: colors.gray[400],
  },
  signUpLink: {
    color: colors.jila[400],
    fontWeight: "700",
  },
});
