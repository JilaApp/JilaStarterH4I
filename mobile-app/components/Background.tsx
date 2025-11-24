import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/colors";

interface BackgroundProps {
  children: React.ReactNode;
}

const { height: screenHeight } = Dimensions.get("window");

const DARK_RED = "#7E0601"; 
const TOP_SECTION_HEIGHT_PCT = 0.55;

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

export default function Background({ children }: BackgroundProps) {
  return (
    <View style={styles.container}>
      <View style={styles.redRevealLayer} />
      <LinearGradient
        colors={["#E8965B", DARK_RED]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topHalf}
      >
        <LogoPanel />
      </LinearGradient>
      <View style={styles.bottomHalf} />
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
    top: screenHeight * TOP_SECTION_HEIGHT_PCT,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: DARK_RED,
  },
  topHalf: {
    height: screenHeight * TOP_SECTION_HEIGHT_PCT,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 70,
    overflow: "hidden",
    zIndex: 1,
  },
  bottomHalf: {
    position: "absolute",
    top: screenHeight * TOP_SECTION_HEIGHT_PCT,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cream[300],
    borderTopRightRadius: 100,
    zIndex: 2,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: 172,
    height: 172,
  },
  contentContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 44,
  },
});