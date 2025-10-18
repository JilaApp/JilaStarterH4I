import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Eye, EyeOff } from "lucide-react-native";

const COMMUNITY_ORGS = [
  "Community Org 1",
  "Community Org 2",
  "Community Org 3",
  "Other"
];

const LANGUAGES = [
  "English",
  "Spanish",
  "Q'anjob'al",
  "Mam",
  "K'iche'",
  "Other"
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
    <ScrollView className="flex-1 bg-cream-300">
      <View className="flex-1 justify-center p-6 min-h-screen">
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="page-title-text text-jila-400 mb-6">Sign Up</Text>
          
          <View className="space-y-4">
            <View>
              <Text className="components-text text-type-400 mb-2">Username</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base"
                autoCapitalize="none"
                value={username}
                placeholder="Enter username"
                onChangeText={setUsername}
              />
            </View>

            <View>
              <Text className="components-text text-type-400 mb-2">Password</Text>
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

            <View>
              <Text className="components-text text-type-400 mb-2">Confirm Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg">
                <TextInput
                  className="flex-1 p-3 text-base"
                  value={confirmPassword}
                  placeholder="Confirm password"
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="pr-3"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={24} color="#9C9C9C" />
                  ) : (
                    <Eye size={24} color="#9C9C9C" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="components-text text-type-400 mb-2">Community Organization</Text>
              <View className="border border-gray-300 rounded-lg">
                <Picker
                  selectedValue={communityOrg}
                  onValueChange={setCommunityOrg}
                >
                  {COMMUNITY_ORGS.map((org) => (
                    <Picker.Item key={org} label={org} value={org} />
                  ))}
                </Picker>
              </View>
            </View>

            <View>
              <Text className="components-text text-type-400 mb-2">Language</Text>
              <View className="border border-gray-300 rounded-lg">
                <Picker
                  selectedValue={language}
                  onValueChange={setLanguage}
                >
                  {LANGUAGES.map((lang) => (
                    <Picker.Item key={lang} label={lang} value={lang} />
                  ))}
                </Picker>
              </View>
            </View>

            {error ? (
              <Text className="text-error-400 text-sm">{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={loading}
              className={`bg-jila-400 rounded-lg p-4 ${loading ? "opacity-50" : ""}`}
            >
              <Text className="text-white-400 text-center font-bold text-base">
                {loading ? "Creating account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-400">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/sign-in")}>
                <Text className="text-jila-400 font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}