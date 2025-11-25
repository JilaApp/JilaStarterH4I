import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { colors } from "@/colors";
import { sizes, componentSizes } from "@/constants/sizes";

interface DisplayBoxProps {
  children: React.ReactNode;
  minHeight?: number;
  maxHeight?: number;
}

export default function DisplayBox({
  children,
  minHeight = componentSizes.displayBox.minHeight,
  maxHeight = componentSizes.displayBox.maxHeight,
}: DisplayBoxProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.innerBox, { minHeight, maxHeight }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {children}
        </ScrollView>
      </View>
      <Image
        source={require("@/assets/images/display-box-tail.png")}
        style={styles.tail}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  innerBox: {
    backgroundColor: colors.white[400],
    borderRadius: sizes.borderRadius.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: sizes.spacing.xs },
    shadowOpacity: 0.1,
    shadowRadius: 80,
    elevation: 10,
    zIndex: 2,
    overflow: "hidden",
  },
  scrollView: {
    width: "100%",
  },
  scrollContent: {
    padding: sizes.spacing.xl,
    flexGrow: 1,
  },
  tail: {
    position: "absolute",
    bottom: "-25%",
    right: "-12%",
    width: componentSizes.displayBox.tailSize,
    height: componentSizes.displayBox.tailSize,
    zIndex: 1,
  },
});
