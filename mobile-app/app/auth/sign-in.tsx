import * as React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import Background from "@/components/Background";
import DisplayBox from "@/components/DisplayBox";
import { Button } from "@/components/Button";
import Text from "@/components/JilaText";
import { UsernameInput, PasswordInput } from "@/components/Input";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: username,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError("Sign in failed. Please try again.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
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
                Don&apos;t have an account?{" "}
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
