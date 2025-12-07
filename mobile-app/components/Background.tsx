import React from "react";
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/colors";
import { sizes, componentSizes } from "@/constants/sizes";
import BottomBackground from "./BottomBackground";

interface BackgroundProps {
  children: React.ReactNode;
  showLogo?: boolean;
}

function LogoPanel() {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("@/assets/images/jila-quote.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

export default function Background({
  children,
  showLogo = true,
}: BackgroundProps) {
  return (
    <View style={styles.container}>
      <View style={styles.redRevealLayer} />
      <LinearGradient
        colors={[colors.orange[400], colors.jila[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topHalf}
      >
        {showLogo && <LogoPanel />}
      </LinearGradient>
      <BottomBackground />
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream[300],
  },
  redRevealLayer: {
    position: "absolute",
    top: sizes.screen.height * 0.55,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.jila[400],
  },
  topHalf: {
    height: sizes.screen.height * 0.55,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomLeftRadius: sizes.borderRadius.curved,
    overflow: "hidden",
    zIndex: 1,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: sizes.screen.height * 0.05,
  },
  logo: {
    width: componentSizes.logo.background.width,
    height: componentSizes.logo.background.height,
  },
  contentContainer: {
    position: "absolute",
    top: sizes.screen.height * 0.3,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: sizes.spacing.lg,
  },
});
