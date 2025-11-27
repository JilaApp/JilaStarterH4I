import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "@/colors";
import { hp, wp } from "@/utils/responsive";
import Header from "@/components/Header";
import BottomBackground from "@/components/BottomBackground";
import {
  CareerButton,
  LegalButton,
  MedicalButton,
  TransportButton,
  EducationButton,
  OtherButton,
} from "@/components/GradientButton";

export default function App() {
  const { user, isLoaded } = useUser();
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

  const navigateToCategory = (category: string) => {
    router.push({
      pathname: "/video-router",
      params: { category },
    });
  };

  return (
    <>
      <Header
        text={`Hi ${user.username}, What would you like to learn today?`}
        toggleSearch={true}
      />
      <BottomBackground contentStyle={styles.container}>
        <View style={styles.buttonGridWrapper}>
          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>
              <CareerButton onPress={() => navigateToCategory("Career")} />
              <LegalButton onPress={() => navigateToCategory("Legal")} />
            </View>
            <View style={styles.buttonRow}>
              <MedicalButton onPress={() => navigateToCategory("Medical")} />
              <TransportButton
                onPress={() => navigateToCategory("Transport")}
              />
            </View>
            <View style={styles.buttonRow}>
              <EducationButton
                onPress={() => navigateToCategory("Education")}
              />
              <OtherButton onPress={() => navigateToCategory("Other")} />
            </View>
          </View>
        </View>
      </BottomBackground>
    </>
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
    paddingHorizontal: wp(4),
  },
  buttonGridWrapper: {
    marginTop: hp(3),
  },
  buttonGrid: {
    gap: hp(2),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp(4),
  },
});
