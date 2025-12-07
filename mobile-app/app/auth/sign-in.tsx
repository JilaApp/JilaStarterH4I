import * as React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import { Button } from "@/components/Button";
import { UsernameInput, PasswordInput } from "@/components/Input";
import Background from "@/components/Background";
import DisplayBox from "@/components/DisplayBox";

export default function SignInScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

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
    <Background>
      <DisplayBox>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Sign In</Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Username</Text>
            <UsernameInput value={username} onChange={setUsername} />

            <Text style={[styles.label, { marginTop: sizes.spacing.md }]}>
              Password
            </Text>
            <PasswordInput value={password} onChange={setPassword} />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={{ marginTop: sizes.spacing.md }}>
              <Button
                text={loading ? "Signing in..." : "Sign in"}
                onPress={onSignInPress}
                disabled={loading}
              />
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </DisplayBox>
    </Background>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: sizes.spacing.sm,
  },
  title: {
    fontSize: sizes.fontSize.xl,
    fontWeight: "700",
    color: colors.jila[400],
    marginBottom: sizes.spacing.md,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: sizes.spacing.xs,
  },
  label: {
    fontSize: sizes.fontSize.base,
    fontWeight: "700",
    color: colors.black,
    marginBottom: sizes.spacing.xs,
  },
  errorText: {
    color: colors.error[400],
    marginTop: sizes.spacing.sm,
    textAlign: "center",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: sizes.spacing.md,
  },
  signUpText: {
    color: colors.gray[400],
    fontSize: 16,
  },
  signUpLink: {
    color: colors.jila[400],
    fontWeight: "700",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
