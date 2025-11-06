import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import React, { useEffect } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";

export default function App() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  // Handle redirect in useEffect to avoid render-time navigation
  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/auth/sign-in");
    }
  }, [isLoaded, user, router]);

  // Show loading state
  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-cream-300">
        <ActivityIndicator size="large" color="#7E0601" />
      </View>
    );
  }

  // If not signed in, show loading while redirecting
  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-cream-300">
        <ActivityIndicator size="large" color="#7E0601" />
      </View>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth/sign-in");
  };

  return (
    <View className="flex-1 justify-center items-center bg-cream-300 p-6">
      <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
        <Text className="text-4xl font-bold text-jila-400 mb-4 text-center">
          Hello, {user.username}!
        </Text>

        <View className="bg-gray-200 rounded-lg p-4 mb-6">
          <Text className="text-type-400 text-base mb-2">
            <Text className="font-bold">Username:</Text> {user.username}
          </Text>
          <Text className="text-type-400 text-base mb-2">
            <Text className="font-bold">User Type:</Text>{" "}
            {user.publicMetadata?.userType || "Loading..."}
          </Text>
          <Text className="text-type-400 text-base">
            <Text className="font-bold">Member Since:</Text>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Link href="/dev" asChild>
          <TouchableOpacity className="bg-teal-400 rounded-lg p-4 mb-4">
            <Text className="text-white-400 text-center font-bold text-base">
              Dev Page
            </Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-error-400 rounded-lg p-4"
        >
          <Text className="text-white-400 text-center font-bold text-base">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
