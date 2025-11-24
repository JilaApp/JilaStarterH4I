import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import React, { useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { colors } from "@/colors";

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.jila[400]} />
      </View>
    );
  }

  // If not signed in, show loading while redirecting
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.jila[400]} />
      </View>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth/sign-in");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Hello, {user.username}!</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Username:</Text> {user.username}
          </Text>
          <Text style={styles.infoTextWithMargin}>
            <Text style={styles.bold}>User Type:</Text>{" "}
            {user.publicMetadata?.userType || "Loading..."}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Member Since:</Text>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Link href="/dev" asChild>
          <TouchableOpacity style={styles.devButton}>
            <Text style={styles.buttonText}>Dev Page</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cream[300],
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cream[300],
    padding: 24,
  },
  card: {
    backgroundColor: colors.white[400],
    borderRadius: 16,
    padding: 32,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
    maxWidth: 448,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.jila[400],
    marginBottom: 16,
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: colors.gray[200],
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    color: colors.type[400],
    fontSize: 16,
  },
  infoTextWithMargin: {
    color: colors.type[400],
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "700",
  },
  devButton: {
    backgroundColor: colors.teal[400],
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  signOutButton: {
    backgroundColor: colors.error[400],
    borderRadius: 8,
    padding: 16,
  },
  buttonText: {
    color: colors.white[400],
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
