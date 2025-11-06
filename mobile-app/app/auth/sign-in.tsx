import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";

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
    <ScrollView className="flex-1 bg-cream-300">
      <View className="flex-1 justify-center p-6 min-h-screen">
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="page-title-text text-jila-400 mb-6">Sign In</Text>

          <View className="space-y-4">
            <View>
              <Text className="components-text text-type-400 mb-2">
                Username
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base"
                autoCapitalize="none"
                value={username}
                placeholder="Enter username"
                onChangeText={setUsername}
              />
            </View>

            <View>
              <Text className="components-text text-type-400 mb-2">
                Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg">
                <TextInput
                  className="flex-1 p-3 text-base"
                  value={password}
                  placeholder="Enter password"
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="pr-3"
                >
                  {showPassword ? (
                    <EyeOff size={24} color="#9C9C9C" />
                  ) : (
                    <Eye size={24} color="#9C9C9C" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {error ? (
              <Text className="text-error-400 text-sm">{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={onSignInPress}
              disabled={loading}
              className={`bg-jila-400 rounded-lg p-4 mt-4 ${loading ? "opacity-50" : ""}`}
            >
              <Text className="text-white-400 text-center font-bold text-base">
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-400">
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
                <Text className="text-jila-400 font-bold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
