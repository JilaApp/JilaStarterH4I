import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link } from "expo-router";

export default function SignUpScreen() {
  const { isLoaded, signUp } = useSignUp();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        username,
        password,
      });
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View>
      <>
        <Text>Sign up</Text>
        <TextInput
          autoCapitalize="none"
          value={username}
          placeholder="Enter username"
          onChangeText={(e) => setUsername(e)}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity onPress={onSignUpPress}>
          <Text>Continue</Text>
        </TouchableOpacity>
        <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
          <Text>Already have an account?</Text>
          <Link href="/auth/sign-in">
            <Text>Sign in</Text>
          </Link>
        </View>
      </>
    </View>
  );
}
